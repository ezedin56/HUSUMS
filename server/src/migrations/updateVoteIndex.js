const mongoose = require('mongoose');
require('dotenv').config();

console.log('Starting migration...');
console.log('MongoDB URI:', process.env.MONGO_URI || 'mongodb://localhost:27017/husums');

// Connect to MongoDB with timeout
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/husums', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
}).catch(err => {
    console.error('\n❌ Failed to connect to MongoDB!');
    console.error('Error:', err.message);
    console.error('\nPlease ensure MongoDB is running:');
    console.error('  - Run "mongod" in a separate terminal');
    console.error('  - Or start MongoDB service: "net start MongoDB"');
    process.exit(1);
});

const db = mongoose.connection;

db.on('error', (err) => {
    console.error('Connection error:', err.message);
    process.exit(1);
});

db.once('open', async () => {
    console.log('✓ Connected to MongoDB');

    try {
        const collection = db.collection('votes');

        // Drop the old index
        console.log('Dropping old index: electionId_1_studentId_1...');
        try {
            await collection.dropIndex('electionId_1_studentId_1');
            console.log('✓ Old index dropped successfully');
        } catch (error) {
            if (error.code === 27) {
                console.log('⚠ Old index does not exist, skipping...');
            } else {
                throw error;
            }
        }

        // Create the new index
        console.log('Creating new index: electionId_1_studentId_1_position_1...');
        await collection.createIndex(
            { electionId: 1, studentId: 1, position: 1 },
            { unique: true }
        );
        console.log('✓ New index created successfully');

        console.log('\n✅ Migration completed successfully!');
        console.log('Students can now vote once per position in each election.');

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
        process.exit(0);
    }
});
