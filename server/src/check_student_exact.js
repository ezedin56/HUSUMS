const mongoose = require('mongoose');
const User = require('./models/User');

async function checkStudentExact() {
    try {
        await mongoose.connect('mongodb://localhost:27017/husums');
        console.log('Connected to MongoDB\n');

        const studentId = '2494/16';
        const student = await User.findOne({ studentId });

        if (student) {
            console.log('✅ Student found!\n');
            console.log('Database Record:');
            console.log(`   Student ID: "${student.studentId}"`);
            console.log(`   First Name: "${student.firstName}"`);
            console.log(`   Last Name: "${student.lastName}"`);
            console.log(`   First Name length: ${student.firstName.length}`);
            console.log(`   Last Name length: ${student.lastName.length}`);

            const fullName = `${student.firstName} ${student.lastName}`;
            console.log(`\n   Full Name: "${fullName}"`);
            console.log(`   Full Name length: ${fullName.length}`);
            console.log(`   Lowercase trimmed: "${fullName.toLowerCase().trim()}"`);

            // Test different variations
            const variations = [
                'Sultan Adinan Yusuf',
                'sultan adinan yusuf',
                'Sultan  Adinan Yusuf',
                student.firstName + ' ' + student.lastName
            ];

            console.log('\n   Testing name variations:');
            variations.forEach(v => {
                const match = fullName.toLowerCase().trim() === v.toLowerCase().trim();
                console.log(`     "${v}" -> ${match ? '✅ MATCH' : '❌ NO MATCH'}`);
            });
        } else {
            console.log(`❌ Student "${studentId}" not found`);
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        await mongoose.connection.close();
    }
}

checkStudentExact();
