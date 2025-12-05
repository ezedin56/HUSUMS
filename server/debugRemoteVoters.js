const mongoose = require('mongoose');
const AllowedVoter = require('./src/models/AllowedVoter');

const MONGO_URI = 'mongodb+srv://adinanyous1_db_user:IfuqU5KgHcU2Ce30@cluster0.km0yvdt.mongodb.net/husums?retryWrites=true&w=majority';

async function checkVoters() {
    try {
        console.log('Connecting...');
        await mongoose.connect(MONGO_URI);

        const voters = await AllowedVoter.find({});
        console.log('Found voters:', voters.length);
        voters.forEach(v => {
            console.log(`- "${v.studentId}" : "${v.fullName}"`);
        });

        process.exit(0);
    } catch (e) { console.error(e); process.exit(1); }
}
checkVoters();
