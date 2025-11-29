const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');
const User = require('./models/User');

const seedPresident = async () => {
    try {
        await connectDB();

        console.log('Creating president account...\n');

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        // Create president account
        const presidentData = {
            studentId: 'PRES001',
            email: 'president@hu.edu.et',
            password: hashedPassword,
            role: 'president',
            firstName: 'John',
            lastName: 'Doe',
            year: 4,
            isProfileComplete: true,
            isApproved: true
        };

        const existing = await User.findOne({ studentId: presidentData.studentId });
        if (!existing) {
            await User.create(presidentData);
            console.log(`✅ Created president account: ${presidentData.firstName} ${presidentData.lastName}`);
        } else {
            console.log(`⚠️  President account already exists: ${existing.firstName} ${existing.lastName}`);
        }

        console.log('\n📋 President Login Credentials:');
        console.log('   Student ID: PRES001');
        console.log('   Email: president@hu.edu.et');
        console.log('   Password: 123456');
        console.log('   Role: president');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating president account:', error);
        process.exit(1);
    }
};

seedPresident();
