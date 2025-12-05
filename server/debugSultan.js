const mongoose = require('mongoose');
const AllowedVoter = require('./src/models/AllowedVoter');

const MONGO_URI = 'mongodb+srv://adinanyous1_db_user:IfuqU5KgHcU2Ce30@cluster0.km0yvdt.mongodb.net/husums?retryWrites=true&w=majority';

async function checkSultan() {
    try {
        console.log('Connecting...');
        await mongoose.connect(MONGO_URI);

        console.log('Searching for "2494/16"...');
        const byId = await AllowedVoter.findOne({ studentId: '2494/16' });
        console.log('Found by ID:', byId);

        console.log('Searching for "Sultan Adinan Yusuf"...');
        const byName = await AllowedVoter.findOne({ fullName: 'Sultan Adinan Yusuf' });
        console.log('Found by Name:', byName);

        if (byId) {
            console.log('Debug ID:', {
                val: byId.studentId,
                len: byId.studentId.length,
                bytes: Buffer.from(byId.studentId)
            });
        }

        process.exit(0);
    } catch (e) { console.error(e); process.exit(1); }
}
checkSultan();
