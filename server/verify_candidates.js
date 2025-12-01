require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

const verifyCandidates = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const users = [
            { id: 'ADMIN001', role: 'publicvote_admin' },
            { id: 'CAND001', role: 'candidate (member)' },
            { id: 'CAND002', role: 'candidate (member)' },
            { id: 'CAND003', role: 'candidate (member)' }
        ];

        for (const u of users) {
            const user = await User.findOne({ studentId: u.id });
            if (user) {
                const isMatch = await bcrypt.compare('123456', user.password) || await bcrypt.compare('admin123', user.password);
                if (isMatch) {
                    console.log(`✅ Login successful for ${u.role} (${u.id})`);
                } else {
                    console.log(`❌ Password mismatch for ${u.role} (${u.id})`);
                }
            } else {
                console.log(`❌ User not found: ${u.role} (${u.id})`);
            }
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

verifyCandidates();
