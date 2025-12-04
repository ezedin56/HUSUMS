const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

async function createTestStudent() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas\n');

        // Check if test student already exists
        const existing = await User.findOne({ studentId: 'TEST001' });

        if (existing) {
            console.log('✅ Test student already exists!');
            console.log(`   Student ID: ${existing.studentId}`);
            console.log(`   Full Name: ${existing.firstName} ${existing.lastName}`);
            console.log(`   Email: ${existing.email}`);
            console.log('\n📝 Use these credentials to test public voting:');
            console.log(`   Student ID: TEST001`);
            console.log(`   Full Name: Test Student`);
            process.exit(0);
            return;
        }

        // Create test student
        const hashedPassword = await bcrypt.hash('password123', 10);

        const testStudent = await User.create({
            studentId: 'TEST001',
            firstName: 'Test',
            lastName: 'Student',
            email: 'test.student@husums.edu',
            password: hashedPassword,
            role: 'member',
            department: 'Computer Science',
            year: '3rd Year',
            isActive: true
        });

        console.log('✅ Test student created successfully!\n');
        console.log('📝 Student Details:');
        console.log(`   Student ID: ${testStudent.studentId}`);
        console.log(`   Full Name: ${testStudent.firstName} ${testStudent.lastName}`);
        console.log(`   Email: ${testStudent.email}`);
        console.log(`   Department: ${testStudent.department}`);
        console.log(`   Year: ${testStudent.year}`);

        console.log('\n📝 Use these credentials to test public voting:');
        console.log(`   Student ID: TEST001`);
        console.log(`   Full Name: Test Student`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createTestStudent();
