const mongoose = require('mongoose');
const { User } = require('./models');
require('dotenv').config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/husums');
        console.log('MongoDB Connected');

        const users = await User.find({});
        console.log('Total users:', users.length);
        users.forEach(u => {
            console.log(`- ${u.firstName} ${u.lastName} (${u.studentId}) [${u.role}]`);
        });

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkUsers();
