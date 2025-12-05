const axios = require('axios');

const API_URL = 'http://localhost:5000/api/public';

const testDuplicateMessage = async () => {
    try {
        console.log('Testing Duplicate Vote Message...');

        // 1. Get Active Elections
        console.log('\n1. Fetching Active Elections...');
        const electionsRes = await axios.get(`${API_URL}/elections/active`);
        const elections = electionsRes.data;

        if (elections.length === 0) {
            console.log('❌ No active elections found. Cannot test.');
            return;
        }

        const election = elections[0];
        const candidate = election.candidates[0];

        if (!candidate) {
            console.log('❌ No candidates found in the first election. Cannot test.');
            return;
        }

        console.log(`   Found election: ${election.title}`);
        console.log(`   Found candidate: ${candidate.name} (${candidate.position})`);

        // 2. Verify Student
        console.log('\n2. Verifying Student...');
        const studentId = 'UGPR1209/16';
        const fullName = 'Ezedin Aliyi Usman';

        await axios.post(`${API_URL}/verify-student`, {
            studentId,
            fullName
        });
        console.log('   Student verified.');

        // 3. Submit Vote (First Time)
        console.log('\n3. Submitting Vote (First Time)...');
        try {
            await axios.post(`${API_URL}/vote`, {
                studentId,
                fullName,
                votes: [{
                    electionId: election.id,
                    candidateId: candidate.id
                }]
            });
            console.log('   Vote submitted successfully.');
        } catch (err) {
            // If already voted, that's fine for this test, we just want to test the duplicate message next
            console.log('   (Vote might have already been submitted previously)');
        }

        // 4. Submit Vote (Second Time - Duplicate)
        console.log('\n4. Submitting Vote (Second Time - Duplicate)...');
        try {
            await axios.post(`${API_URL}/vote`, {
                studentId,
                fullName,
                votes: [{
                    electionId: election.id,
                    candidateId: candidate.id
                }]
            });
            console.log('❌ Failed: Should have rejected duplicate vote');
        } catch (err) {
            const message = err.response ? err.response.data.message : err.message;
            console.log(`   Error Message: "${message}"`);

            if (message === 'You voted for this position') {
                console.log('✅ Success: Correct error message received!');
            } else {
                console.log('❌ Failed: Incorrect error message.');
                console.log(`   Expected: "You voted for this position"`);
                console.log(`   Received: "${message}"`);
            }
        }

    } catch (error) {
        console.error('Test Error:', error);
    }
};

testDuplicateMessage();
