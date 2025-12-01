const mongoose = require('mongoose');
const User = require('./models/User');

async function removeEmailsAndIndex() {
    try {
        await mongoose.connect('mongodb://localhost:27017/husums');
        console.log('✅ Connected to database\n');

        // Step 1: Drop the email unique index if it exists
        try {
            await User.collection.dropIndex('email_1');
            console.log('✅ Dropped unique index on email field');
        } catch (error) {
            if (error.code === 27) {
                console.log('ℹ️  Email index does not exist (already removed)');
            } else {
                console.log('⚠️  Could not drop index:', error.message);
            }
        }

        // Step 2: Remove email from all users
        const result = await User.updateMany(
            {},
            { $unset: { email: "" } }
        );

        console.log(`✅ Removed email from ${result.modifiedCount} users\n`);

        // Step 3: Verify - list all users without email
        const users = await User.find({}, 'studentId firstName lastName email');
        console.log('========================================');
        console.log('    UPDATED USER LIST');
        console.log('========================================');
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.studentId} - ${user.firstName} ${user.lastName}`);
            console.log(`   Email: ${user.email || 'NULL ✓'}`);
        });
        console.log('========================================\n');

        await mongoose.connection.close();
        console.log('✅ Database cleanup complete!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

removeEmailsAndIndex();
