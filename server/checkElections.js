const mongoose = require('mongoose');
require('dotenv').config();

const Election = require('./src/models/Election');

async function checkElections() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB Atlas');

        const elections = await Election.find()
            .populate('createdBy', 'firstName lastName role')
            .sort({ createdAt: -1 });

        console.log(`\nTotal elections in database: ${elections.length}\n`);

        elections.forEach((e, i) => {
            console.log(`Election ${i + 1}:`);
            console.log(`  Title: ${e.title}`);
            console.log(`  Status: ${e.status}`);
            console.log(`  Created by: ${e.createdBy?.firstName} ${e.createdBy?.lastName} (${e.createdBy?.role})`);
            console.log(`  ID: ${e._id}`);
            console.log('');
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkElections();
