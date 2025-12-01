const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const resetMemberPassword = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/husums');
        console.log('Connected to DB');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        const user = await User.findOneAndUpdate(
            { studentId: 'MEM001' },
            { password: hashedPassword },
            { new: true }
        );

        if (user) {
            console.log('✅ Password reset successfully for MEM001 to "123456"');
        } else {
            console.log('❌ User MEM001 not found');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetMemberPassword();
