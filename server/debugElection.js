const mongoose = require('mongoose');
require('dotenv').config();

const Election = require('./src/models/Election');
const User = require('./src/models/User');

async function debugElection() {
    try {
        const mongoURI = process.env.MONGO_URI;
        console.log('🔗 Connecting to Atlas...');
        await mongoose.connect(mongoURI);

        const elections = await Election.find({});
        console.log(`✅ Found ${elections.length} elections`);

        for (const election of elections) {
            console.log('--------------------------------');
            console.log('Title:', election.title);
            console.log('ID:', election._id);
            console.log('CreatedBy:', election.createdBy);
            console.log('IsOpen:', election.isOpen);

            if (election.createdBy) {
                const creator = await User.findById(election.createdBy);
                if (creator) {
                    console.log('Creator Role:', creator.role);
                } else {
                    console.log('Creator not found');
                }
            } else {
                console.log('No CreatedBy field');
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

debugElection();
