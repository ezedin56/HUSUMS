const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');
const User = require('./models/User');
const Election = require('./models/Election');
const Candidate = require('./models/Candidate');

const seedMembers = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        console.log('Starting member seed...');

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        // Create member users
        const members = [
            {
                studentId: 'CAND001',
                email: 'ezezdin@hu.edu.et',
                password: hashedPassword,
                role: 'member',
                firstName: 'Ezezdin',
                lastName: 'Aliyi',
                year: 3,
                isProfileComplete: true,
                isApproved: true
            },
            {
                studentId: 'CAND002',
                email: 'sultan@hu.edu.et',
                password: hashedPassword,
                role: 'member',
                firstName: 'Sultan',
                lastName: 'Adinan',
                year: 2,
                isProfileComplete: true,
                isApproved: true
            },
            {
                studentId: 'CAND003',
                email: 'kume@hu.edu.et',
                password: hashedPassword,
                role: 'member',
                firstName: 'Kume',
                lastName: 'Amin',
                year: 4,
                isProfileComplete: true,
                isApproved: true
            },
            {
                studentId: 'MEM001',
                email: 'member1@hu.edu.et',
                password: hashedPassword,
                role: 'member',
                firstName: 'Ahmed',
                lastName: 'Hassan',
                year: 2,
                isProfileComplete: true,
                isApproved: true
            }
        ];

        // Insert members
        const createdMembers = [];
        for (const memberData of members) {
            const existing = await User.findOne({ studentId: memberData.studentId });
            if (!existing) {
                const member = await User.create(memberData);
                createdMembers.push(member);
                console.log(`✓ Created member: ${member.firstName} ${member.lastName} (${member.studentId})`);
            } else {
                createdMembers.push(existing);
                console.log(`- Member exists: ${existing.firstName} ${existing.lastName} (${existing.studentId})`);
            }
        }

        // Create an election
        const electionData = {
            title: 'Student Union President Election 2025',
            description: 'Annual election for Student Union President position',
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            status: 'ongoing',
            isOpen: true
        };

        let election = await Election.findOne({ title: electionData.title });
        if (!election) {
            election = await Election.create(electionData);
            console.log(`✓ Created election: ${election.title}`);
        } else {
            // Update election to be ongoing
            election.status = 'ongoing';
            election.isOpen = true;
            await election.save();
            console.log(`- Election exists: ${election.title} (updated to ongoing)`);
        }

        // Create candidates (first 3 members)
        const candidatesData = [
            {
                userId: createdMembers[0]._id,
                electionId: election._id,
                position: 'President',
                manifesto: 'I promise to improve campus Wi-Fi, extend library hours, and create more study spaces for students.',
                description: 'Visionary leader with a passion for technology and student welfare.',
                photo: 'https://ui-avatars.com/api/?name=Ezezdin+Aliyi&size=200&background=4F46E5&color=fff'
            },
            {
                userId: createdMembers[1]._id,
                electionId: election._id,
                position: 'President',
                manifesto: 'Focusing on sports facilities, dormitory maintenance, and creating a vibrant campus life.',
                description: 'Dedicated sportsman and community organizer.',
                photo: 'https://ui-avatars.com/api/?name=Sultan+Adinan&size=200&background=10B981&color=fff'
            },
            {
                userId: createdMembers[2]._id,
                electionId: election._id,
                position: 'President',
                manifesto: 'Advocating for better cafeteria services, academic support programs, and mental health resources.',
                description: 'Compassionate advocate for student rights and academic excellence.',
                photo: 'https://ui-avatars.com/api/?name=Kume+Amin&size=200&background=F59E0B&color=fff'
            }
        ];

        for (const candData of candidatesData) {
            const existing = await Candidate.findOne({
                electionId: candData.electionId,
                userId: candData.userId
            });

            if (!existing) {
                await Candidate.create(candData);
                const user = await User.findById(candData.userId);
                console.log(`✓ Added candidate: ${user.firstName} ${user.lastName}`);
            } else {
                console.log(`- Candidate exists for user: ${existing.userId}`);
            }
        }

        console.log('\n✅ Member seeding completed successfully!');
        console.log('\n📋 Member Login Credentials:');
        console.log('   Ezezdin Aliyi: CAND001 / 123456 (Candidate)');
        console.log('   Sultan Adinan: CAND002 / 123456 (Candidate)');
        console.log('   Kume Amin: CAND003 / 123456 (Candidate)');
        console.log('   Ahmed Hassan: MEM001 / 123456 (Regular Member)');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding members:', error);
        process.exit(1);
    }
};

seedMembers();
