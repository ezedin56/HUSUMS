require('dotenv').config();
const mongoose = require('mongoose');
const seedDatabase = require('./src/seed');

const runSeed = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        console.log(`Connecting to: ${mongoURI}`);
        await mongoose.connect(mongoURI);
        console.log('Connected to DB. Starting seed...');

        await seedDatabase();

        console.log('Seeding complete.');
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
};

runSeed();
