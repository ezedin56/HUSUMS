const mongoose = require('mongoose');
const Election = require('./src/models/Election');

mongoose.connect('mongodb://localhost:27017/husums')
    .then(async () => {
        console.log('MongoDB Connected');

        // Find the election
        const election = await Election.findOne({ title: 'Student Union President Election 2025' });

        if (!election) {
            console.log('❌ Election not found');
            process.exit(1);
        }

        console.log(`Found election: ${election.title}`);
        console.log(`Current status: ${election.status}, isOpen: ${election.isOpen}`);

        // Start the election
        election.isOpen = true;
        election.status = 'ongoing';
        await election.save();

        console.log('✅ Election started successfully!');
        console.log(`New status: ${election.status}, isOpen: ${election.isOpen}`);

        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
