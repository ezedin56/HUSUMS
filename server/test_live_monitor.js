const axios = require('axios');

async function testLiveMonitor() {
    try {
        // Login as president
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            studentId: 'PRES001',
            password: '123456'
        });

        const token = loginRes.data.token;
        console.log('✅ Logged in as President\n');

        // Test the live election results endpoint
        const liveRes = await axios.get('http://localhost:5000/api/president/elections/live', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('📊 Live Election Results Response:');
        console.log(JSON.stringify(liveRes.data, null, 2));

        if (liveRes.data.active) {
            console.log('\n✅ Active election found!');
            console.log(`Election: ${liveRes.data.election.title}`);
            console.log(`Candidates: ${liveRes.data.results.length}`);
        } else {
            console.log('\n❌ No active election found');
            console.log(`Message: ${liveRes.data.message}`);
        }

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testLiveMonitor();
