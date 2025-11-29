const mongoose = require('mongoose');
const connectDB = require('./config/database');
const User = require('./models/User');

const deletePresident = async () => {
    try {
        await connectDB();
        console.log('Deleting president account...');

        const result = await User.deleteOne({ studentId: 'PRES001' });

        if (result.deletedCount > 0) {
            console.log('✅ President account (PRES001) deleted successfully.');
        } else {
            console.log('⚠️ President account not found.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

deletePresident();
