const mongoose = require('mongoose');
const User = require('./models/User');

async function listStudentIds() {
    try {
        await mongoose.connect('mongodb://localhost:27017/husums');
        console.log('✅ Connected to database\n');

        // Get all users with their student IDs
        const users = await User.find({}, 'studentId firstName lastName email role');

        console.log('========================================');
        console.log('    ALL STUDENT IDs IN DATABASE');
        console.log('========================================');
        console.log(`Total users: ${users.length}\n`);

        if (users.length === 0) {
            console.log('No users found in database!\n');
        } else {
            users.forEach((user, index) => {
                console.log(`${index + 1}. Student ID: "${user.studentId}"`);
                console.log(`   Name: ${user.firstName || 'N/A'} ${user.lastName || 'N/A'}`);
                console.log(`   Email: ${user.email || 'No email'}`);
                console.log(`   Role: ${user.role}`);
                console.log('   ---');
            });
        }

        console.log('========================================\n');

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

listStudentIds();
