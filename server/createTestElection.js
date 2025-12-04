const mongoose = require('mongoose');
require('dotenv').config();

const Election = require('./src/models/Election');
const Candidate = require('./src/models/Candidate');
const User = require('./src/models/User');

async function createTestElection() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find a user to be the creator
        const adminUser = await User.findOne({ role: 'president' });
        if (!adminUser) {
            console.log('No admin user found. Creating one...');
            return;
        }

        // Check if there's already a public election
        const existingElection = await Election.findOne({ electionType: 'public', isOpen: true });
        if (existingElection) {
            console.log('Public election already exists:', existingElection.title);
            console.log('ID:', existingElection._id);

            // Check candidates
            const candidates = await Candidate.find({ electionId: existingElection._id })
                .populate('userId', 'firstName lastName');
            console.log(`\nCandidates: ${candidates.length}`);
            candidates.forEach(c => {
                console.log(`  - ${c.userId?.firstName} ${c.userId?.lastName} for ${c.position}`);
            });

            process.exit(0);
            return;
        }

        // Create a new public election
        const election = await Election.create({
            title: 'HUSUMS Public Election 2025',
            description: 'Student Union Leadership Elections',
            positions: ['President', 'Vice President', 'Secretary'],
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            status: 'ongoing',
            isOpen: true,
            electionType: 'public',
            createdBy: adminUser._id
        });

        console.log('Created election:', election.title);
        console.log('Election ID:', election._id);

        // Find some users to be candidates
        const users = await User.find({ role: 'member' }).limit(6);

        if (users.length < 3) {
            console.log('Not enough users to create candidates');
            process.exit(0);
            return;
        }

        // Create candidates
        const candidatesData = [
            { userId: users[0]?._id, position: 'President', manifesto: 'Digital transformation of student services\n- 24/7 Library Access\n- Campus WiFi Expansion\n- Mental Health Support', description: 'Leading with innovation and technology' },
            { userId: users[1]?._id, position: 'President', manifesto: 'Strengthening student rights\n- Student Legal Aid\n- Academic Grievance System\n- Internship Partnerships', description: 'Protecting student rights and welfare' },
            { userId: users[2]?._id, position: 'Vice President', manifesto: 'Building bridges across departments\n- Inter-Department Events\n- Student Welfare Programs\n- Budget Transparency', description: 'Unity and collaboration' },
            { userId: users[3]?._id, position: 'Vice President', manifesto: 'Health and wellness for all\n- Health Insurance Support\n- Fitness Programs\n- Mental Health Awareness', description: 'Student health and wellbeing' },
            { userId: users[4]?._id, position: 'Secretary', manifesto: 'Efficient administration\n- Digital Record System\n- Faster Processing\n- Student Feedback Portal', description: 'Streamlined operations' },
            { userId: users[5]?._id, position: 'Secretary', manifesto: 'Transparency and accountability\n- Open Budget Reports\n- Monthly Town Halls\n- Anonymous Suggestion Box', description: 'Open and transparent governance' }
        ];

        for (const candidateData of candidatesData) {
            if (candidateData.userId) {
                await Candidate.create({
                    electionId: election._id,
                    ...candidateData
                });
            }
        }

        console.log('Created candidates successfully!');
        console.log('\nYou can now test the public voting at: http://localhost:5173/vote');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createTestElection();
