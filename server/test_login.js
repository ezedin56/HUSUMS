const axios = require('axios');

const testLogin = async () => {
    try {
        console.log('Testing PVADMIN login...');
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            studentId: 'PVADMIN',
            password: '123456'
        });

        console.log('\n✅ Login Successful!');
        console.log('Response:', JSON.stringify(response.data, null, 2));
        console.log('\nRole:', response.data.role);
        console.log('Should redirect to:', response.data.role === 'publicvote_admin' ? '/admin' : '/dashboard');

    } catch (error) {
        console.log('\n❌ Login Failed!');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Error:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.log('Error:', error.message);
        }
    }
};

testLogin();
