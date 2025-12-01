const mongoose = require('mongoose');

/**
 * Migrates the Vote collection index from (electionId, studentId) to (electionId, studentId, position)
 * This allows students to vote once per position instead of once per election
 */
const migrateVoteIndex = async () => {
    try {
        const db = mongoose.connection.db;
        const collection = db.collection('votes');

        console.log('Checking Vote collection indexes...');

        // Get existing indexes
        const indexes = await collection.indexes();
        const oldIndexExists = indexes.some(idx => idx.name === 'electionId_1_studentId_1');
        const newIndexExists = indexes.some(idx => idx.name === 'electionId_1_studentId_1_position_1');

        if (newIndexExists && !oldIndexExists) {
            console.log('✓ Vote indexes are up to date');
            return;
        }

        // Drop old index if it exists
        if (oldIndexExists) {
            console.log('Dropping old index: electionId_1_studentId_1...');
            await collection.dropIndex('electionId_1_studentId_1');
            console.log('✓ Old index dropped');
        }

        // Create new index if it doesn't exist
        if (!newIndexExists) {
            console.log('Creating new index: electionId_1_studentId_1_position_1...');
            await collection.createIndex(
                { electionId: 1, studentId: 1, position: 1 },
                { unique: true }
            );
            console.log('✓ New index created');
        }

        console.log('✅ Vote index migration completed successfully!');

    } catch (error) {
        console.error('⚠ Vote index migration failed:', error.message);
        // Don't crash the server, just log the error
    }
};

module.exports = migrateVoteIndex;
