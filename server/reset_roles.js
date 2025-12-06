const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');

const ROLES_TO_RESET = [
    {
        studentId: 'SEC001',
        password: '123456',
        role: 'secretary',
        firstName: 'Sarah',
        lastName: 'Secretary',
        department: 'Administration',
        email: 'secretary@husums.edu.et'
    },
    {
        studentId: 'PRES001',
        password: '123456',
        role: 'president',
        firstName: 'John',
        lastName: 'President',
        department: 'Administration',
        email: 'president@husums.edu.et'
    },
    {
        studentId: 'VP001',
        password: '123456',
        role: 'vp',
        firstName: 'Victor',
        lastName: 'Vice',
        department: 'Administration',
        email: 'vp@husums.edu.et'
    }
];

async function resetRoles() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        for (const account of ROLES_TO_RESET) {
            let user = await User.findOne({ studentId: account.studentId });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(account.password, salt);

            if (user) {
                console.log(`Updating ${account.role} (${account.studentId})...`);
                user.password = hashedPassword;
                user.role = account.role;
                await user.save();
                console.log(`✅ ${account.role} password reset to: ${account.password}`);
            } else {
                console.log(`Creating ${account.role} (${account.studentId})...`);
                await User.create({
                    ...account,
                    password: hashedPassword,
                    isApproved: true,
                    isProfileComplete: true
                });
                console.log(`✅ ${account.role} created with password: ${account.password}`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

resetRoles();
