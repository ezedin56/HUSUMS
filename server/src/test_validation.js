const axios = require('axios');

const API_URL = 'http://localhost:5000/api/public';

const testValidation = async () => {
    try {
        console.log('Testing Voter Validation...');

        // Test 1: Valid User
        console.log('\nTest 1: Valid User (UGPR1209/16, Ezedin Aliyi Usman)');
        try {
            const res1 = await axios.post(`${API_URL}/verify-student`, {
                studentId: 'UGPR1209/16',
                fullName: 'Ezedin Aliyi Usman'
            });
            console.log('✅ Success:', res1.data.message);
        } catch (err) {
            console.log('❌ Failed:', err.response ? err.response.data : err.message);
        }

        // Test 2: Invalid Name
        console.log('\nTest 2: Invalid Name (UGPR1209/16, Wrong Name)');
        try {
            await axios.post(`${API_URL}/verify-student`, {
                studentId: 'UGPR1209/16',
                fullName: 'Wrong Name'
            });
            console.log('❌ Failed: Should have rejected invalid name');
        } catch (err) {
            console.log('✅ Success: Rejected as expected:', err.response ? err.response.data.message : err.message);
        }

        // Test 3: Invalid ID
        console.log('\nTest 3: Invalid ID (INVALID/ID, Ezedin Aliyi Usman)');
        try {
            await axios.post(`${API_URL}/verify-student`, {
                studentId: 'INVALID/ID',
                fullName: 'Ezedin Aliyi Usman'
            });
            console.log('❌ Failed: Should have rejected invalid ID');
        } catch (err) {
            console.log('✅ Success: Rejected as expected:', err.response ? err.response.data.message : err.message);
        }

    } catch (error) {
        console.error('Test Error:', error);
    }
};

testValidation();
