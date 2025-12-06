const mongoose = require('mongoose');
const Election = require('./src/models/Election');
const Candidate = require('./src/models/Candidate');
const fs = require('fs');

const MONGO_URI = 'mongodb+srv://adinanyous1_db_user:IfuqU5KgHcU2Ce30@cluster0.km0yvdt.mongodb.net/husums?retryWrites=true&w=majority';

async function findEveningElection() {
    try {
        await mongoose.connect(MONGO_URI);

        let output = 'Connected to Atlas.\n\n';

        // 1. Search for "evening" (case-insensitive) in title
        const specificElections = await Election.find({ title: { $regex: 'evening', $options: 'i' } });

        if (specificElections.length > 0) {
            output += `FOUND ${specificElections.length} elections matching 'evening':\n`;
            for (const e of specificElections) {
                const count = await Candidate.countDocuments({ electionId: e._id });
                output += `\n[MATCH] ID: ${e._id}\nTitle: ${e.title}\nCreated: ${e.createdAt}\nCandidate Count: ${count}\n`;
            }
        } else {
            output += "No election found with 'evening' in the title.\n";
        }

        // 2. Statistics check
        const totalElections = await Election.countDocuments();
        const totalCandidates = await Candidate.countDocuments();
        output += `\nTotal Elections in DB: ${totalElections}\n`;
        output += `Total Candidates in DB: ${totalCandidates}\n`;

        // 3. List ALL elections details
        output += "\n--- Detailed List of All Elections ---\n";
        const allElections = await Election.find({}).sort({ createdAt: -1 });

        for (const e of allElections) {
            const candidates = await Candidate.find({ electionId: e._id });
            output += `\nID: ${e._id}\nTitle: ${e.title}\nStatus: ${e.status}\nCreated: ${e.createdAt}\nCandidates (${candidates.length}):\n`;
            candidates.forEach(c => {
                output += ` - Name: ${c.name || 'N/A'} (Pos: ${c.position})\n`;
            });
        }

        fs.writeFileSync('evening_search_results.txt', output);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

findEveningElection();
