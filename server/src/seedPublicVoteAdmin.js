const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');
const User = require('./models/User');

const seedPublicVoteAdmin = async () => {
    try {
        await connectDB();

        console.log('Creating public vote admin account...\n');

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        // Create admin account
        const adminData = {
            studentId: '1122/15',
            email: 'publicvote@hu.edu.et',
            password: hashedPassword,
            role: 'publicvote_admin',
            firstName: 'Public',
            lastName: 'Admin',
            year: 4,
            isProfileComplete: true,
            isApproved: true
        };

        const existing = await User.findOne({ studentId: adminData.studentId });
        if (!existing) {
            await User.create(adminData);
            console.log(`✅ Created public vote admin: ${adminData.firstName} ${adminData.lastName}`);
        } else {
            console.log(`⚠️  Admin already exists: ${existing.firstName} ${existing.lastName}`);
        }

        console.log('\n📋 Public Vote Admin Credentials:');
        console.log('   Student ID: 1122/15');
        console.log('   Password: 123456');
        console.log('   Role: publicvote_admin');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
};

seedPublicVoteAdmin();
