const axios = require('axios');

const API_URL = 'http://localhost:5000/api/public';

const testFlexibleValidation = async () => {
    try {
        console.log('Testing Flexible Voter Validation...');

        // Test 1: ID without prefix
        console.log('\nTest 1: ID without prefix (2494/16, Sultan Adinan Yusuf)');
        try {
            const res1 = await axios.post(`${API_URL}/verify-student`, {
                studentId: '2494/16',
                fullName: 'Sultan Adinan Yusuf'
            });
            console.log('✅ Success:', res1.data.message);
            console.log('   Returned ID:', res1.data.studentId);
        } catch (err) {
            console.log('❌ Failed:', err.response ? err.response.data : err.message);
        }

        // Test 2: ID with prefix
        console.log('\nTest 2: ID with prefix (UGPR2494/16, Sultan Adinan Yusuf)');
        try {
            const res2 = await axios.post(`${API_URL}/verify-student`, {
                studentId: 'UGPR2494/16',
                fullName: 'Sultan Adinan Yusuf'
            });
            console.log('✅ Success:', res2.data.message);
        } catch (err) {
            console.log('❌ Failed:', err.response ? err.response.data : err.message);
        }

    } catch (error) {
        console.error('Test Error:', error);
    }
};

testFlexibleValidation();
