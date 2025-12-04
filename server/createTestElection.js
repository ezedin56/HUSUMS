const mongoose = require('mongoose');
require('dotenv').config();

const Election = require('./src/models/Election');
const Candidate = require('./src/models/Candidate');
const User = require('./src/models/User');

async function createTestElection() {
    try {
        const mongoURI = process.env.MONGO_URI;
        console.log('🔗 Connecting to Atlas...');
        await mongoose.connect(mongoURI);
        console.log('✅ Connected!');

        // Check for active elections
        const active = await Election.findOne({ isOpen: true, status: 'ongoing' });
        if (active) {
            console.log('✅ Active election already exists:', active.title);
            process.exit(0);
        }

        console.log('ℹ️  No active election found. Creating one...');

        // Get secretary to be the creator
        const secretary = await User.findOne({ role: 'secretary' });
        if (!secretary) {
            console.error('❌ No secretary found to create election');
            process.exit(1);
        }

        // Create Election
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7); // Ends in 7 days

        const election = await Election.create({
            title: '2025 Student Union General Election',
            description: 'Vote for your next student representatives. Your voice matters!',
            positions: ['President', 'Vice President', 'Secretary'],
            startDate: new Date(),
            endDate: endDate,
            status: 'ongoing',
            isOpen: true,
            createdBy: secretary._id
        });

        console.log('✅ Created Election:', election.title);

        // Create Candidates
        // We'll use the test members as candidates
        const members = await User.find({ role: 'member' }).limit(3);
        const positions = ['President', 'Vice President', 'Secretary'];

        for (let i = 0; i < members.length; i++) {
            if (i >= positions.length) break;

            await Candidate.create({
                electionId: election._id,
                userId: members[i]._id,
                position: positions[i],
                manifesto: `I promise to serve the students with integrity and dedication as your ${positions[i]}.`,
                description: 'Experienced student leader.',
                voteCount: 0
            });

            console.log(`✅ Added Candidate: ${members[i].firstName} for ${positions[i]}`);
        }

        console.log('\n✨ Test election created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

createTestElection();
