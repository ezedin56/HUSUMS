const { Vote, Election, Candidate, User } = require('../models');

// @desc    Get active elections
// @route   GET /api/elections/active
// @access  Private
const getActiveElections = async (req, res) => {
    try {
        // Fetch open elections and populate creator info including role
        const allElections = await Election.find({ status: 'ongoing', isOpen: true })
            .populate('createdBy', 'firstName lastName role')
            .sort({ startDate: -1 });

        // Filter out elections created by publicvote_admin
        const elections = allElections.filter(election =>
            election.createdBy && ['president', 'vp', 'secretary'].includes(election.createdBy.role)
        );

        // Manually fetch candidates for each election
        const electionsWithCandidates = await Promise.all(
            elections.map(async (election) => {
                const candidates = await Candidate.find({ electionId: election._id })
                    .populate('userId', 'firstName lastName department bio profilePicture');

                const positionSummary = candidates.reduce((acc, candidate) => {
                    acc[candidate.position] = (acc[candidate.position] || 0) + 1;
                    return acc;
                }, {});

                return {
                    ...election.toObject(),
                    id: election._id, // Add id field for frontend compatibility
                    Candidates: candidates.map(c => ({
                        id: c._id,
                        userId: c.userId ? c.userId._id : null,
                        position: c.position,
                        manifesto: c.manifesto,
                        description: c.description,
                        photo: c.photo, // Changed from photoUrl to photo
                        user: c.userId ? {
                            firstName: c.userId.firstName,
                            lastName: c.userId.lastName,
                            department: c.userId.department,
                            bio: c.userId.bio,
                            profilePicture: c.userId.profilePicture
                        } : null,
                        User: c.userId ? {
                            firstName: c.userId.firstName,
                            lastName: c.userId.lastName
                        } : { firstName: 'Unknown', lastName: 'User' }
                    })),
                    positionSummary: Object.entries(positionSummary).map(([position, candidateCount]) => ({
                        position,
                        candidateCount
                    }))
                };
            })
        );

        res.json(electionsWithCandidates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get candidates for an election
// @route   GET /api/candidates/:electionId
// @access  Private
const getCandidatesByElection = async (req, res) => {
    const { electionId } = req.params;

    try {
        const candidates = await Candidate.find({ electionId })
            .populate('userId', 'firstName lastName profilePicture department bio')
            .sort({ position: 1, voteCount: -1 });
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit a vote
// @route   POST /api/vote
// @access  Private
const submitVote = async (req, res) => {
    const { electionId, candidateId } = req.body;
    const voterId = req.user._id;
    const ipAddress = req.ip || req.connection.remoteAddress;

    try {
        // 1. Verify election exists and is open
        const election = await Election.findById(electionId);
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }
        if (!election.isOpen) {
            return res.status(400).json({ message: 'Voting is not open for this election' });
        }

        // 2. Check if user has already voted in this election
        // Candidate details (includes position)
        const candidate = await Candidate.findById(candidateId)
            .populate('userId', 'firstName lastName department');
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        if (candidate.electionId.toString() !== electionId) {
            return res.status(400).json({ message: 'Candidate does not belong to this election' });
        }

        const position = candidate.position;

        // 2. Check if user has already voted for this position in this election
        const existingVote = await Vote.findOne({ electionId, voterId, position });
        if (existingVote) {
            return res.status(400).json({ message: `You have already voted for the ${position} position` });
        }

        // 3. Create vote record
        const vote = await Vote.create({
            electionId,
            candidateId,
            voterId,
            studentId: req.user.studentId,
            position,
            ipAddress
        });

        // 4. Increment candidate vote count
        candidate.voteCount += 1;
        await candidate.save();

        res.status(201).json({
            message: 'Vote submitted successfully',
            vote: {
                electionId: vote.electionId,
                candidateId: vote.candidateId,
                position,
                timestamp: vote.createdAt
            },
            candidate: {
                id: candidate._id,
                name: `${candidate.userId.firstName} ${candidate.userId.lastName}`,
                position
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check voting status for an election
// @route   GET /api/vote/status/:electionId
// @access  Private
const getVoteStatus = async (req, res) => {
    const { electionId } = req.params;
    const voterId = req.user._id;

    try {
        const votes = await Vote.find({ electionId, voterId })
            .populate('candidateId', 'position userId')
            .populate({
                path: 'candidateId',
                populate: {
                    path: 'userId',
                    select: 'firstName lastName studentId'
                }
            })
            .sort({ createdAt: 1 });

        if (votes.length > 0) {
            const formattedVotes = votes.map(vote => ({
                candidateId: vote.candidateId?._id,
                candidateName: vote.candidateId?.userId ? `${vote.candidateId.userId.firstName} ${vote.candidateId.userId.lastName}` : 'Unknown Candidate',
                position: vote.candidateId?.position,
                timestamp: vote.createdAt
            }));

            res.json({
                hasVoted: true,
                votes: formattedVotes,
                votedPositions: formattedVotes.map(v => v.position)
            });
        } else {
            res.json({ hasVoted: false, votes: [], votedPositions: [] });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get election results (winners and vote counts)
// @route   GET /api/elections/results/:electionId
// @access  Private (All authenticated users)
const getElectionResults = async (req, res) => {
    const { electionId } = req.params;

    try {
        // 1. Verify election exists
        const election = await Election.findById(electionId);
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }

        // 2. Check if election is completed
        if (election.isOpen) {
            return res.status(400).json({ message: 'Election is still ongoing. Results will be available after completion.' });
        }

        // 3. Get all candidates with vote counts
        const candidates = await Candidate.find({ electionId })
            .populate('userId', 'firstName lastName profilePicture')
            .sort({ position: 1, voteCount: -1 });

        // 4. Calculate total votes
        const totalVotes = await Vote.countDocuments({ electionId });

        // 5. Group by position and find winner for each
        const positions = {};
        candidates.forEach(candidate => {
            if (!positions[candidate.position]) {
                positions[candidate.position] = [];
            }
            positions[candidate.position].push(candidate);
        });

        const winners = {};
        Object.keys(positions).forEach(position => {
            const positionCandidates = positions[position];
            if (positionCandidates.length > 0) {
                const winner = positionCandidates[0];
                winners[position] = {
                    _id: winner._id,
                    name: `${winner.userId.firstName} ${winner.userId.lastName}`,
                    photo: winner.photoUrl,
                    voteCount: winner.voteCount
                };
            }
        });

        res.json({
            election: {
                id: election._id,
                title: election.title,
                description: election.description
            },
            totalVotes,
            winners
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getActiveElections,
    getCandidatesByElection,
    submitVote,
    getVoteStatus,
    getElectionResults
};
