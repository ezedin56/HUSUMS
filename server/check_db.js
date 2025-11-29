const mongoose = require('mongoose');
const Election = require('./src/models/Election');
const Candidate = require('./src/models/Candidate');
const Vote = require('./src/models/Vote');

mongoose.connect('mongodb://localhost:27017/husums')
    .then(async () => {
        console.log('MongoDB Connected\n');

        // Check elections
        const elections = await Election.find({});
        console.log(`📊 Elections in database: ${elections.length}`);
        elections.forEach(e => {
            console.log(`  - ${e.title}`);
            console.log(`    Status: ${e.status}, isOpen: ${e.isOpen}`);
            console.log(`    ID: ${e._id}`);
        });

        // Check candidates
        console.log(`\n👥 Candidates in database:`);
        const candidates = await Candidate.find({}).populate('userId', 'firstName lastName');
        console.log(`  Total: ${candidates.length}`);
        candidates.forEach(c => {
            console.log(`  - ${c.userId?.firstName} ${c.userId?.lastName} (${c.position})`);
            console.log(`    Election ID: ${c.electionId}`);
            console.log(`    Vote Count: ${c.voteCount}`);
        });

        // Check votes
        console.log(`\n🗳️  Votes in database:`);
        const votes = await Vote.find({});
        console.log(`  Total: ${votes.length}`);
        votes.forEach(v => {
            console.log(`  - Election: ${v.electionId}, Candidate: ${v.candidateId}`);
            console.log(`    Voter: ${v.voterId}, Time: ${v.createdAt}`);
        });

        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
