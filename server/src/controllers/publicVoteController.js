const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');
const User = require('../models/User');

// @desc    Get active elections with candidates for public voting
// @route   GET /api/public/elections/active
// @access  Public
const getActiveElections = async (req, res) => {
    try {
        const elections = await Election.find({ isOpen: true, status: 'ongoing' })
            .sort({ startDate: -1 });

        const electionsWithCandidates = await Promise.all(
            elections.map(async (election) => {
                const candidates = await Candidate.find({ electionId: election._id })
                    .populate('userId', 'firstName lastName');

                return {
                    id: election._id,
                    title: election.title,
                    description: election.description,
                    endDate: election.endDate,
                    candidates: candidates.map(c => ({
                        id: c._id,
                        name: c.userId ? `${c.userId.firstName} ${c.userId.lastName}` : 'Unknown',
                        position: c.position,
                        manifesto: c.manifesto,
                        description: c.description,
                        photo: c.photo
                    }))
                };
            })
        );

        res.json(electionsWithCandidates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify student by Student ID and Full Name
// @route   POST /api/public/verify-student
// @access  Public
const verifyStudent = async (req, res) => {
    const { studentId, fullName } = req.body;

    try {
        // Check if user exists with this student ID and name
        const user = await User.findOne({ studentId });

        if (!user) {
            return res.status(404).json({
                message: 'Student ID not found. Please check your Student ID.'
            });
        }

        const userFullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const providedName = fullName.toLowerCase().trim();

        if (userFullName !== providedName) {
            return res.status(400).json({
                message: 'Full name does not match our records. Please check your name.'
            });
        }

        res.json({
            verified: true,
            message: 'Student verified successfully',
            studentId: user.studentId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit public vote
// @route   POST /api/public/vote
// @access  Public
const submitPublicVote = async (req, res) => {
    const { studentId, fullName, votes } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    try {
        // 1. Verify student exists
        const user = await User.findOne({ studentId });
        if (!user) {
            return res.status(404).json({ message: 'Student ID not found' });
        }

        // 2. Verify full name matches
        const userFullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        if (userFullName !== fullName.toLowerCase().trim()) {
            return res.status(400).json({ message: 'Full name does not match' });
        }

        // 3. Process each vote (one per position)
        const voteResults = [];

        for (const vote of votes) {
            const { electionId, candidateId } = vote;

            // Check if election is open
            const election = await Election.findById(electionId);
            if (!election || !election.isOpen) {
                return res.status(400).json({ message: 'Election is not open for voting' });
            }

            // Verify candidate exists
            const candidate = await Candidate.findById(candidateId);
            if (!candidate) {
                return res.status(404).json({ message: 'Candidate not found' });
            }

            // Check if student already voted for this position in this election
            const existingVote = await Vote.findOne({
                electionId,
                studentId,
                position: candidate.position
            });
            if (existingVote) {
                return res.status(400).json({
                    message: `You have already voted for the ${candidate.position} position`
                });
            }

            // Create vote
            const newVote = await Vote.create({
                electionId,
                candidateId,
                position: candidate.position,
                studentId,
                voterName: fullName,
                ipAddress,
                timestamp: new Date()
            });

            // Increment candidate vote count
            await Candidate.findByIdAndUpdate(candidateId, {
                $inc: { voteCount: 1 }
            });

            voteResults.push(newVote);
        }

        res.status(201).json({
            message: 'Vote(s) submitted successfully!',
            votes: voteResults
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'You have already voted in this election'
            });
        }
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getActiveElections,
    verifyStudent,
    submitPublicVote
};
