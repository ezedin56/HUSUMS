const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function verifyApi() {
    try {
        console.log('1. Logging in as President...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            studentId: 'PRES001',
            password: '123456'
        });

        const token = loginRes.data.token;
        console.log('Login successful. Token obtained.');

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        console.log('\n2. Fetching Elections...');
        try {
            const electionsRes = await axios.get(`${API_URL}/president/elections`, config);
            console.log('Status:', electionsRes.status);
            console.log('Is Array?', Array.isArray(electionsRes.data));
            console.log('Data Preview:', JSON.stringify(electionsRes.data).substring(0, 200) + '...');

            if (!Array.isArray(electionsRes.data)) {
                console.error('CRITICAL: Elections data is NOT an array!');
                console.log('Full Data:', JSON.stringify(electionsRes.data, null, 2));
            }
        } catch (err) {
            console.error('Error fetching elections:', err.message);
            if (err.response) {
                console.error('Response data:', err.response.data);
            }
        }

        console.log('\n3. Fetching Members...');
        try {
            const membersRes = await axios.get(`${API_URL}/president/members`, config);
            console.log('Status:', membersRes.status);
            console.log('Is Array?', Array.isArray(membersRes.data));
            if (!Array.isArray(membersRes.data)) {
                console.error('CRITICAL: Members data is NOT an array!');
            }
        } catch (err) {
            console.error('Error fetching members:', err.message);
        }

    } catch (error) {
        console.error('Verification failed:', error.message);
        if (error.response) {
            console.error('Login Response data:', error.response.data);
        }
    }
}

verifyApi();
