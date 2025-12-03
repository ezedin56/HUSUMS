const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');
const User = require('../models/User');

// @desc    Get active elections with candidates for public voting
// @route   GET /api/public/elections/active
// @access  Public
const getActiveElections = async (req, res) => {
    try {
        // Fetch ongoing public elections only
        const elections = await Election.find({
            isOpen: true,
            status: 'ongoing',
            electionType: 'public'
        })
            .populate('createdBy', 'firstName lastName role')
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

    console.log('[VERIFY] Request:', { studentId, fullName });

    try {
        // Validate that both fields are provided
        if (!studentId || !fullName) {
            return res.status(400).json({
                message: 'Please provide both Student ID and Full Name.'
            });
        }

        // Check if user exists with this student ID
        const user = await User.findOne({ studentId: studentId.trim() });
        console.log('[VERIFY] User found:', user ? `Yes (${user.firstName} ${user.lastName})` : 'No');

        if (!user) {
            return res.status(404).json({
                message: 'Student ID not found. Please check your Student ID.'
            });
        }

        // Verify the full name matches (case-insensitive)
        const userFullName = `${user.firstName} ${user.lastName}`.toLowerCase().trim();
        const providedName = fullName.toLowerCase().trim();
        console.log('[VERIFY] Comparing:', { userFullName, providedName, match: userFullName === providedName });

        if (userFullName !== providedName) {
            return res.status(400).json({
                message: 'Full name does not match our records. Please check your name.'
            });
        }

        // Student verified successfully
        console.log('[VERIFY] Success!');
        res.json({
            verified: true,
            message: 'Student verified successfully',
            studentId: user.studentId
        });
    } catch (error) {
        console.error('[VERIFY] Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const submitPublicVote = async (req, res) => {
    const { studentId, fullName, votes } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    try {
        // Validation
        if (!votes || !Array.isArray(votes) || votes.length === 0) {
            return res.status(400).json({ message: 'No votes provided' });
        }

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

        // 3. Validate vote structure and check for duplicates
        const positions = new Set();
        for (const vote of votes) {
            if (!vote.electionId || !vote.candidateId) {
                return res.status(400).json({ message: 'Invalid vote structure' });
            }

            // Get candidate to check position
            const candidate = await Candidate.findById(vote.candidateId);
            if (!candidate) {
                return res.status(404).json({ message: 'Invalid candidate' });
            }

            // Ensure no duplicate positions in the same submission
            if (positions.has(candidate.position)) {
                return res.status(400).json({
                    message: `Cannot vote for multiple candidates in the same position: ${candidate.position}`
                });
            }
            positions.add(candidate.position);
        }

        // 4. Process each vote (one per position)
        const voteResults = [];
        const candidateUpdates = [];

        for (const vote of votes) {
            const { electionId, candidateId } = vote;

            // Check if election is open
            const election = await Election.findById(electionId);
            if (!election || !election.isOpen || election.status !== 'ongoing') {
                return res.status(400).json({
                    message: 'Election is not open for voting'
                });
            }

            // Verify candidate exists and belongs to this election
            const candidate = await Candidate.findById(candidateId);
            if (!candidate || candidate.electionId.toString() !== electionId) {
                return res.status(404).json({ message: 'Candidate not found in this election' });
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

            // Store candidate update for later
            candidateUpdates.push(candidateId);
            voteResults.push(newVote);
        }

        // Update all candidate vote counts
        await Promise.all(
            candidateUpdates.map(candidateId =>
                Candidate.findByIdAndUpdate(candidateId, {
                    $inc: { voteCount: 1 }
                })
            )
        );

        res.status(201).json({
            message: 'Vote(s) submitted successfully!',
            votesCount: voteResults.length,
            votes: voteResults.map(v => ({
                position: v.position,
                candidateId: v.candidateId
            }))
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'You have already voted for this position in this election'
            });
        }
        console.error('Vote submission error:', error);
        res.status(500).json({ message: 'An error occurred while submitting your vote' });
    }
};

module.exports = {
    getActiveElections,
    verifyStudent,
    submitPublicVote
};
