const axios = require('axios');

async function testCompleteVotingFlow() {
    console.log('Testing Complete Voting Flow\n');
    console.log('============================\n');

    // Step 1: Test verification
    console.log('Step 1: Testing verification...');
    try {
        const verifyResponse = await axios.post('http://localhost:5000/api/public/verify-student', {
            studentId: '2494/16',
            fullName: 'Sultan Adinan Yusuf'
        });
        console.log('✅ Verification SUCCESS:', verifyResponse.data);
    } catch (error) {
        console.log('❌ Verification FAILED:', error.response?.data?.message || error.message);
        return;
    }

    console.log('\nStep 2: Fetching active elections...');
    try {
        const electionsResponse = await axios.get('http://localhost:5000/api/public/elections/active');
        console.log('✅ Elections fetched:', electionsResponse.data.length, 'election(s)');

        if (electionsResponse.data.length > 0) {
            const election = electionsResponse.data[0];
            console.log('   Election:', election.title);
            console.log('   Candidates:', election.candidates.length);

            if (election.candidates.length > 0) {
                console.log('\n   Sample candidates:');
                election.candidates.slice(0, 3).forEach(c => {
                    console.log(`     - ${c.name} (${c.position})`);
                });
            }
        }
    } catch (error) {
        console.log('❌ Fetching elections FAILED:', error.message);
    }

    console.log('\n✅ Voting flow test complete!');
}

testCompleteVotingFlow();
