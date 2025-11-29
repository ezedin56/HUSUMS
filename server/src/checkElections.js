const mongoose = require('mongoose');
const connectDB = require('./config/database');
const Election = require('./models/Election');

const checkElections = async () => {
    try {
        await connectDB();

        console.log('Checking elections...\n');

        const elections = await Election.find({});
        console.log(`Found ${elections.length} election(s):\n`);

        elections.forEach(election => {
            console.log(`Title: ${election.title}`);
            console.log(`Status: ${election.status}`);
            console.log(`isOpen: ${election.isOpen}`);
            console.log(`Start: ${election.startDate}`);
            console.log(`End: ${election.endDate}`);
            console.log(`ID: ${election._id}`);
            console.log('---');
        });

        // Update election to be open if it exists
        if (elections.length > 0) {
            const election = elections[0];
            election.isOpen = true;
            election.status = 'ongoing';
            await election.save();
            console.log('\n✅ Updated election to isOpen: true, status: ongoing');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkElections();
