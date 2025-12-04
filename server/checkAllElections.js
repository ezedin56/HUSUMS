const mongoose = require('mongoose');
require('dotenv').config();

const Election = require('./src/models/Election');
const Candidate = require('./src/models/Candidate');

async function checkAllElections() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas\n');

        // Get ALL elections regardless of type
        const allElections = await Election.find()
            .populate('createdBy', 'firstName lastName role')
            .sort({ createdAt: -1 });

        console.log(`📊 TOTAL ELECTIONS IN DATABASE: ${allElections.length}\n`);
        console.log('='.repeat(60));

        for (const election of allElections) {
            console.log(`\n📋 ${election.title}`);
            console.log(`   ID: ${election._id}`);
            console.log(`   Type: ${election.electionType || 'NOT SET'}`);
            console.log(`   Status: ${election.status}`);
            console.log(`   Is Open: ${election.isOpen}`);
            console.log(`   Results Announced: ${election.resultsAnnounced || false}`);
            console.log(`   Created: ${election.createdAt}`);
            console.log(`   Created By: ${election.createdBy?.firstName || 'Unknown'} ${election.createdBy?.lastName || ''} (${election.createdBy?.role || 'Unknown'})`);

            const candidates = await Candidate.find({ electionId: election._id })
                .populate('userId', 'firstName lastName');

            console.log(`   Candidates: ${candidates.length}`);
            if (candidates.length > 0) {
                candidates.forEach(c => {
                    console.log(`     • ${c.userId?.firstName || 'Unknown'} ${c.userId?.lastName || ''} - ${c.position}`);
                    if (c.photo) console.log(`       📷 Photo: ${c.photo}`);
                });
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('\n🔍 FILTERING FOR PUBLIC VOTING PAGE:');
        console.log('   Looking for elections where:');
        console.log('   - electionType = "public"');
        console.log('   - isOpen = true');
        console.log('   - status = "ongoing"\n');

        const publicElections = await Election.find({
            electionType: 'public',
            isOpen: true,
            status: 'ongoing'
        });

        console.log(`✅ Found ${publicElections.length} election(s) that will appear on /vote\n`);

        if (publicElections.length === 0) {
            console.log('⚠️  TO FIX THIS:');
            console.log('   1. Make sure elections are created by publicvote_admin user');
            console.log('   2. Set status to "ongoing"');
            console.log('   3. Click "Open Election" button\n');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkAllElections();
