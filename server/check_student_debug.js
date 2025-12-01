require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const checkStudent = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const studentId = '1209/16';
        const user = await User.findOne({ studentId });

        if (user) {
            console.log(`Found student: ${user.firstName} ${user.lastName} (${user.studentId})`);
        } else {
            console.log(`Student with ID ${studentId} NOT found.`);
        }

        const count = await User.countDocuments();
        console.log(`Total users in DB: ${count}`);

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

checkStudent();
