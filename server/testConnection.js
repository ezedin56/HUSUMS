const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('Testing MongoDB Atlas connection...\n');
        console.log('MONGO_URI:', process.env.MONGO_URI ? 'Found in .env' : 'NOT FOUND');
        console.log('Connection string:', process.env.MONGO_URI?.substring(0, 30) + '...\n');

        console.log('Attempting to connect...');
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000
        });

        console.log('✅ Successfully connected to MongoDB!');
        console.log('Host:', conn.connection.host);
        console.log('Database:', conn.connection.name);
        console.log('Connection state:', conn.connection.readyState); // 1 = connected

        await mongoose.disconnect();
        console.log('\n✅ Test completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Connection failed!');
        console.error('Error:', error.message);
        process.exit(1);
    }
}

testConnection();
