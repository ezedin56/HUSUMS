const mongoose = require('mongoose');
const Candidate = require('./src/models/Candidate');

const MONGO_URI = 'mongodb+srv://adinanyous1_db_user:IfuqU5KgHcU2Ce30@cluster0.km0yvdt.mongodb.net/husums?retryWrites=true&w=majority';

async function checkPhotos() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to Atlas.\n');

        const candidates = await Candidate.find({}).populate('userId', 'firstName lastName');

        console.log(`Found ${candidates.length} candidates.\n`);

        candidates.forEach(c => {
            console.log(`Candidate: ${c.userId ? c.userId.firstName + ' ' + c.userId.lastName : 'Unknown User'}`);
            console.log(`Position: ${c.position}`);
            console.log(`PhotoURL: '${c.photoUrl}'`); // Quotes to see whitespace or empty
            console.log('---');
        });

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkPhotos();
