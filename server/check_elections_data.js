const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function checkElections() {
    try {
        // 1. Login as President
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            studentId: 'PRES001',
            password: 'president123'
        });

        const token = loginRes.data.token;
        console.log('Logged in. Token:', token.substring(0, 20) + '...');

        // 2. Fetch Elections
        console.log('Fetching elections...');
        const res = await axios.get(`${API_URL}/president/elections`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const elections = res.data;
        console.log(`Fetched ${elections.length} elections.`);

        elections.forEach((e, i) => {
            console.log(`Election ${i}:`);
            console.log(`  _id: ${e._id} (${typeof e._id})`);
            console.log(`  id: ${e.id} (${typeof e.id})`);
            console.log(`  title: ${e.title}`);
            console.log(`  status: ${e.status}`);

            if (e._id === 'undefined' || e.id === 'undefined') {
                console.error('  ERROR: ID is the string "undefined"!');
            }
            if (!e._id && !e.id) {
                console.error('  ERROR: ID is missing!');
            }
        });

    } catch (error) {
        console.error('Error Message:', error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

checkElections();
