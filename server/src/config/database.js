const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const migrateVoteIndex = require('./migrateVoteIndex');

const connectDB = async () => {
    try {
        // Try connecting to MongoDB (Env or Local)
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/husums';
        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000 // Increased timeout for Atlas connections
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Run automatic migration for vote indexes
        await migrateVoteIndex();

        return false; // Not in-memory
    } catch (error) {
        console.log('Local MongoDB not found, starting in-memory MongoDB...');
        try {
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            const conn = await mongoose.connect(uri);
            console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);

            // Run automatic migration for vote indexes
            await migrateVoteIndex();

            return true; // Is in-memory
        } catch (memError) {
            console.error(`Error starting in-memory DB: ${memError.message}`);
            process.exit(1);
        }
    }
};

module.exports = connectDB;
