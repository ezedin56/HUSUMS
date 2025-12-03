// Test script to check elections in database
const mongoose = require('mongoose');
require('dotenv').config();

const Election = require('./src/models/Election');
const Candidate = require('./src/models/Candidate');

const checkElections = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check all elections
        const allElections = await Election.find({});
        console.log(`\n📊 Total Elections: ${allElections.length}`);

        if (allElections.length > 0) {
            console.log('\n--- All Elections ---');
            allElections.forEach((election, index) => {
                console.log(`\n${index + 1}. ${election.title}`);
                console.log(`   ID: ${election._id}`);
                console.log(`   Status: ${election.status}`);
                console.log(`   isOpen: ${election.isOpen}`);
                console.log(`   Start: ${election.startDate}`);
                console.log(`   End: ${election.endDate}`);
                console.log(`   Created By: ${election.createdBy}`);
            });
        }

        // Check ongoing elections
        const ongoingElections = await Election.find({ status: 'ongoing', isOpen: true });
        console.log(`\n🔴 Ongoing Elections: ${ongoingElections.length}`);

        if (ongoingElections.length > 0) {
            for (const election of ongoingElections) {
                const candidates = await Candidate.find({ electionId: election._id });
                console.log(`\n   "${election.title}" has ${candidates.length} candidates`);
            }
        }

        // Check completed elections
        const completedElections = await Election.find({ status: 'completed' });
        console.log(`\n✅ Completed Elections: ${completedElections.length}`);

        // Check upcoming elections
        const upcomingElections = await Election.find({ status: 'upcoming' });
        console.log(`\n⏰ Upcoming Elections: ${upcomingElections.length}`);

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

checkElections();
