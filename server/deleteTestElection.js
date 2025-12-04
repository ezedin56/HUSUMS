const mongoose = require('mongoose');
require('dotenv').config();

const Election = require('./src/models/Election');
const Candidate = require('./src/models/Candidate');
const Vote = require('./src/models/Vote');

async function deleteTestElection() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find and delete the test election
        const testElection = await Election.findOne({ title: 'HUSUMS Public Election 2025' });

        if (testElection) {
            console.log('Found test election:', testElection.title);

            // Delete associated candidates
            const deletedCandidates = await Candidate.deleteMany({ electionId: testElection._id });
            console.log(`Deleted ${deletedCandidates.deletedCount} test candidates`);

            // Delete associated votes
            const deletedVotes = await Vote.deleteMany({ electionId: testElection._id });
            console.log(`Deleted ${deletedVotes.deletedCount} test votes`);

            // Delete the election
            await Election.deleteOne({ _id: testElection._id });
            console.log('Deleted test election');
        } else {
            console.log('No test election found');
        }

        // Show remaining elections
        console.log('\n--- Remaining Elections ---');
        const elections = await Election.find({ electionType: 'public' })
            .populate('createdBy', 'firstName lastName role');

        console.log(`Total public elections: ${elections.length}\n`);

        for (const election of elections) {
            console.log(`Election: ${election.title}`);
            console.log(`  ID: ${election._id}`);
            console.log(`  Status: ${election.status}`);
            console.log(`  Open: ${election.isOpen}`);
            console.log(`  Type: ${election.electionType}`);

            const candidates = await Candidate.find({ electionId: election._id })
                .populate('userId', 'firstName lastName');

            console.log(`  Candidates: ${candidates.length}`);
            candidates.forEach(c => {
                console.log(`    - ${c.userId?.firstName || 'Unknown'} ${c.userId?.lastName || ''} for ${c.position}`);
            });
            console.log('');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

deleteTestElection();
