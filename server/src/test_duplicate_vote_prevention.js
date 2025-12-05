require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testDuplicateVotePrevention() {
    console.log('Testing Duplicate Vote Prevention...\n');

    // Test data - using a valid voter from the allowed voters list
    const testVoter = {
        studentId: 'UGPR/24859/14',
        fullName: 'Ezedin Jemal'
    };

    try {
        // Step 1: Verify student
        console.log('Step 1: Verifying student...');
        const verifyResponse = await axios.post(`${API_URL}/public/verify-student`, testVoter);
        console.log('✓ Verification successful:', verifyResponse.data.message);

        // Step 2: Get active elections
        console.log('\nStep 2: Fetching active elections...');
        const electionsResponse = await axios.get(`${API_URL}/public/elections/active`);
        const elections = electionsResponse.data;

        if (!elections || elections.length === 0) {
            console.log('✗ No active elections found');
            return;
        }

        const firstElection = elections[0];
        const firstCandidate = firstElection.candidates[0];

        console.log(`✓ Found election: ${firstElection.title}`);
        console.log(`✓ Found candidate: ${firstCandidate.name} for position: ${firstCandidate.position}`);

        // Step 3: Submit first vote
        console.log('\nStep 3: Submitting first vote...');
        const voteData = {
            studentId: testVoter.studentId,
            fullName: testVoter.fullName,
            votes: [{
                electionId: firstElection.id,
                candidateId: firstCandidate.id
            }]
        };

        const firstVoteResponse = await axios.post(`${API_URL}/public/vote`, voteData);
        console.log('✓ First vote submitted successfully:', firstVoteResponse.data.message);

        // Step 4: Try to submit duplicate vote (should fail)
        console.log('\nStep 4: Attempting to submit duplicate vote...');
        try {
            const duplicateVoteResponse = await axios.post(`${API_URL}/public/vote`, voteData);
            console.log('✗ PROBLEM: Duplicate vote was accepted! This should not happen.');
            console.log('Response:', duplicateVoteResponse.data);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('✓ Duplicate vote correctly rejected!');
                console.log('✓ Error message:', error.response.data.message);
            } else {
                console.log('✗ Unexpected error:', error.message);
            }
        }

        console.log('\n=== Test Complete ===');

    } catch (error) {
        console.error('Test failed:', error.response?.data || error.message);
    }
}

testDuplicateVotePrevention();
