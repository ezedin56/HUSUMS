const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

async function createTestStudent() {
    try {
        await mongoose.connect('mongodb://localhost:27017/husums');
        console.log('✅ Connected to MongoDB\n');

        // Check if user already exists
        const existing = await User.findOne({ studentId: '1209/16' });
        if (existing) {
            console.log('⚠️  User already exists:');
            console.log(`   Name: ${existing.firstName} ${existing.lastName}`);
            console.log(`   Student ID: ${existing.studentId}`);
            console.log(`   Role: ${existing.role}\n`);
            process.exit(0);
        }

        // Create new test student
        const hashedPassword = await bcrypt.hash('123456', 10);

        const testStudent = await User.create({
            firstName: 'Ezedin',
            lastName: 'Aliyi Usman',
            studentId: '1209/16',
            password: hashedPassword,
            role: 'member',
            email: 'ezedin.aliyi@student.hu.edu.et',
            department: 'Computer Science',
            year: 4,
            avatar: 'https://ui-avatars.com/api/?name=Ezedin+Aliyi+Usman&size=200&background=4F46E5&color=fff'
        });

        console.log('🎉 Test student created successfully!\n');
        console.log('📋 Student Details:');
        console.log(`   Full Name: ${testStudent.firstName} ${testStudent.lastName}`);
        console.log(`   Student ID: ${testStudent.studentId}`);
        console.log(`   Password: 123456`);
        console.log(`   Role: ${testStudent.role}`);
        console.log(`   Email: ${testStudent.email}`);
        console.log(`   Department: ${testStudent.department}\n`);

        console.log('✅ You can now use these credentials to test public voting:');
        console.log(`   Student ID: 1209/16`);
        console.log(`   Full Name: Ezedin Aliyi Usman\n`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createTestStudent();
