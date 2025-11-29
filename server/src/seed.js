const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');
const { User, Department, Election } = require('./models');

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Department.deleteMany({});
        await Election.deleteMany({});

        console.log('Cleared existing data');

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        // Create users
        const users = [
            {
                studentId: 'SEC001',
                email: 'secretary@husums.edu.et',
                password: hashedPassword,
                role: 'secretary',
                firstName: 'Sara',
                lastName: 'Tadesse',
                isProfileComplete: true,
                isApproved: true
            }
        ];

        const createdUsers = await User.insertMany(users);
        console.log(`Created ${createdUsers.length} users`);

        // Create departments
        const departments = [
            { name: 'Sports', description: 'Sports and Athletics Department', status: 'active' },
            { name: 'Media', description: 'Media and Communications Department', status: 'active' },
            { name: 'Academic', description: 'Academic Affairs Department', status: 'active' },
            { name: 'Social', description: 'Social Events Department', status: 'active' }
        ];

        const createdDepartments = await Department.insertMany(departments);
        console.log(`Created ${createdDepartments.length} departments`);

        // Create an election
        // Election creation removed to allow fresh start
        console.log('Skipped election creation');

        console.log('\n✅ Database seeded successfully!');
        console.log('\nLogin Credentials:');
        console.log('Secretary: SEC001 / 123456');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
