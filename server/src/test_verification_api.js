const axios = require('axios');

async function testWithMultipleStudents() {
    const testCases = [
        { studentId: '2494/16', fullName: 'Sultan Adinan Yusuf' },
        { studentId: '1208/16', fullName: 'Ornia Zeadin' },
        { studentId: 'MEM001', fullName: 'Ezedin Usman' },
        { studentId: 'CAND002', fullName: 'Sultan Adinan' }
    ];

    console.log('Testing Verification with Multiple Students\n');
    console.log('===========================================\n');

    for (const testCase of testCases) {
        try {
            console.log(`Testing: "${testCase.studentId}" - "${testCase.fullName}"`);
            const response = await axios.post('http://localhost:5000/api/public/verify-student', testCase);
            console.log(`  ✅ SUCCESS:`, response.data.message);
        } catch (error) {
            console.log(`  ❌ FAILED:`, error.response?.data?.message || error.message);
        }
        console.log('');
    }
}

testWithMultipleStudents();
