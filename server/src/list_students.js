const mongoose = require('mongoose');
const User = require('./models/User');

async function listStudents() {
    try {
        await mongoose.connect('mongodb://localhost:27017/husums');
        console.log('Connected to MongoDB\n');

        // Find all users with role 'member'
        const students = await User.find({ role: 'member' })
            .select('studentId firstName lastName email')
            .limit(10);

        console.log(`Found ${students.length} student(s):\n`);

        students.forEach((student, index) => {
            console.log(`${index + 1}. Student ID: ${student.studentId}`);
            console.log(`   Name: ${student.firstName} ${student.lastName}`);
            console.log(`   Email: ${student.email || 'N/A'}`);
            console.log('');
        });

        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error:', error);
        await mongoose.connection.close();
    }
}

listStudents();
