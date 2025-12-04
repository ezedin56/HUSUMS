const mongoose = require('mongoose');
require('dotenv').config();

const Election = require('./src/models/Election');
const Candidate = require('./src/models/Candidate');

async function verifyIntegration() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas\n');

        // Find all public elections
        const publicElections = await Election.find({ electionType: 'public' })
            .sort({ createdAt: -1 });

        console.log('='.repeat(70));
        console.log('📊 PUBLIC ELECTIONS IN DATABASE');
        console.log('='.repeat(70));
        console.log(`Total: ${publicElections.length}\n`);

        for (const election of publicElections) {
            console.log(`\n📋 ${election.title}`);
            console.log(`   ID: ${election._id}`);
            console.log(`   Status: ${election.status}`);
            console.log(`   Is Open: ${election.isOpen ? '✅ YES' : '❌ NO'}`);
            console.log(`   Type: ${election.electionType}`);

            // Get candidates for this election
            const candidates = await Candidate.find({ electionId: election._id })
                .populate('userId', 'firstName lastName email');

            console.log(`   Candidates: ${candidates.length}`);

            if (candidates.length > 0) {
                console.log('\n   📝 CANDIDATE DETAILS:');
                candidates.forEach((c, idx) => {
                    console.log(`\n   ${idx + 1}. ${c.userId?.firstName || 'Unknown'} ${c.userId?.lastName || ''}`);
                    console.log(`      Position: ${c.position}`);
                    console.log(`      Slogan: ${c.slogan || 'Not set'}`);
                    console.log(`      Photo: ${c.photo ? '✅ Yes' : '❌ No'}`);
                    console.log(`      Platform Points: ${c.platform?.length || 0}`);
                    if (c.platform && c.platform.length > 0) {
                        c.platform.forEach((p, i) => {
                            console.log(`         ${i + 1}. ${p}`);
                        });
                    }
                    console.log(`      Phone: ${c.phone || 'Not set'}`);
                    console.log(`      Email: ${c.email || 'Not set'}`);
                    console.log(`      Region: ${c.region || 'Not set'}`);
                    console.log(`      Background: ${c.background ? 'Set' : 'Not set'}`);
                    console.log(`      Education: ${c.education?.length || 0} entries`);
                    console.log(`      Experience: ${c.experience?.length || 0} entries`);
                    console.log(`      Achievements: ${c.achievements?.length || 0} entries`);
                });
            }
            console.log('\n' + '-'.repeat(70));
        }

        console.log('\n\n🔍 CHECKING WHAT WILL APPEAR ON PUBLIC VOTING PAGE:');
        console.log('='.repeat(70));

        const activePublicElections = await Election.find({
            electionType: 'public',
            isOpen: true,
            status: 'ongoing'
        });

        if (activePublicElections.length === 0) {
            console.log('\n⚠️  NO ACTIVE PUBLIC ELECTIONS!');
            console.log('\nTo make elections appear on /vote:');
            console.log('1. Election must have electionType = "public"');
            console.log('2. Election must be isOpen = true');
            console.log('3. Election must have status = "ongoing"');
            console.log('\n💡 TIP: Click "Open Election" button in admin dashboard\n');
        } else {
            console.log(`\n✅ ${activePublicElections.length} election(s) will appear on /vote\n`);

            for (const election of activePublicElections) {
                const candidates = await Candidate.find({ electionId: election._id })
                    .populate('userId', 'firstName lastName');

                console.log(`📊 ${election.title}`);
                console.log(`   Candidates: ${candidates.length}`);
                candidates.forEach(c => {
                    console.log(`   • ${c.userId?.firstName} ${c.userId?.lastName} - ${c.position}`);
                    console.log(`     Platform: ${c.platform?.length || 0} points`);
                    console.log(`     Details: ${c.phone ? 'Phone ✓' : ''} ${c.email ? 'Email ✓' : ''} ${c.background ? 'Background ✓' : ''}`);
                });
                console.log('');
            }
        }

        console.log('\n✅ Database verification complete!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

verifyIntegration();
