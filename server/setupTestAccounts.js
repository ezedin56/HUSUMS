const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB inside the function
const userSchema = new mongoose.Schema({
    studentId: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['member', 'dept_head', 'secretary', 'president', 'vp'], default: 'member' },
    firstName: String,
    lastName: String,
    department: String
});
const User = mongoose.model('User', userSchema);

async function createSecretary() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/husums');
        // Check if secretary exists
        let secretary = await User.findOne({ studentId: 'SEC001' });

        if (secretary) {
            console.log('✅ Secretary account already exists:');
            console.log('   Student ID: SEC001');
            console.log('   Role:', secretary.role);
            console.log('   Name:', secretary.firstName, secretary.lastName);
        } else {
            // Create secretary
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('secretary123', salt);

            secretary = await User.create({
                studentId: 'SEC001',
                email: 'secretary@hu.edu.et',
                password: hashedPassword,
                role: 'secretary',
                firstName: 'Sarah',
                lastName: 'Secretary',
                department: 'Administration'
            });

            console.log('✅ Secretary account created successfully!');
            console.log('   Student ID: SEC001');
            console.log('   Password: secretary123');
            console.log('   Role:', secretary.role);
        }

        // Also create some test members
        const testMembers = [
            { studentId: 'MEM001', email: 'john.doe@student.hu.edu.et', firstName: 'John', lastName: 'Doe', role: 'member', department: 'Computer Science' },
            { studentId: 'MEM002', email: 'jane.smith@student.hu.edu.et', firstName: 'Jane', lastName: 'Smith', role: 'member', department: 'Engineering' },
            { studentId: 'MEM003', email: 'bob.johnson@student.hu.edu.et', firstName: 'Bob', lastName: 'Johnson', role: 'member', department: 'Business' }
        ];

        for (const memberData of testMembers) {
            const exists = await User.findOne({ studentId: memberData.studentId });
            if (!exists) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('member123', salt);
                await User.create({
                    ...memberData,
                    password: hashedPassword
                });
                console.log(`✅ Created test member: ${memberData.firstName} ${memberData.lastName}`);
            }
        }

        console.log('\n📊 Database ready for testing!');
        console.log('\nLogin credentials:');
        console.log('Secretary: SEC001 / secretary123');
        console.log('Members: MEM001, MEM002, MEM003 / member123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createSecretary();
