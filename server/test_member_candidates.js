const axios = require('axios');

async function testMemberVotePage() {
    try {
        // Login as member
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            studentId: 'MEM001',
            password: '123456'
        });

        const token = loginRes.data.token;
        console.log('✅ Logged in as Member (MEM001)\n');

        // Fetch active elections (what members see)
        const electionsRes = await axios.get('http://localhost:5000/api/elections/active', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('📊 ACTIVE ELECTIONS FOR MEMBERS:\n');

        if (electionsRes.data.length === 0) {
            console.log('❌ No active elections found!');
            console.log('This means members cannot see any elections to vote on.\n');
        } else {
            electionsRes.data.forEach((election, index) => {
                console.log(`Election ${index + 1}: ${election.title}`);
                console.log(`  Status: ${election.status}, isOpen: ${election.isOpen}`);
                console.log(`  Candidates: ${election.Candidates?.length || 0}`);

                if (election.Candidates && election.Candidates.length > 0) {
                    console.log('  Candidate List:');
                    election.Candidates.forEach(c => {
                        console.log(`    - ${c.User?.firstName} ${c.User?.lastName} (${c.position})`);
                    });
                } else {
                    console.log('  ⚠️  NO CANDIDATES FOUND!');
                }
                console.log('');
            });
        }

        // Check database directly
        console.log('\n📋 CHECKING DATABASE DIRECTLY:\n');
        const mongoose = require('mongoose');
        await mongoose.connect('mongodb://localhost:27017/husums');

        const Election = require('./src/models/Election');
        const Candidate = require('./src/models/Candidate');

        const dbElections = await Election.find({ isOpen: true });
        console.log(`Active elections in DB: ${dbElections.length}`);

        for (const election of dbElections) {
            const candidates = await Candidate.find({ electionId: election._id });
            console.log(`\nElection: ${election.title}`);
            console.log(`  Candidates in DB: ${candidates.length}`);
            candidates.forEach(c => {
                console.log(`    - Position: ${c.position}, UserId: ${c.userId}`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        process.exit(1);
    }
}

testMemberVotePage();
