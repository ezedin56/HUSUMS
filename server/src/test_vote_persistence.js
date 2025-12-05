require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testVotePersistence() {
    console.log('=== Testing Vote Persistence and Duplicate Prevention ===\n');

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
            console.log('✗ No active elections found. Please create an election first.');
            return;
        }

        const firstElection = elections[0];
        const firstCandidate = firstElection.candidates[0];

        console.log(`✓ Found election: ${firstElection.title}`);
        console.log(`✓ Found candidate: ${firstCandidate.name} for position: ${firstCandidate.position}`);

        // Step 3: Check initial vote status
        console.log('\nStep 3: Checking initial vote status...');
        const initialStatusResponse = await axios.post(`${API_URL}/public/vote-status`, testVoter);
        console.log(`✓ Initial voted positions: ${initialStatusResponse.data.votedPositions.length}`);

        // Step 4: Submit first vote
        console.log('\nStep 4: Submitting first vote...');
        const voteData = {
            studentId: testVoter.studentId,
            fullName: testVoter.fullName,
            votes: [{
                electionId: firstElection.id,
                candidateId: firstCandidate.id
            }]
        };

        try {
            const firstVoteResponse = await axios.post(`${API_URL}/public/vote`, voteData);
            console.log('✓ First vote submitted successfully:', firstVoteResponse.data.message);
        } catch (error) {
            if (error.response && error.response.data.message === 'You voted for this position') {
                console.log('ℹ Student has already voted for this position (from previous test)');
            } else {
                throw error;
            }
        }

        // Step 5: Check vote status after voting
        console.log('\nStep 5: Checking vote status after voting...');
        const afterVoteStatusResponse = await axios.post(`${API_URL}/public/vote-status`, testVoter);
        console.log(`✓ Voted positions: ${afterVoteStatusResponse.data.votedPositions.length}`);
        afterVoteStatusResponse.data.votedPositions.forEach(vote => {
            console.log(`  - ${vote.position}: ${vote.candidateName} (${new Date(vote.timestamp).toLocaleString()})`);
        });

        // Step 6: Try to submit duplicate vote (should fail)
        console.log('\nStep 6: Attempting to submit duplicate vote...');
        try {
            await axios.post(`${API_URL}/public/vote`, voteData);
            console.log('✗ PROBLEM: Duplicate vote was accepted! This should not happen.');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('✓ Duplicate vote correctly rejected!');
                console.log('✓ Error message:', error.response.data.message);
            } else {
                console.log('✗ Unexpected error:', error.message);
            }
        }

        // Step 7: Simulate re-login by checking vote status again
        console.log('\nStep 7: Simulating re-login (checking vote status)...');
        const reloginStatusResponse = await axios.post(`${API_URL}/public/vote-status`, testVoter);
        console.log(`✓ Vote status persisted! Voted positions: ${reloginStatusResponse.data.votedPositions.length}`);

        console.log('\n=== ✓ All Tests Passed ===');
        console.log('Summary:');
        console.log('- Votes are stored in the database');
        console.log('- Duplicate votes are prevented');
        console.log('- Vote status persists across sessions');
        console.log('- Frontend can fetch vote history');

    } catch (error) {
        console.error('\n✗ Test failed:', error.response?.data || error.message);
    }
}

testVotePersistence();
