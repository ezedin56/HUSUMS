const mongoose = require('mongoose');
const User = require('./models/User');

async function checkStudentIds() {
    try {
        await mongoose.connect('mongodb://localhost:27017/husums');
        console.log('Connected to database');

        // Get all users with their student IDs
        const users = await User.find({}, 'studentId firstName lastName email role');

        console.log('\n=== ALL STUDENT IDs IN DATABASE ===');
        console.log(`Total users: ${users.length}\n`);

        users.forEach((user, index) => {
            console.log(`${index + 1}. Student ID: "${user.studentId}"`);
            console.log(`   Name: ${user.firstName} ${user.lastName}`);
            console.log(`   Email: ${user.email || 'No email'}`);
            console.log(`   Role: ${user.role}`);
            console.log('');
        });

        console.log('=== CHECK COMPLETE ===\n');

        // Ask if user wants to delete all non-admin users
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question('Do you want to delete all members (keeps president/secretary)? (yes/no): ', async (answer) => {
            if (answer.toLowerCase() === 'yes') {
                const result = await User.deleteMany({
                    role: { $nin: ['president', 'secretary', 'vp'] }
                });
                console.log(`\nDeleted ${result.deletedCount} members (kept admins)`);
            } else {
                console.log('\nNo users deleted');
            }

            readline.close();
            process.exit(0);
        });

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkStudentIds();
