const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const migrateVoteIndex = require('./migrateVoteIndex');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;

        // CASE 1: Production / Atlas / Explicit URI
        // If a URI is provided, we MUST connect to it. No fallbacks allowed.
        if (mongoURI) {
            console.log('Connecting to configured MongoDB URI...');
            try {
                const conn = await mongoose.connect(mongoURI, {
                    serverSelectionTimeoutMS: 15000 // 15s timeout
                });
                console.log(`MongoDB Connected: ${conn.connection.host}`);

                // Run automatic migration for vote indexes
                await migrateVoteIndex();
                return false; // Not in-memory
            } catch (error) {
                console.error('FATAL ERROR: Could not connect to the provided MONGO_URI.');
                console.error('Error details:', error.message);
                console.error('The server will NOT fall back to in-memory database to prevent data loss.');
                process.exit(1); // Exit process so container restarts or user sees error
            }
        }

        // CASE 2: Local Development (No URI provided)
        // Try local mongodb first, then fallback to memory
        console.log('No MONGO_URI found. Trying local MongoDB (mongodb://localhost:27017/husums)...');
        try {
            const conn = await mongoose.connect('mongodb://localhost:27017/husums');
            console.log(`Local MongoDB Connected: ${conn.connection.host}`);
            await migrateVoteIndex();
            return false;
        } catch (localError) {
            console.log('Local MongoDB not found. Starting in-memory MongoDB (TEMPORARY DATA ONLY)...');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            const conn = await mongoose.connect(uri);
            console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
            console.warn('WARNING: You are using an in-memory database. Data will be LOST on restart.');

            await migrateVoteIndex();
            return true; // Is in-memory
        }

    } catch (error) {
        console.error(`Unexpected Database Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
