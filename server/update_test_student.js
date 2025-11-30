const mongoose = require('mongoose');
const User = require('./src/models/User');

async function updateTestStudent() {
    try {
        await mongoose.connect('mongodb://localhost:27017/husums');
        console.log('✅ Connected to MongoDB\n');

        // Update the existing user
        const user = await User.findOneAndUpdate(
            { studentId: '1209/16' },
            {
                firstName: 'Ezedin',
                lastName: 'Aliyi Usman'
            },
            { new: true }
        );

        if (user) {
            console.log('🎉 Student updated successfully!\n');
            console.log('📋 Updated Student Details:');
            console.log(`   Full Name: ${user.firstName} ${user.lastName}`);
            console.log(`   Student ID: ${user.studentId}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Email: ${user.email}\n`);

            console.log('✅ You can now use these credentials to test public voting:');
            console.log(`   Student ID: 1209/16`);
            console.log(`   Full Name: Ezedin Aliyi Usman\n`);
        } else {
            console.log('❌ User not found');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

updateTestStudent();
