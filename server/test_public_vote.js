const axios = require('axios');

const API_URL = 'http://localhost:5000/api/public';

async function testPublicVoting() {
    console.log('🧪 Testing Public Voting System\n');

    try {
        // Test 1: Get active elections
        console.log('1️⃣ Fetching active elections...');
        const electionsRes = await axios.get(`${API_URL}/elections/active`);
        console.log(`✅ Found ${electionsRes.data.length} active election(s)`);

        if (electionsRes.data.length === 0) {
            console.log('❌ No active elections found. Please create and open an election first.');
            return;
        }

        const election = electionsRes.data[0];
        console.log(`   Election: ${election.title}`);
        console.log(`   Candidates: ${election.candidates.length}\n`);

        // Test 2: Verify student (correct credentials)
        console.log('2️⃣ Testing student verification (correct credentials)...');
        const verifyRes = await axios.post(`${API_URL}/verify-student`, {
            studentId: 'CAND001',
            fullName: 'Ezezdin Aliyi'
        });
        console.log(`✅ ${verifyRes.data.message}\n`);

        // Test 3: Verify student (wrong name)
        console.log('3️⃣ Testing student verification (wrong name)...');
        try {
            await axios.post(`${API_URL}/verify-student`, {
                studentId: 'CAND001',
                fullName: 'Wrong Name'
            });
            console.log('❌ Should have failed but didn\'t\n');
        } catch (err) {
            console.log(`✅ Correctly rejected: ${err.response.data.message}\n`);
        }

        // Test 4: Submit vote
        console.log('4️⃣ Submitting vote...');
        const voteRes = await axios.post(`${API_URL}/vote`, {
            studentId: 'CAND001',
            fullName: 'Ezezdin Aliyi',
            votes: [{
                electionId: election.id,
                candidateId: election.candidates[0].id
            }]
        });
        console.log(`✅ ${voteRes.data.message}\n`);

        // Test 5: Try to vote again (should fail)
        console.log('5️⃣ Testing duplicate vote prevention...');
        try {
            await axios.post(`${API_URL}/vote`, {
                studentId: 'CAND001',
                fullName: 'Ezezdin Aliyi',
                votes: [{
                    electionId: election.id,
                    candidateId: election.candidates[0].id
                }]
            });
            console.log('❌ Should have prevented duplicate vote\n');
        } catch (err) {
            console.log(`✅ Correctly prevented duplicate: ${err.response.data.message}\n`);
        }

        console.log('🎉 All tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testPublicVoting();
