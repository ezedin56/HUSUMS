const mongoose = require('mongoose');
const Election = require('./models/Election');

async function openElection() {
    try {
        await mongoose.connect('mongodb://localhost:27017/husums');
        console.log('Connected to MongoDB');

        // Find all elections
        const elections = await Election.find({});
        console.log(`Found ${elections.length} election(s)`);

        if (elections.length === 0) {
            console.log('No elections found in database');
            await mongoose.connection.close();
            return;
        }

        // Open the first election (or you can specify which one)
        const election = elections[0];
        console.log(`\nOpening election: ${election.title}`);
        console.log(`Current status: isOpen=${election.isOpen}, status=${election.status}`);

        // Update election to be open
        election.isOpen = true;
        election.status = 'ongoing';
        await election.save();

        console.log(`\n✅ Election opened successfully!`);
        console.log(`Updated status: isOpen=${election.isOpen}, status=${election.status}`);

        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    } catch (error) {
        console.error('Error:', error);
        await mongoose.connection.close();
    }
}

openElection();
