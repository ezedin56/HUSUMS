const mongoose = require('mongoose');
const Election = require('./src/models/Election');
const fs = require('fs');

// Using the known working URI
const MONGO_URI = 'mongodb+srv://adinanyous1_db_user:IfuqU5KgHcU2Ce30@cluster0.km0yvdt.mongodb.net/husums?retryWrites=true&w=majority';

async function getElections() {
    try {
        await mongoose.connect(MONGO_URI);

        let output = 'Connected to MongoDB Atlas\n';

        // Define "Yesterday" boundaries based on current date 2025-12-06
        const start = new Date('2025-12-05T00:00:00.000Z');
        const end = new Date('2025-12-05T23:59:59.999Z');

        output += `Searching for elections created between ${start.toISOString()} and ${end.toISOString()}...\n\n`;

        const elections = await Election.find({
            createdAt: {
                $gte: start,
                $lte: end
            }
        });

        if (elections.length === 0) {
            output += 'No elections found created yesterday.\n';
            output += 'Listing ALL elections instead:\n';
            const allElections = await Election.find({}).sort({ createdAt: -1 });
            allElections.forEach(e => {
                output += `- Title: ${e.title}\n`;
                output += `  ID: ${e._id}\n`;
                output += `  Created: ${e.createdAt}\n`;
                output += `  Status: ${e.status}\n`;
                output += '-------------------\n';
            });

        } else {
            output += `Found ${elections.length} elections created yesterday:\n`;
            elections.forEach(e => {
                output += `- Title: ${e.title}\n`;
                output += `  ID: ${e._id}\n`;
                output += `  Created: ${e.createdAt}\n`;
                output += `  Status: ${e.status}\n`;
                output += '-------------------\n';
            });
        }

        fs.writeFileSync('elections_list.txt', output);
        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

getElections();
