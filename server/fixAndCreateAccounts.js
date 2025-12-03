const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/husums');

const User = require('./src/models/User');

async function fixAndCreateAccounts() {
    try {
        console.log('🔧 Fixing database indexes...');

        // Drop the email index if it exists
        try {
            await User.collection.dropIndex('email_1');
            console.log('✅ Dropped old email index');
        } catch (e) {
            console.log('ℹ️  No email index to drop');
        }

        // Delete all users with null emails
        await User.deleteMany({ email: null });
        console.log('✅ Cleaned up null email records');

        // Delete existing test accounts
        await User.deleteMany({
            studentId: { $in: ['SEC001', 'MEM001', 'MEM002', 'MEM003'] }
        });
        console.log('✅ Cleared old test accounts\n');

        // Create secretary
        const salt = await bcrypt.genSalt(10);
        const secretaryPassword = await bcrypt.hash('secretary123', salt);

        const secretary = await User.create({
            studentId: 'SEC001',
            email: 'secretary@hu.edu.et',
            password: secretaryPassword,
            role: 'secretary',
            firstName: 'Sarah',
            lastName: 'Secretary',
            department: 'Administration'
        });
        console.log('✅ Created Secretary: SEC001 / secretary123');

        // Create test members
        const memberPassword = await bcrypt.hash('member123', salt);

        const members = [
            { studentId: 'MEM001', email: 'john.doe@student.hu.edu.et', firstName: 'John', lastName: 'Doe', department: 'Computer Science' },
            { studentId: 'MEM002', email: 'jane.smith@student.hu.edu.et', firstName: 'Jane', lastName: 'Smith', department: 'Engineering' },
            { studentId: 'MEM003', email: 'bob.johnson@student.hu.edu.et', firstName: 'Bob', lastName: 'Johnson', department: 'Business' }
        ];

        for (const member of members) {
            await User.create({
                ...member,
                password: memberPassword,
                role: 'member'
            });
            console.log(`✅ Created Member: ${member.studentId} / member123`);
        }

        console.log('\n✨ All test accounts created successfully!');
        console.log('\n📝 Login Credentials:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Secretary:');
        console.log('  Student ID: SEC001');
        console.log('  Password:   secretary123');
        console.log('\nMembers:');
        console.log('  Student ID: MEM001, MEM002, MEM003');
        console.log('  Password:   member123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixAndCreateAccounts();
