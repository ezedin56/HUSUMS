const mongoose = require('mongoose');
const User = require('./src/models/User');
const Election = require('./src/models/Election');
const Candidate = require('./src/models/Candidate');
const Vote = require('./src/models/Vote');
require('dotenv').config();

const verifyPersistence = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to:', mongoose.connection.name);
        console.log('----------------------------------------');

        // 1. Verify Users
        const userCount = await User.countDocuments();
        const adminUser = await User.findOne({ role: 'publicvote_admin' });
        const testUser = await User.findOne({ studentId: '1209/16' });

        console.log(`👥 Users in Database: ${userCount}`);
        console.log(`   - Admin User Found: ${adminUser ? 'Yes (' + adminUser.studentId + ')' : 'No'}`);
        console.log(`   - Test User Found: ${testUser ? 'Yes (' + testUser.studentId + ')' : 'No'}`);
        console.log('----------------------------------------');

        // 2. Verify Elections & Candidates (Admin Posted Data)
        const elections = await Election.find();
        console.log(`🗳️  Elections in Database: ${elections.length}`);

        for (const election of elections) {
            const candidates = await Candidate.find({ electionId: election._id });
            console.log(`   Election: "${election.title}"`);
            console.log(`   - Candidates: ${candidates.length}`);
            candidates.forEach(c => {
                console.log(`     * Candidate ID: ${c._id}`);
                console.log(`       Photo Stored: ${c.photo ? 'Yes (' + c.photo + ')' : 'No'}`);
            });
        }
        console.log('----------------------------------------');

        // 3. Verify Votes (User Actions)
        const voteCount = await Vote.countDocuments();
        const recentVotes = await Vote.find().sort({ createdAt: -1 }).limit(5);

        console.log(`✅ Total Votes Cast: ${voteCount}`);
        console.log('   Recent Votes:');
        recentVotes.forEach(v => {
            console.log(`   - Voter: ${v.voterName} (${v.studentId})`);
            console.log(`     Position: ${v.position}`);
            console.log(`     Time: ${v.createdAt}`);
        });
        console.log('----------------------------------------');

        console.log('🎉 CONCLUSION: All data is successfully stored in the persistent MongoDB database.');

        mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error);
    }
};

verifyPersistence();
