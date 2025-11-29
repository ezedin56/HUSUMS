const sequelize = require('./config/database');
const { User, Election, Candidate } = require('./models');
const bcrypt = require('bcryptjs');

const seedCandidates = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        // Sync Candidate model to add new columns
        await Candidate.sync({ alter: true });
        console.log('Candidate table synced');

        // 1. Create Users
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('123456', salt);

        const users = [
            {
                studentId: 'CAND001',
                email: 'ezezdin@hu.edu.et',
                password,
                role: 'member',
                firstName: 'Ezezdin',
                lastName: 'Aliyi',
                isProfileComplete: true
            },
            {
                studentId: 'CAND002',
                email: 'sultan@hu.edu.et',
                password,
                role: 'member',
                firstName: 'Sultan',
                lastName: 'Adinan',
                isProfileComplete: true
            },
            {
                studentId: 'CAND003',
                email: 'kume@hu.edu.et',
                password,
                role: 'member',
                firstName: 'Kume',
                lastName: 'Amin',
                isProfileComplete: true
            }
        ];

        const createdUsers = [];
        for (const userData of users) {
            let user = await User.findOne({ where: { studentId: userData.studentId } });
            if (!user) {
                user = await User.create(userData);
                console.log(`Created user: ${user.firstName} ${user.lastName}`);
            } else {
                console.log(`User exists: ${user.firstName} ${user.lastName}`);
            }
            createdUsers.push(user);
        }

        // 2. Create Election
        const electionData = {
            title: 'Student Union President Election 2025',
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
            status: 'ongoing'
        };

        let election = await Election.findOne({ where: { title: electionData.title } });
        if (!election) {
            election = await Election.create(electionData);
            console.log('Created election: ' + election.title);
        } else {
            console.log('Election exists: ' + election.title);
        }

        // 3. Add Candidates
        const candidates = [
            {
                userId: createdUsers[0].id,
                position: 'President',
                manifesto: 'I promise to improve campus Wi-Fi and library hours.',
                description: 'Visionary leader with a passion for technology and student welfare.',
                photoUrl: '/uploads/candidate_ezezdin.jpg'
            },
            {
                userId: createdUsers[1].id,
                position: 'President',
                manifesto: 'Focusing on sports facilities and dormitory maintenance.',
                description: 'Dedicated sportsman and community organizer.',
                photoUrl: '/uploads/candidate_sultan.jpg'
            },
            {
                userId: createdUsers[2].id,
                position: 'President',
                manifesto: 'Advocating for better cafeteria services and academic support.',
                description: 'Compassionate advocate for student rights and academic excellence.',
                photoUrl: '/uploads/candidate_kume.jpg'
            }
        ];

        for (const candData of candidates) {
            const existing = await Candidate.findOne({ where: { electionId: election.id, userId: candData.userId } });
            if (!existing) {
                await Candidate.create({
                    electionId: election.id,
                    ...candData
                });
                console.log(`Added candidate: ${candData.description}`);
            } else {
                console.log(`Candidate exists for user ID: ${candData.userId}`);
            }
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding candidates:', error);
        process.exit(1);
    }
};

seedCandidates();
