const mongoose = require('mongoose');
const User = require('./models/User');

async function verifyStudent() {
    try {
        await mongoose.connect('mongodb://localhost:27017/husums');
        console.log('Connected to MongoDB\n');

        const studentId = '2494/16';
        const student = await User.findOne({ studentId });

        if (student) {
            console.log('✅ Student found in database!\n');
            console.log('Student Details:');
            console.log(`   Student ID: "${student.studentId}"`);
            console.log(`   First Name: "${student.firstName}"`);
            console.log(`   Last Name: "${student.lastName}"`);
            console.log(`   Full Name: "${student.firstName} ${student.lastName}"`);
            console.log(`   Role: ${student.role}`);
            console.log('\n💡 For public voting, use exactly:');
            console.log(`   Student ID: ${student.studentId}`);
            console.log(`   Full Name: ${student.firstName} ${student.lastName}`);
        } else {
            console.log(`❌ Student with ID "${studentId}" not found in database`);
        }

        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    } catch (error) {
        console.error('Error:', error);
        await mongoose.connection.close();
    }
}

verifyStudent();
