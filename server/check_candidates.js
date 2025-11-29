const mongoose = require('mongoose');
const Election = require('./src/models/Election');
const Candidate = require('./src/models/Candidate');
const User = require('./src/models/User');

async function checkCandidatesVisibility() {
    try {
        await mongoose.connect('mongodb://localhost:27017/husums');
        console.log('✅ Connected to MongoDB\n');

        // Get active elections
        const activeElections = await Election.find({ isOpen: true });
        console.log(`📊 ACTIVE ELECTIONS: ${activeElections.length}\n`);

        for (const election of activeElections) {
            console.log(`Election: ${election.title}`);
            console.log(`  ID: ${election._id}`);
            console.log(`  Status: ${election.status}, isOpen: ${election.isOpen}\n`);

            // Get candidates for this election
            const candidates = await Candidate.find({ electionId: election._id });
            console.log(`  👥 CANDIDATES: ${candidates.length}`);

            if (candidates.length === 0) {
                console.log('  ⚠️  NO CANDIDATES FOUND FOR THIS ELECTION!');
                console.log('  This is why members cannot vote - there are no candidates.\n');
            } else {
                for (const candidate of candidates) {
                    const user = await User.findById(candidate.userId);
                    console.log(`    - ${user ? user.firstName + ' ' + user.lastName : 'Unknown User'}`);
                    console.log(`      Position: ${candidate.position}`);
                    console.log(`      Votes: ${candidate.voteCount}`);
                    console.log(`      Photo: ${candidate.photo || 'No photo'}`);
                }
                console.log('');
            }
        }

        // Check if there are candidates for other elections
        console.log('\n📋 ALL CANDIDATES IN DATABASE:\n');
        const allCandidates = await Candidate.find({});
        console.log(`Total candidates: ${allCandidates.length}`);

        const candidatesByElection = {};
        for (const candidate of allCandidates) {
            if (!candidatesByElection[candidate.electionId]) {
                candidatesByElection[candidate.electionId] = [];
            }
            candidatesByElection[candidate.electionId].push(candidate);
        }

        console.log('\nCandidates grouped by election:');
        for (const [electionId, candidates] of Object.entries(candidatesByElection)) {
            const election = await Election.findById(electionId);
            console.log(`\n  Election: ${election ? election.title : 'Unknown'} (${electionId})`);
            console.log(`    Status: ${election ? election.status : 'N/A'}, isOpen: ${election ? election.isOpen : 'N/A'}`);
            console.log(`    Candidates: ${candidates.length}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkCandidatesVisibility();
