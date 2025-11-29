const mongoose = require('mongoose');
const Candidate = require('./src/models/Candidate');
const User = require('./src/models/User');

async function showWinner() {
    try {
        await mongoose.connect('mongodb://localhost:27017/husums');

        const electionId = '692b03f50789ee22f19e5fbc'; // Student Union President Election 2025

        const candidates = await Candidate.find({ electionId })
            .sort({ voteCount: -1 }); // Sort by vote count descending

        console.log('🏆 CURRENT ELECTION RESULTS\n');
        console.log('Election: Student Union President Election 2025\n');

        for (let i = 0; i < candidates.length; i++) {
            const user = await User.findById(candidates[i].userId);
            const name = user ? `${user.firstName} ${user.lastName}` : 'Unknown';
            const emoji = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '  ';

            console.log(`${emoji} ${name}`);
            console.log(`   Position: ${candidates[i].position}`);
            console.log(`   Votes: ${candidates[i].voteCount}`);
            console.log('');
        }

        const winner = candidates[0];
        const winnerUser = await User.findById(winner.userId);
        const winnerName = winnerUser ? `${winnerUser.firstName} ${winnerUser.lastName}` : 'Unknown';

        console.log('═══════════════════════════════════');
        console.log('🎓 WINNER 🎓');
        console.log(`${winnerName} - ${winner.voteCount} votes`);
        console.log('═══════════════════════════════════');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

showWinner();
