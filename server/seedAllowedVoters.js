const mongoose = require('mongoose');
const AllowedVoter = require('./src/models/AllowedVoter');

// --- CONFIGURATION ---
// Same URI as before
const MONGO_URI = 'mongodb+srv://adinanyous1_db_user:IfuqU5KgHcU2Ce30@cluster0.km0yvdt.mongodb.net/husums?retryWrites=true&w=majority';
// ---------------------

async function seedAllowedVoters() {
    try {
        console.log('🔗 Connecting to remote MongoDB Atlas...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected successfully!');

        const voters = [
            { studentId: 'UGPR/1234/16', fullName: 'John Doe' },
            { studentId: 'UGPR/5678/16', fullName: 'Jane Smith' },
            { studentId: 'UGPR/9012/16', fullName: 'Alice Johnson' },
            { studentId: 'UGPR/3456/16', fullName: 'Bob Brown' }
        ];

        let addedCount = 0;

        for (const voter of voters) {
            const existing = await AllowedVoter.findOne({ studentId: voter.studentId });
            if (!existing) {
                await AllowedVoter.create(voter);
                console.log(`✅ Added Voter: ${voter.studentId} - ${voter.fullName}`);
                addedCount++;
            } else {
                console.log(`ℹ️  Voter exists: ${voter.studentId}`);
            }
        }

        console.log(`\n✨ Seeding complete! Added ${addedCount} new allowed voters.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

seedAllowedVoters();
