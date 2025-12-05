require('dotenv').config();
const mongoose = require('mongoose');
const AllowedVoter = require('./src/models/AllowedVoter');

async function checkAllowedVoters() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const voters = await AllowedVoter.find().limit(20);
        console.log(`\nFound ${voters.length} allowed voters:\n`);

        voters.forEach((voter, index) => {
            console.log(`${index + 1}. Student ID: ${voter.studentId} | Name: ${voter.fullName}`);
        });

        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkAllowedVoters();
