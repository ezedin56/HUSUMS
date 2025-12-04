const mongoose = require('mongoose');
require('dotenv').config();

const Candidate = require('./src/models/Candidate');
const Election = require('./src/models/Election');

async function populateCandidateData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas');

        // Find the candidate "wayesa Aliyi"
        // We'll search by looking for a candidate in the active election
        const election = await Election.findOne({ status: 'ongoing', electionType: 'public' });
        if (!election) {
            console.log('❌ No ongoing public election found.');
            process.exit(1);
        }

        const candidates = await Candidate.find({ electionId: election._id }).populate('userId');
        const targetCandidate = candidates.find(c =>
            c.userId && (c.userId.firstName.toLowerCase().includes('wayesa') || c.userId.lastName.toLowerCase().includes('aliyi'))
        );

        if (!targetCandidate) {
            console.log('❌ Candidate "wayesa Aliyi" not found in the ongoing election.');
            // Fallback: update the first candidate found
            if (candidates.length > 0) {
                console.log(`⚠️ Updating first available candidate: ${candidates[0].userId.firstName}`);
                await updateCandidate(candidates[0]);
            } else {
                console.log('❌ No candidates found to update.');
            }
        } else {
            console.log(`✅ Found candidate: ${targetCandidate.userId.firstName} ${targetCandidate.userId.lastName}`);
            await updateCandidate(targetCandidate);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

async function updateCandidate(candidate) {
    candidate.slogan = "Empowering Students, Building the Future";
    candidate.platform = [
        "Improve campus Wi-Fi connectivity in all dorms",
        "Establish a 24/7 study center with resources",
        "Launch a student mentorship program with alumni",
        "Organize monthly cultural and sports events"
    ];
    candidate.phone = "+251 911 234 567";
    candidate.email = "wayesa.aliyi@husums.edu.et";
    candidate.region = "Oromia";
    candidate.zone = "East Hararghe";
    candidate.woreda = "Haramaya";
    candidate.city = "Haramaya";
    candidate.background = "I am a third-year Computer Science student passionate about technology and community service. I have served as a class representative for two years.";
    candidate.education = [
        "BSc in Computer Science (Current)",
        "High School Diploma - Haramaya Secondary School"
    ];
    candidate.experience = [
        "Class Representative (2023-2024)",
        "Tech Club President (2024)",
        "Volunteer at Local Youth Center"
    ];
    candidate.achievements = [
        "Dean's List (2023, 2024)",
        "Best Project Award - Tech Expo 2024",
        "Community Service Certificate"
    ];

    await candidate.save();
    console.log('✅ Candidate data populated successfully!');
    console.log('   Now go to http://localhost:5173/vote and check the details!');
}

populateCandidateData();
