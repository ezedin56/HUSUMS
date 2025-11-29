const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');
const { User, Election, Candidate } = require('./models');

const seedVoters = async () => {
    try {
        await connectDB();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // 1. Ensure President Exists
        let president = await User.findOne({ studentId: 'PRES001' });
        if (!president) {
            president = await User.create({
                firstName: 'President',
                lastName: 'User',
                studentId: 'PRES001',
                email: 'pres@test.com',
                password: hashedPassword,
                role: 'president',
                isApproved: true
            });
            console.log('Created President: PRES001');
        } else {
            console.log('President PRES001 already exists');
        }

        // 2. Ensure Member Exists
        let member = await User.findOne({ studentId: 'MEM001' });
        if (!member) {
            member = await User.create({
                firstName: 'Member',
                lastName: 'One',
                studentId: 'MEM001',
                email: 'mem@test.com',
                password: hashedPassword,
                role: 'member',
                isApproved: true
            });
            console.log('Created Member: MEM001');
        } else {
            console.log('Member MEM001 already exists');
        }

        // 3. Ensure Election Exists
        let election = await Election.findOne({ title: 'Test Election 2025' });
        if (!election) {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 1);

            election = await Election.create({
                title: 'Test Election 2025',
                description: 'Test Description',
                startDate,
                endDate,
                status: 'ongoing', // Ensure it's active
                createdBy: president._id
            });
            console.log('Created Election: Test Election 2025');
        } else {
            console.log('Election already exists');
            // Ensure status is ongoing
            election.status = 'ongoing';
            await election.save();
        }

        // 4. Ensure Candidate Exists
        let candidate = await Candidate.findOne({ electionId: election._id, userId: member._id });
        if (!candidate) {
            candidate = await Candidate.create({
                electionId: election._id,
                userId: member._id,
                position: 'President',
                manifesto: 'Vote for me',
                description: 'I am the best',
                photo: 'https://via.placeholder.com/150', // Dummy photo
                voteCount: 0
            });
            console.log('Added Candidate: Member One');
        } else {
            console.log('Candidate already exists');
        }

        console.log('Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding:', error);
        process.exit(1);
    }
};

seedVoters();
