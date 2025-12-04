const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');

async function createAccountsInAtlas() {
    try {
        // Explicitly use the MONGO_URI from .env
        const mongoURI = process.env.MONGO_URI;
        console.log('🔗 Connecting to:', mongoURI ? 'MongoDB Atlas (cloud)' : 'Local MongoDB');

        await mongoose.connect(mongoURI);
        console.log('✅ Connected to:', mongoose.connection.host);
        console.log('📊 Database:', mongoose.connection.name);

        // Check if user already exists
        const existing = await User.findOne({ studentId: 'MEM001' });
        if (existing) {
            console.log('\n⚠️  User MEM001 already exists!');
            console.log('Details:', {
                studentId: existing.studentId,
                email: existing.email,
                role: existing.role,
                hasPassword: !!existing.password
            });

            // Test password
            const isMatch = await bcrypt.compare('member123', existing.password);
            console.log('Password "member123" matches:', isMatch);

            if (!isMatch) {
                console.log('\n🔧 Fixing password...');
                const salt = await bcrypt.genSalt(10);
                existing.password = await bcrypt.hash('member123', salt);
                await existing.save();
                console.log('✅ Password updated!');
            }

            process.exit(0);
        }

        // Delete any test accounts first
        await User.deleteMany({
            studentId: { $in: ['SEC001', 'MEM001', 'MEM002', 'MEM003'] }
        });
        console.log('✅ Cleared old test accounts\n');

        // Create accounts
        const salt = await bcrypt.genSalt(10);
        const secretaryPassword = await bcrypt.hash('secretary123', salt);
        const memberPassword = await bcrypt.hash('member123', salt);

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

        console.log('\n✨ All accounts created in Atlas database!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

createAccountsInAtlas();
