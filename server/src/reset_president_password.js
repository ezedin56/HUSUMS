const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');
const { User } = require('./models');

const resetPassword = async () => {
    try {
        await connectDB();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const president = await User.findOne({ studentId: 'PRES001' });
        if (president) {
            president.password = hashedPassword;
            await president.save();
            console.log('Password for PRES001 reset to password123');
        } else {
            console.log('President PRES001 not found');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetPassword();
