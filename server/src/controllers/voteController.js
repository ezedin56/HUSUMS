const { Vote, Election, Candidate, User } = require('../models');

// @desc    Get active elections
// @route   GET /api/elections/active
// @access  Private
const getActiveElections = async (req, res) => {
    try {
        const elections = await Election.find({ isOpen: true })
            .populate('createdBy', 'firstName lastName')
            .sort({ startDate: -1 });

        // Manually fetch candidates for each election
        const electionsWithCandidates = await Promise.all(
            elections.map(async (election) => {
                const candidates = await Candidate.find({ electionId: election._id })
                    .populate('userId', 'firstName lastName');

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
                        User: c.userId ? {
                            firstName: c.userId.firstName,
                            lastName: c.userId.lastName
                        } : { firstName: 'Unknown', lastName: 'User' }
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
            .populate('userId', 'firstName lastName profilePicture')
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
        const existingVote = await Vote.findOne({ electionId, voterId });
        if (existingVote) {
            return res.status(400).json({ message: 'You have already voted in this election' });
        }

        // 3. Verify candidate exists and belongs to this election
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        if (candidate.electionId.toString() !== electionId) {
            return res.status(400).json({ message: 'Candidate does not belong to this election' });
        }

        // 4. Create vote record
        const vote = await Vote.create({
            electionId,
            candidateId,
            voterId,
            ipAddress
        });

        // 5. Increment candidate vote count
        candidate.voteCount += 1;
        await candidate.save();

        res.status(201).json({
            message: 'Vote submitted successfully',
            vote: {
                electionId: vote.electionId,
                candidateId: vote.candidateId,
                timestamp: vote.createdAt
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
        const vote = await Vote.findOne({ electionId, voterId })
            .populate('candidateId', 'position userId')
            .populate({
                path: 'candidateId',
                populate: {
                    path: 'userId',
                    select: 'firstName lastName'
                }
            });

        if (vote) {
            res.json({
                hasVoted: true,
                vote: {
                    candidateId: vote.candidateId._id,
                    candidateName: `${vote.candidateId.userId.firstName} ${vote.candidateId.userId.lastName}`,
                    position: vote.candidateId.position,
                    timestamp: vote.createdAt
                }
            });
        } else {
            res.json({ hasVoted: false });
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
