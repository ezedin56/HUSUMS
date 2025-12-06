require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

async function testConnection() {
    console.log("Checking MONGO_URI...");
    if (!process.env.MONGO_URI) {
        console.error("ERROR: MONGO_URI is not set in .env");
        return;
    }
    console.log("MONGO_URI is set (hidden for security)");

    try {
        console.log("Attempting to connect to MongoDB Atlas...");
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("SUCCESS: Connected to MongoDB Atlas!");
        await mongoose.disconnect();
    } catch (error) {
        console.error("FAILURE: Could not connect to MongoDB Atlas.");
        console.error("Error Message:", error.message);
        console.error("Full Error:", error);
    }
}

testConnection();
