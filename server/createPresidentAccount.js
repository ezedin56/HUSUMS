const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');

async function createPresidentAccount() {
    try {
        const mongoURI = process.env.MONGO_URI;
        console.log('🔗 Connecting to Atlas...');
        await mongoose.connect(mongoURI);

        // Check if president already exists
        const existing = await User.findOne({ studentId: 'PRES001' });
        if (existing) {
            console.log('✅ President account already exists');
            const salt = await bcrypt.genSalt(10);
            existing.password = await bcrypt.hash('president123', salt);
            await existing.save();
            console.log('✅ Password updated to: president123');
            process.exit(0);
        }

        // Create president account
        const hashedPassword = await bcrypt.hash('president123', 10);

        await User.create({
            studentId: 'PRES001',
            email: 'president@husums.edu',
            password: hashedPassword,
            firstName: 'John',
            lastName: 'President',
            role: 'president',
            department: 'Administration',
            isActive: true
        });

        console.log('✅ President account created successfully!');
        console.log('   StudentID: PRES001');
        console.log('   Password: president123');
        console.log('   Role: president');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

createPresidentAccount();
