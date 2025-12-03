const mongoose = require('mongoose');
const User = require('./models/User');

async function findStudent2494() {
    try {
        await mongoose.connect('mongodb://localhost:27017/husums');
        console.log('Connected to MongoDB\n');

        // Find the student with 2494 in their ID
        const student = await User.findOne({ studentId: { $regex: '2494' } });

        if (student) {
            console.log('Student Record:');
            console.log(`  _id: ${student._id}`);
            console.log(`  studentId: "${student.studentId}"`);
            console.log(`  firstName: "${student.firstName}"`);
            console.log(`  lastName: "${student.lastName}"`);
            console.log(`  role: ${student.role}`);

            // Check for whitespace
            console.log(`\nWhitespace Check:`);
            console.log(`  studentId has leading space: ${student.studentId.startsWith(' ')}`);
            console.log(`  studentId has trailing space: ${student.studentId.endsWith(' ')}`);
            console.log(`  studentId length: ${student.studentId.length}`);
            console.log(`  studentId trimmed: "${student.studentId.trim()}"`);
            console.log(`  studentId trimmed length: ${student.studentId.trim().length}`);
        } else {
            console.log('Student with 2494 not found');
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        await mongoose.connection.close();
    }
}

findStudent2494();
