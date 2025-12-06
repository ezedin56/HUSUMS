const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const AllowedVoter = require('./models/AllowedVoter');
const validVoters = require('./data/valid_voters');

// Function to normalize student ID (same logic as in publicVoteController)
const normalizeStudentId = (id) => {
    let cleaned = id.trim().toUpperCase();
    if (cleaned.startsWith('UGPR/')) return cleaned.replace('UGPR/', '');
    if (cleaned.startsWith('UGPR')) return cleaned.replace('UGPR', '');
    return cleaned;
};

const seedAllowedVoters = async () => {
    try {
        await connectDB();

        console.log('Clearing existing allowed voters...');
        await AllowedVoter.deleteMany({});

        console.log(`Seeding ${validVoters.length} allowed voters...`);
        await AllowedVoter.insertMany(validVoters.map(v => ({
            studentId: normalizeStudentId(v.id),  // Normalize ID before inserting
            fullName: v.name
        })));

        console.log('Allowed voters seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding allowed voters:', error);
        process.exit(1);
    }
};

seedAllowedVoters();
