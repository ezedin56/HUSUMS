const mongoose = require('mongoose');
const connectDB = require('./config/database');
const User = require('./models/User');
const Election = require('./models/Election');

const verifyData = async () => {
    try {
        await connectDB();
        console.log('\n--- Data Verification ---');

        const userCount = await User.countDocuments();
        console.log(`Users found: ${userCount}`);

        const users = await User.find({}, 'firstName lastName role studentId');
        users.forEach(u => console.log(` - ${u.firstName} ${u.lastName} (${u.role}) [${u.studentId}]`));

        const electionCount = await Election.countDocuments();
        console.log(`\nElections found: ${electionCount}`);

        const elections = await Election.find({});
        elections.forEach(e => console.log(` - ${e.title} (${e.status})`));

        console.log('\n-------------------------');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verifyData();
