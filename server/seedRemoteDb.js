const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

// --- CONFIGURATION ---
// Paste your MongoDB Atlas connection string here (the same one you used on Render)
const MONGO_URI = 'mongodb+srv://adinanyous1_db_user:IfuqU5KgHcU2Ce30@cluster0.km0yvdt.mongodb.net/husums?retryWrites=true&w=majority';
// ---------------------

async function seedRemoteDatabase() {
    try {
        console.log('🔗 Connecting to remote MongoDB Atlas...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected successfully!');

        // Check if president already exists
        const presidentExists = await User.findOne({ role: 'president' });
        if (presidentExists) {
            console.log('⚠️  President account already exists.');
        } else {
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash('president123', salt);

            await User.create({
                studentId: 'PRES001',
                firstName: 'Mr.',
                lastName: 'President',
                email: 'president@husums.com',
                password: password,
                role: 'president',
                department: 'Political Science'
            });
            console.log('✅ Created President Account:');
            console.log('   ID: PRES001');
            console.log('   Pass: president123');
        }

        // Check if Public Vote Admin already exists
        const publicAdminExists = await User.findOne({ role: 'publicvote_admin' });
        if (publicAdminExists) {
            console.log('⚠️  Public Vote Admin account already exists.');
        } else {
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash('public123', salt);

            await User.create({
                studentId: 'PUB001',
                firstName: 'Public',
                lastName: 'Admin',
                email: 'public@husums.com',
                password: password,
                role: 'publicvote_admin',
                department: 'Electoral Board'
            });
            console.log('✅ Created Public Vote Admin Account:');
            console.log('   ID: PUB001');
            console.log('   Pass: public123');
        }

        console.log('\n✨ Database seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

seedRemoteDatabase();
