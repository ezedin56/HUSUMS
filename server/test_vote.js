const axios = require('axios');

// Test voting as a member
async function testVote() {
    try {
        // First, login as MEM001
        console.log('Logging in as MEM001...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            studentId: 'MEM001',
            password: '123456'
        });

        const token = loginRes.data.token;
        console.log('✅ Login successful');

        // Get active elections
        console.log('\nFetching active elections...');
        const electionsRes = await axios.get('http://localhost:5000/api/elections/active', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log(`Found ${electionsRes.data.length} active elections`);

        if (electionsRes.data.length === 0) {
            console.log('❌ No active elections found');
            return;
        }

        const election = electionsRes.data[0];
        console.log(`\nElection: ${election.title}`);
        console.log(`Status: ${election.status}, isOpen: ${election.isOpen}`);
        console.log(`Candidates: ${election.Candidates?.length || 0}`);

        if (!election.Candidates || election.Candidates.length === 0) {
            console.log('❌ No candidates found');
            return;
        }

        const candidate = election.Candidates[0];
        console.log(`\nAttempting to vote for: ${candidate.User?.firstName} ${candidate.User?.lastName}`);

        // Try to vote
        const voteRes = await axios.post('http://localhost:5000/api/vote', {
            electionId: election.id,
            candidateId: candidate.id
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('\n✅ Vote successful!');
        console.log(voteRes.data);

    } catch (error) {
        console.log('\n❌ Error occurred:');
        if (error.response) {
            console.log(`Status: ${error.response.status}`);
            console.log(`Message: ${error.response.data.message || error.response.data}`);
        } else {
            console.log(error.message);
        }
    }
}

testVote();
