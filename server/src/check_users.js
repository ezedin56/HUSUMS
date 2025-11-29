const mongoose = require('mongoose');
const connectDB = require('./config/database');
const { User } = require('./models');

const checkUsers = async () => {
    try {
        await connectDB();
        const users = await User.find({}, 'firstName lastName studentId role email');
        console.log('Existing Users:', JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUsers();
