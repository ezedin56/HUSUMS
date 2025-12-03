const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function addStudent() {
    try {
        await mongoose.connect('mongodb://localhost:27017/husums');
        console.log('Connected to MongoDB\n');

        const studentId = '2494/16';
        const firstName = 'Sultan Adinan';
        const lastName = 'Yusuf';

        // Check if student already exists
        const existingStudent = await User.findOne({ studentId });
        if (existingStudent) {
            console.log(`❌ Student with ID ${studentId} already exists!`);
            console.log(`   Name: ${existingStudent.firstName} ${existingStudent.lastName}`);
            await mongoose.connection.close();
            return;
        }

        // Create default password (you can change this)
        const defaultPassword = 'password123';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // Create new student
        const newStudent = await User.create({
            studentId,
            firstName,
            lastName,
            password: hashedPassword,
            role: 'member',
            department: 'General',
            year: 3
        });

        console.log('✅ Student added successfully!\n');
        console.log('Student Details:');
        console.log(`   Student ID: ${newStudent.studentId}`);
        console.log(`   Full Name: ${newStudent.firstName} ${newStudent.lastName}`);
        console.log(`   Role: ${newStudent.role}`);
        console.log(`   Default Password: ${defaultPassword}`);
        console.log('\n💡 For public voting, use:');
        console.log(`   Student ID: ${newStudent.studentId}`);
        console.log(`   Full Name: ${firstName} ${lastName}`);

        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    } catch (error) {
        console.error('Error:', error);
        await mongoose.connection.close();
    }
}

addStudent();
