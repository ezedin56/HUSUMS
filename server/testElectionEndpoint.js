const axios = require('axios');

async function testEndpoint() {
    try {
        // 1. Login
        console.log('🔑 Logging in...');
        const loginRes = await axios.post('http://127.0.0.1:5000/api/auth/login', {
            studentId: 'MEM001',
            password: 'member123'
        });

        const token = loginRes.data.token;
        console.log('✅ Login successful! Token obtained.');

        // 2. Fetch Active Elections
        console.log('\n🗳️  Fetching active elections...');
        const res = await axios.get('http://127.0.0.1:5000/api/elections/active', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('✅ Success! Status:', res.status);
        console.log('📊 Data:', JSON.stringify(res.data, null, 2));

    } catch (error) {
        console.error('❌ Error Details:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error('No response received. Request:', error.request);
            console.error('Code:', error.code);
        } else {
            console.error('Message:', error.message);
        }
    }
}

testEndpoint();
