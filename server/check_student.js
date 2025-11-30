const mongoose = require('mongoose');
const User = require('./src/models/User');

async function checkStudent() {
    try {
        await mongoose.connect('mongodb://localhost:27017/husums');
        console.log('✅ Connected to MongoDB\n');

        // Find user by student ID
        const user = await User.findOne({ studentId: '1209/16' });

        if (user) {
            console.log('📋 Found Student:');
            console.log(`   Student ID: "${user.studentId}"`);
            console.log(`   First Name: "${user.firstName}"`);
            console.log(`   Last Name: "${user.lastName}"`);
            console.log(`   Full Name: "${user.firstName} ${user.lastName}"`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Email: ${user.email}\n`);

            // Check for spaces
            console.log('🔍 Checking for hidden characters:');
            console.log(`   Student ID length: ${user.studentId.length}`);
            console.log(`   First Name length: ${user.firstName.length}`);
            console.log(`   Last Name length: ${user.lastName.length}\n`);

            // Test the verification logic
            const testFullName = 'Ezedin Aliyi Usman';
            const userFullName = `${user.firstName} ${user.lastName}`.toLowerCase();
            const providedName = testFullName.toLowerCase().trim();

            console.log('🧪 Testing Verification Logic:');
            console.log(`   Database Full Name (lowercase): "${userFullName}"`);
            console.log(`   Provided Name (lowercase): "${providedName}"`);
            console.log(`   Match: ${userFullName === providedName ? '✅ YES' : '❌ NO'}\n`);

        } else {
            console.log('❌ No user found with Student ID: 1209/16\n');
        }

        // List all users to see what's in the database
        const allUsers = await User.find({}).select('studentId firstName lastName role');
        console.log(`📊 Total users in database: ${allUsers.length}\n`);
        console.log('First 5 users:');
        allUsers.slice(0, 5).forEach(u => {
            console.log(`   ${u.studentId} - ${u.firstName} ${u.lastName} (${u.role})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkStudent();
