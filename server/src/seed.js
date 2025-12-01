const User = require('./models/User');
const Election = require('./models/Election');
const Candidate = require('./models/Candidate');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        // 1. Seed User
        let user = await User.findOne({ studentId: '1209/16' });
        if (user) {
            console.log('User already exists, skipping user seed.');
        } else {
            const hashedPassword = await bcrypt.hash('123456', 10);
            user = await User.create({
                firstName: 'Ezedin',
                lastName: 'Aliyi Usman',
                studentId: '1209/16',
                password: hashedPassword,
                role: 'member',
                email: 'ezedin.aliyi@student.hu.edu.et',
                department: 'Computer Science',
                year: 4,
                avatar: 'https://ui-avatars.com/api/?name=Ezedin+Aliyi+Usman&size=200&background=4F46E5&color=fff'
            });
            console.log('🎉 Test student created successfully!');
        }

        // 1.5 Seed Public Admin
        let admin = await User.findOne({ studentId: 'ADMIN001' });
        if (admin) {
            console.log('Public admin already exists, skipping admin seed.');
        } else {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            admin = await User.create({
                firstName: 'Public',
                lastName: 'Admin',
                studentId: 'ADMIN001',
                password: hashedPassword,
                role: 'publicvote_admin',
                email: 'admin@husums.edu.et',
                department: 'Administration',
                year: 0,
                avatar: 'https://ui-avatars.com/api/?name=Public+Admin&size=200&background=00ff00&color=000'
            });
            console.log('👨‍💼 Public admin created successfully!');
        }

        // 1.6 Seed President
        let president = await User.findOne({ studentId: 'PRES001' });
        if (president) {
            console.log('President already exists, skipping president seed.');
        } else {
            const hashedPassword = await bcrypt.hash('123456', 10);
            president = await User.create({
                firstName: 'John',
                lastName: 'President',
                studentId: 'PRES001',
                password: hashedPassword,
                role: 'president',
                email: 'president@husums.edu.et',
                department: 'Administration',
                year: 4,
                isApproved: true,
                isProfileComplete: true,
                avatar: 'https://ui-avatars.com/api/?name=John+President&size=200&background=ff0000&color=fff'
            });
            console.log('👨‍💼 President created successfully!');
        }

        // 1.7 Seed Secretary
        let secretary = await User.findOne({ studentId: 'SEC001' });
        if (secretary) {
            console.log('Secretary already exists, skipping secretary seed.');
        } else {
            const hashedPassword = await bcrypt.hash('123456', 10);
            secretary = await User.create({
                firstName: 'Sarah',
                lastName: 'Secretary',
                studentId: 'SEC001',
                password: hashedPassword,
                role: 'secretary',
                email: 'secretary@husums.edu.et',
                department: 'Administration',
                year: 3,
                isApproved: true,
                isProfileComplete: true,
                avatar: 'https://ui-avatars.com/api/?name=Sarah+Secretary&size=200&background=ff00ff&color=fff'
            });
            console.log('👩‍💼 Secretary created successfully!');
        }

        // 1.8 Seed VP
        let vp = await User.findOne({ studentId: 'VP001' });
        if (vp) {
            console.log('VP already exists, skipping VP seed.');
        } else {
            const hashedPassword = await bcrypt.hash('123456', 10);
            vp = await User.create({
                firstName: 'Victor',
                lastName: 'Vice',
                studentId: 'VP001',
                password: hashedPassword,
                role: 'vp',
                email: 'vp@husums.edu.et',
                department: 'Administration',
                year: 3,
                isApproved: true,
                isProfileComplete: true,
                avatar: 'https://ui-avatars.com/api/?name=Victor+Vice&size=200&background=00ffff&color=000'
            });
            console.log('👨‍💼 VP created successfully!');
        }

        // 1.9 Seed Dept Head
        let deptHead = await User.findOne({ studentId: 'DEPT001' });
        if (deptHead) {
            console.log('Dept Head already exists, skipping dept head seed.');
        } else {
            const hashedPassword = await bcrypt.hash('123456', 10);
            deptHead = await User.create({
                firstName: 'David',
                lastName: 'Department',
                studentId: 'DEPT001',
                password: hashedPassword,
                role: 'dept_head',
                email: 'depthead@husums.edu.et',
                department: 'Computer Science',
                year: 4,
                isApproved: true,
                isProfileComplete: true,
                avatar: 'https://ui-avatars.com/api/?name=David+Department&size=200&background=ffff00&color=000'
            });
            console.log('👨‍🏫 Dept Head created successfully!');
        }


        // 2. Seed Election
        let election = await Election.findOne({ status: 'ongoing' });
        if (election) {
            console.log('Active election already exists, skipping election seed.');
        } else {
            election = await Election.create({
                title: 'Student Union General Election 2025',
                description: 'Annual election for Student Union representatives',
                positions: ['President', 'Vice President', 'Secretary', 'Treasurer'],
                startDate: new Date(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                status: 'ongoing',
                isOpen: true,
                createdBy: user._id // Just assigning to the test user for now
            });
            console.log('🗳️  Active election created!');
        }

        // 3. Seed Candidates
        const candidateCount = await Candidate.countDocuments({ electionId: election._id });
        if (candidateCount > 0) {
            console.log('Candidates already exist, skipping candidate seed.');
        } else {
            // Create users for candidates
            const candidateUsers = [
                {
                    firstName: 'John',
                    lastName: 'Doe',
                    studentId: 'CAND001',
                    email: 'john.doe@student.hu.edu.et',
                    position: 'President',
                    manifesto: 'Better campus life for everyone!'
                },
                {
                    firstName: 'Jane',
                    lastName: 'Smith',
                    studentId: 'CAND002',
                    email: 'jane.smith@student.hu.edu.et',
                    position: 'President',
                    manifesto: 'Transparency and Accountability'
                },
                {
                    firstName: 'Alice',
                    lastName: 'Johnson',
                    studentId: 'CAND003',
                    email: 'alice.johnson@student.hu.edu.et',
                    position: 'Secretary',
                    manifesto: 'Efficient documentation and communication'
                }
            ];

            for (const cUser of candidateUsers) {
                let user = await User.findOne({ studentId: cUser.studentId });
                if (!user) {
                    const hashedPassword = await bcrypt.hash('123456', 10);
                    user = await User.create({
                        firstName: cUser.firstName,
                        lastName: cUser.lastName,
                        studentId: cUser.studentId,
                        password: hashedPassword,
                        role: 'member',
                        email: cUser.email,
                        department: 'General',
                        year: 3
                    });
                }

                await Candidate.create({
                    electionId: election._id,
                    userId: user._id,
                    position: cUser.position,
                    manifesto: cUser.manifesto,
                    description: `${user.year}rd Year, ${user.department}`,
                    voteCount: 0
                });
            }
            console.log('👥 Candidates created!');
        }


        console.log('\n📋 Test Credentials:');
        console.log('   Student ID: 1209/16');
        console.log('   Password: 123456');
        console.log('   Full Name: Ezedin Aliyi Usman');
        console.log('\n👨‍💼 Admin Credentials:');
        console.log('   Student ID: ADMIN001');
        console.log('   Password: admin123');
        console.log('   Role: publicvote_admin');
        console.log('\n👨‍💼 President Credentials:');
        console.log('   Student ID: PRES001');
        console.log('   Password: 123456');
        console.log('   Role: president');
        console.log('\n👩‍💼 Secretary Credentials:');
        console.log('   Student ID: SEC001');
        console.log('   Password: 123456');
        console.log('   Role: secretary');
        console.log('\n👨‍💼 VP Credentials:');
        console.log('   Student ID: VP001');
        console.log('   Password: 123456');
        console.log('   Role: vp');
        console.log('\n👨‍🏫 Dept Head Credentials:');
        console.log('   Student ID: DEPT001');
        console.log('   Password: 123456');
        console.log('   Role: dept_head');


    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
    }
};

module.exports = seedDatabase;
