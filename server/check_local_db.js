const mongoose = require('mongoose');
const Election = require('./src/models/Election');
const Candidate = require('./src/models/Candidate');

// Try LOCALHOST
const MONGO_URI = 'mongodb://localhost:27017/husums';

async function checkLocal() {
    try {
        console.log(`Attempting to connect to LOCAL DB: ${MONGO_URI}`);
        await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
        console.log('✅ Connected to Local MongoDB.');

        const elections = await Election.find({});
        console.log(`\nFound ${elections.length} elections locally:`);
        elections.forEach(e => console.log(`- ${e.title} (ID: ${e._id})`));

        const candidates = await Candidate.find({});
        console.log(`\nFound ${candidates.length} candidates locally:`);
        candidates.forEach(c => {
            console.log(`- stored URL: '${c.photoUrl}'`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to connect to local DB or error fetching:', error.message);
        process.exit(1);
    }
}

checkLocal();
