require('dotenv').config();
const mongoose = require('mongoose');
const AllowedVoter = require('./src/models/AllowedVoter');

async function addTestVoter() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Add the test voter
        const studentId = '1209/16';
        const fullName = 'Ezedin Aliyi Usman';

        // Check if already exists
        const existing = await AllowedVoter.findOne({ studentId });

        if (existing) {
            console.log(`\nStudent ${studentId} already exists with name: ${existing.fullName}`);
        } else {
            await AllowedVoter.create({
                studentId,
                fullName
            });
            console.log(`\n✅ Successfully added: ${studentId} - ${fullName}`);
        }

        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

addTestVoter();
