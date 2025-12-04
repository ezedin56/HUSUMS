const mongoose = require('mongoose');
require('dotenv').config();

const Election = require('./src/models/Election');
const Candidate = require('./src/models/Candidate');
const User = require('./src/models/User');

async function checkDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Check for publicvote_admin users
        console.log('--- Admin Accounts ---');
        const admins = await User.find({ role: { $in: ['president', 'publicvote_admin'] } });
        console.log(`Found ${admins.length} admin user(s):\n`);
        admins.forEach(admin => {
            console.log(`  👤 ${admin.firstName} ${admin.lastName}`);
            console.log(`     Role: ${admin.role}`);
            console.log(`     Student ID: ${admin.studentId}`);
            console.log(`     Email: ${admin.email}\n`);
        });

        // Check all elections
        console.log('--- All Elections ---');
        const allElections = await Election.find()
            .populate('createdBy', 'firstName lastName role')
            .sort({ createdAt: -1 });

        console.log(`Total elections: ${allElections.length}\n`);

        for (const election of allElections) {
            console.log(`📊 ${election.title}`);
            console.log(`   ID: ${election._id}`);
            console.log(`   Type: ${election.electionType}`);
            console.log(`   Status: ${election.status}`);
            console.log(`   Open: ${election.isOpen ? 'Yes ✅' : 'No ❌'}`);
            console.log(`   Created by: ${election.createdBy?.firstName || 'Unknown'} ${election.createdBy?.lastName || ''} (${election.createdBy?.role || 'Unknown'})`);

            const candidates = await Candidate.find({ electionId: election._id })
                .populate('userId', 'firstName lastName');

            console.log(`   Candidates: ${candidates.length}`);
            if (candidates.length > 0) {
                candidates.forEach(c => {
                    console.log(`     • ${c.userId?.firstName || 'Unknown'} ${c.userId?.lastName || ''} - ${c.position}`);
                    if (c.photo) console.log(`       Photo: ${c.photo}`);
                });
            }
            console.log('');
        }

        // Check for public elections specifically
        console.log('--- Public Elections (for voting page) ---');
        const publicElections = await Election.find({
            electionType: 'public',
            isOpen: true,
            status: 'ongoing'
        });

        if (publicElections.length === 0) {
            console.log('⚠️  No active public elections found!');
            console.log('\nTo create a public election:');
            console.log('1. Login to admin dashboard with publicvote_admin account');
            console.log('2. Go to Election Manager');
            console.log('3. Create a new election');
            console.log('4. Add candidates with photos');
            console.log('5. Click "Open Election" to activate it\n');
        } else {
            console.log(`✅ Found ${publicElections.length} active public election(s)\n`);
            publicElections.forEach(e => {
                console.log(`  • ${e.title} (ID: ${e._id})`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkDatabase();
