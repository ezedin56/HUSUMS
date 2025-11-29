const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');
const { User, Department, Election, Candidate, Attendance } = require('./models');

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Department.deleteMany({});
        await Election.deleteMany({});
        await Candidate.deleteMany({});
        await Attendance.deleteMany({});

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
            },
            {
                studentId: 'MEM001',
                email: 'member1@husums.edu.et',
                password: hashedPassword,
                role: 'member',
                firstName: 'Abebe',
                lastName: 'Kebede',
                isProfileComplete: true,
                isApproved: true
            },
            {
                studentId: 'MEM002',
                email: 'member2@husums.edu.et',
                password: hashedPassword,
                role: 'member',
                firstName: 'Chala',
                lastName: 'Bekele',
                isProfileComplete: true,
                isApproved: true
            },
            {
                studentId: 'CAND001',
                email: 'candidate1@husums.edu.et',
                password: hashedPassword,
                role: 'member',
                firstName: 'Dawit',
                lastName: 'Yohannes',
                isProfileComplete: true,
                isApproved: true
            },
            {
                studentId: 'CAND002',
                email: 'candidate2@husums.edu.et',
                password: hashedPassword,
                role: 'member',
                firstName: 'Elsa',
                lastName: 'Haile',
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

        // Create an active election
        const election = await Election.create({
            title: 'Student Council Election 2025',
            description: 'Election for the new Student Council members.',
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Ends in 7 days
            isOpen: true,
            createdBy: createdUsers[0]._id // Secretary created it
        });
        console.log('Created active election');

        // Create candidates
        const candidates = [
            {
                electionId: election._id,
                userId: createdUsers[3]._id, // Dawit
                position: 'President',
                manifesto: 'I promise to improve campus facilities.',
                voteCount: 0
            },
            {
                electionId: election._id,
                userId: createdUsers[4]._id, // Elsa
                position: 'President',
                manifesto: 'Focusing on student welfare and events.',
                voteCount: 0
            }
        ];

        await Candidate.insertMany(candidates);
        console.log('Created candidates');

        // Create attendance records
        const attendanceRecords = [
            {
                userId: createdUsers[1]._id, // Abebe
                date: new Date(),
                checkInTime: '08:30:00',
                status: 'present'
            },
            {
                userId: createdUsers[2]._id, // Chala
                date: new Date(),
                checkInTime: '09:15:00',
                status: 'late'
            }
        ];

        await Attendance.insertMany(attendanceRecords);
        console.log('Created attendance records');

        console.log('\n✅ Database seeded successfully!');
        console.log('\nLogin Credentials:');
        console.log('Secretary: SEC001 / 123456');
        console.log('Member 1: MEM001 / 123456');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
