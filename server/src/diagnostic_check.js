const mongoose = require('mongoose');
const User = require('./models/User');

async function diagnosticCheck() {
    try {
        await mongoose.connect('mongodb://localhost:27017/husums');
        console.log('✅ Connected to MongoDB\n');

        // Check total users
        const totalUsers = await User.countDocuments();
        console.log(`Total users in database: ${totalUsers}\n`);

        // Check users with role 'member'
        const totalMembers = await User.countDocuments({ role: 'member' });
        console.log(`Total members: ${totalMembers}\n`);

        // Try to find the newly added student
        const testStudentIds = ['2494/16', '1208/16', 'MEM001'];

        for (const sid of testStudentIds) {
            console.log(`Searching for Student ID: "${sid}"`);
            const user = await User.findOne({ studentId: sid });

            if (user) {
                console.log(`  ✅ FOUND`);
                console.log(`     First Name: "${user.firstName}"`);
                console.log(`     Last Name: "${user.lastName}"`);
                console.log(`     Full Name: "${user.firstName} ${user.lastName}"`);
                console.log(`     Role: ${user.role}`);
            } else {
                console.log(`  ❌ NOT FOUND`);
            }
            console.log('');
        }

        // List all student IDs in the database
        console.log('\nAll Student IDs in database:');
        const allUsers = await User.find({}).select('studentId firstName lastName').limit(15);
        allUsers.forEach((u, i) => {
            console.log(`${i + 1}. "${u.studentId}" - ${u.firstName} ${u.lastName}`);
        });

        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    } catch (error) {
        console.error('Error:', error);
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
    }
}

diagnosticCheck();
