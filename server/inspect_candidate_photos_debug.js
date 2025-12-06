const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const candidatePath = path.join(__dirname, 'src', 'models', 'Candidate.js');
console.log('Requiring Candidate from:', candidatePath);

try {
    const Candidate = require(candidatePath);
    console.log('Candidate model loaded successfully');

    const connectDB = async () => {
        try {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('MongoDB connected');
        } catch (err) {
            console.error('MongoDB connection error:', err);
            process.exit(1);
        }
    };

    const inspectPhotos = async () => {
        await connectDB();
        try {
            const candidates = await Candidate.find({}, 'name photo');
            console.log('Candidates found:', candidates.length);
            candidates.forEach(c => {
                console.log(`- ${c.name}: ${c.photo}`);
            });
        } catch (error) {
            console.error('Error fetching candidates:', error);
        } finally {
            mongoose.connection.close();
        }
    };

    inspectPhotos();

} catch (err) {
    console.error('Error loading Candidate model:', err);
}
