const mongoose = require('mongoose');
const Election = require('./src/models/Election');
const Candidate = require('./src/models/Candidate');
const Vote = require('./src/models/Vote');
const User = require('./src/models/User');

async function verifyDatabase() {
    try {
        await mongoose.connect('mongodb://localhost:27017/husums');
        console.log('✅ MongoDB Connected\n');

        // Check elections
        const elections = await Election.find({});
        console.log(`📊 ELECTIONS: ${elections.length} total`);
        elections.forEach(e => {
            console.log(`\n  Title: ${e.title}`);
            console.log(`  Status: ${e.status}, isOpen: ${e.isOpen}`);
            console.log(`  ID: ${e._id}`);
            console.log(`  Created: ${e.createdAt}`);
        });

        // Check candidates
        const candidates = await Candidate.find({});
        console.log(`\n\n👥 CANDIDATES: ${candidates.length} total`);
        for (const c of candidates) {
            const user = await User.findById(c.userId);
            console.log(`\n  Name: ${user ? user.firstName + ' ' + user.lastName : 'Unknown'}`);
            console.log(`  Position: ${c.position}`);
            console.log(`  Election ID: ${c.electionId}`);
            console.log(`  Vote Count: ${c.voteCount}`);
        }

        // Check votes
        const votes = await Vote.find({});
        console.log(`\n\n🗳️  VOTES: ${votes.length} total`);
        votes.forEach(v => {
            console.log(`\n  Election: ${v.electionId}`);
            console.log(`  Candidate: ${v.candidateId}`);
            console.log(`  Voter: ${v.voterId}`);
            console.log(`  Time: ${v.createdAt}`);
        });

        console.log('\n\n✅ Database verification complete!');
        console.log('\nSUMMARY:');
        console.log(`  - Elections: ${elections.length}`);
        console.log(`  - Candidates: ${candidates.length}`);
        console.log(`  - Votes: ${votes.length}`);

        if (elections.length > 0 && candidates.length > 0) {
            console.log('\n✅ Election creation IS connected to database');
        } else {
            console.log('\n❌ Election creation NOT properly connected');
        }

        if (votes.length > 0) {
            console.log('✅ Voting IS connected to database');
        } else {
            console.log('⚠️  No votes recorded yet (this is normal if no one has voted)');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

verifyDatabase();
