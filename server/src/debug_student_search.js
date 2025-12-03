const mongoose = require('mongoose');
const User = require('./models/User');

async function debugStudentSearch() {
    try {
        await mongoose.connect('mongodb://localhost:27017/husums');
        console.log('Connected to MongoDB\n');

        // List ALL students with their exact Student IDs
        console.log('All students in database:');
        const allStudents = await User.find({ role: 'member' }).select('studentId firstName lastName');

        allStudents.forEach((s, i) => {
            const sidBytes = Buffer.from(s.studentId);
            console.log(`${i + 1}. "${s.studentId}" (${sidBytes.length} bytes) - ${s.firstName} ${s.lastName}`);
            if (s.studentId.includes('2494')) {
                console.log(`   ^ THIS IS THE ONE WE'RE LOOKING FOR!`);
                console.log(`   Bytes: [${Array.from(sidBytes).join(', ')}]`);
            }
        });

        // Try direct query
        const testId = '2494/16';
        console.log(`\nSearching for "${testId}"...`);
        const found1 = await User.findOne({ studentId: testId });
        console.log(`Result 1 (exact):`, found1 ? `FOUND - ${found1.firstName} ${found1.lastName}` : 'NOT FOUND');

        const found2 = await User.findOne({ studentId: testId.trim() });
        console.log(`Result 2 (trimmed):`, found2 ? `FOUND - ${found2.firstName} ${found2.lastName}` : 'NOT FOUND');

        // Try regex search
        const foundRegex = await User.findOne({ studentId: { $regex: '2494', $options: 'i' } });
        console.log(`Result 3 (regex):`, foundRegex ? `FOUND - ${foundRegex.studentId} - ${foundRegex.firstName} ${foundRegex.lastName}` : 'NOT FOUND');

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        await mongoose.connection.close();
    }
}

debugStudentSearch();
