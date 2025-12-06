const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');

async function resetAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const studentId = 'ADMIN001';
        const password = 'admin123';
        const role = 'publicvote_admin';

        let admin = await User.findOne({ studentId });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (admin) {
            console.log(`User ${studentId} found. Updating password...`);
            admin.password = hashedPassword;
            admin.role = role; // Ensure correct role
            await admin.save();
            console.log('✅ Password updated successfully.');
        } else {
            console.log(`User ${studentId} not found. Creating new admin account...`);
            admin = await User.create({
                studentId,
                password: hashedPassword,
                role,
                firstName: 'Public',
                lastName: 'Admin',
                email: 'admin@husums.edu.et',
                department: 'Administration'
            });
            console.log('✅ Admin account created successfully.');
        }

        console.log(`\nCredentials verified:`);
        console.log(`Student ID: ${studentId}`);
        console.log(`Password:   ${password}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

resetAdmin();
