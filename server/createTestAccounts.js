const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/husums');

const User = require('./src/models/User');

async function createTestAccounts() {
    try {
        console.log('🔄 Clearing existing test accounts...');

        // Delete existing test accounts
        await User.deleteMany({
            studentId: { $in: ['SEC001', 'MEM001', 'MEM002', 'MEM003'] }
        });

        console.log('✅ Cleared old test accounts\n');

        // Create secretary
        const salt = await bcrypt.genSalt(10);
        const secretaryPassword = await bcrypt.hash('secretary123', salt);

        await User.create({
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
            console.log(`✅ Created Member: ${member.studentId} / member123 (${member.firstName} ${member.lastName})`);
        }

        console.log('\n📊 Test accounts ready!');
        console.log('\nLogin Credentials:');
        console.log('Secretary: SEC001 / secretary123');
        console.log('Members: MEM001, MEM002, MEM003 / member123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createTestAccounts();
