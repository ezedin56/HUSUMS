const mongoose = require('mongoose');
const Candidate = require('./src/models/Candidate');
const Election = require('./src/models/Election');
const User = require('./src/models/User');
require('dotenv').config();

const checkCandidates = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const elections = await Election.find();
        console.log(`Found ${elections.length} elections`);

        for (const election of elections) {
            console.log(`\nElection: ${election.title} (ID: ${election._id})`);
            const candidates = await Candidate.find({ electionId: election._id }).populate('userId');
            console.log(`Found ${candidates.length} candidates`);

            candidates.forEach(c => {
                console.log(` - Name: ${c.userId ? c.userId.firstName + ' ' + c.userId.lastName : 'Unknown'}`);
                console.log(`   Position: ${c.position}`);
                console.log(`   Photo Path: ${c.photo}`);
            });
        }

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkCandidates();
