const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');
const User = require('../models/User');
const AllowedVoter = require('../models/AllowedVoter');

// @desc    Get active elections with candidates for public voting
// @route   GET /api/public/elections/active
// @access  Public
const getActiveElections = async (req, res) => {
    try {
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
                        photo: c.photo,
                        slogan: c.slogan || '',
                        platform: c.platform || [],
                        phone: c.phone || '',
                        email: c.email || '',
                        region: c.region || '',
                        zone: c.zone || '',
                        woreda: c.woreda || '',
                        city: c.city || '',
                        background: c.background || '',
                        education: c.education || [],
                        experience: c.experience || [],
                        achievements: c.achievements || []
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
        if (!studentId || !fullName) {
            return res.status(400).json({
                message: 'Please provide both Student ID and Full Name.'
            });
        }

        // STRATEGY: Try all reasonable variations of the ID to find a match
        const cleanId = (id) => id.trim().toUpperCase();
        let searchId = cleanId(studentId);
        let allowedVoter = null;

        // 1. Exact Match
        allowedVoter = await AllowedVoter.findOne({ studentId: searchId });
        if (allowedVoter) console.log(`[VERIFY] Found by exact match: ${searchId}`);

        // 2. Remove Prefix (if input starts with UGPR)
        if (!allowedVoter && searchId.startsWith('UGPR')) {
            // Try removing 'UGPR/' (e.g., UGPR/1234 -> 1234)
            let noPrefixSlash = searchId.replace('UGPR/', '');
            if (noPrefixSlash !== searchId) {
                console.log(`[VERIFY] Trying without 'UGPR/': ${noPrefixSlash}`);
                allowedVoter = await AllowedVoter.findOne({ studentId: noPrefixSlash });
            }

            // Try removing 'UGPR' (e.g., UGPR1234 -> 1234)
            if (!allowedVoter) {
                let noPrefix = searchId.replace('UGPR', '');
                if (noPrefix !== searchId) {
                    console.log(`[VERIFY] Trying without 'UGPR': ${noPrefix}`);
                    allowedVoter = await AllowedVoter.findOne({ studentId: noPrefix });
                }
            }
        }

        // 3. Add Prefix (if input DOES NOT start with UGPR)
        if (!allowedVoter && !searchId.startsWith('UGPR')) {
            // Try adding 'UGPR'
            let withPrefix = `UGPR${searchId}`;
            console.log(`[VERIFY] Trying with 'UGPR' prefix: ${withPrefix}`);
            allowedVoter = await AllowedVoter.findOne({ studentId: withPrefix });

            // Try adding 'UGPR/'
            if (!allowedVoter) {
                withPrefix = `UGPR/${searchId}`;
                console.log(`[VERIFY] Trying with 'UGPR/' prefix: ${withPrefix}`);
                allowedVoter = await AllowedVoter.findOne({ studentId: withPrefix });
            }
        }

        console.log('[VERIFY] AllowedVoter found:', allowedVoter ? `Yes (${allowedVoter.fullName})` : 'No');

        if (!allowedVoter) {
            return res.status(404).json({
                message: 'Student ID not found in the allowed voters list.'
            });
        }

        // Verify the full name matches (case-insensitive)
        const allowedName = allowedVoter.fullName.toLowerCase().trim();
        const providedName = fullName.toLowerCase().trim();

        if (allowedName !== providedName) {
            return res.status(400).json({
                message: 'Full name does not match our records. Please check your name.'
            });
        }

        // Student verified successfully
        console.log('[VERIFY] Success!');
        res.json({
            verified: true,
            message: 'Student verified successfully',
            studentId: allowedVoter.studentId // Return the official ID from DB
        });
    } catch (error) {
        console.error('[VERIFY] Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get vote status for a student
const getVoteStatus = async (req, res) => {
    try {
        const { studentId, fullName } = req.body;

        if (!studentId || !fullName) {
            return res.status(400).json({ message: 'Student ID and Full Name are required' });
        }

        // Reuse the robust logic logic implicitly or assume client sends back the correct ID from verify
        // For robustness, repeat basic check or rely on verifyStudent returning the normalized ID
        // Here we'll do a quick check assuming normalized ID or robust check again

        const cleanId = (id) => id.trim().toUpperCase();
        let searchId = cleanId(studentId);
        let allowedVoter = await AllowedVoter.findOne({ studentId: searchId });

        // Similar fallback logic as verify
        if (!allowedVoter && searchId.startsWith('UGPR')) {
            let temp = searchId.replace('UGPR/', '');
            allowedVoter = await AllowedVoter.findOne({ studentId: temp });
            if (!allowedVoter) {
                temp = searchId.replace('UGPR', '');
                allowedVoter = await AllowedVoter.findOne({ studentId: temp });
            }
            if (allowedVoter) searchId = allowedVoter.studentId;
        }

        if (!allowedVoter) {
            return res.status(404).json({ message: 'Student ID not found in allowed voters list' });
        }

        const votes = await Vote.find({ studentId: searchId })
            .populate('electionId', 'title')
            .populate('candidateId', 'name');

        const votedPositions = votes.map(vote => ({
            position: vote.position,
            electionId: vote.electionId._id,
            electionTitle: vote.electionId.title,
            candidateName: vote.candidateId.name,
            timestamp: vote.timestamp
        }));

        res.json({
            studentId: searchId,
            votedPositions
        });
    } catch (error) {
        console.error('Get vote status error:', error);
        res.status(500).json({ message: 'An error occurred while fetching vote status' });
    }
};

const submitPublicVote = async (req, res) => {
    const { studentId, fullName, votes } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    try {
        if (!votes || !Array.isArray(votes) || votes.length === 0) {
            return res.status(400).json({ message: 'No votes provided' });
        }

        // Verify student exists (Robust check)
        const cleanId = (id) => id.trim().toUpperCase();
        let searchId = cleanId(studentId);
        let allowedVoter = await AllowedVoter.findOne({ studentId: searchId });

        if (!allowedVoter && searchId.startsWith('UGPR')) {
            let temp = searchId.replace('UGPR/', '');
            allowedVoter = await AllowedVoter.findOne({ studentId: temp });
            if (!allowedVoter) {
                temp = searchId.replace('UGPR', '');
                allowedVoter = await AllowedVoter.findOne({ studentId: temp });
            }
            if (allowedVoter) searchId = allowedVoter.studentId;
        }

        if (!allowedVoter) {
            return res.status(404).json({ message: 'Student ID not found in allowed voters list' });
        }

        // Verify full name
        const allowedName = allowedVoter.fullName.toLowerCase().trim();
        if (allowedName !== fullName.toLowerCase().trim()) {
            return res.status(400).json({ message: 'Full name does not match our records' });
        }

        // Validate votes
        const positions = new Set();
        const voteResults = [];
        const candidateUpdates = [];

        for (const vote of votes) {
            if (!vote.electionId || !vote.candidateId) {
                return res.status(400).json({ message: 'Invalid vote structure' });
            }

            const candidate = await Candidate.findById(vote.candidateId);
            if (!candidate) return res.status(404).json({ message: 'Invalid candidate' });

            if (positions.has(candidate.position)) {
                return res.status(400).json({
                    message: `Cannot vote for multiple candidates in the same position: ${candidate.position}`
                });
            }
            positions.add(candidate.position);

            const election = await Election.findById(vote.electionId);
            if (!election || !election.isOpen || election.status !== 'ongoing') {
                return res.status(400).json({ message: 'Election is not open for voting' });
            }

            if (candidate.electionId.toString() !== vote.electionId) {
                return res.status(404).json({ message: 'Candidate not found in this election' });
            }

            const existingVote = await Vote.findOne({
                electionId: vote.electionId,
                studentId: searchId,
                position: candidate.position
            });

            if (existingVote) {
                return res.status(400).json({ message: `You voted for this position` });
            }

            const newVote = await Vote.create({
                electionId: vote.electionId,
                candidateId: vote.candidateId,
                position: candidate.position,
                studentId: searchId,
                voterName: fullName,
                ipAddress,
                timestamp: new Date()
            });

            candidateUpdates.push(vote.candidateId);
            voteResults.push(newVote);
        }

        // Update counts
        await Promise.all(
            candidateUpdates.map(cid =>
                Candidate.findByIdAndUpdate(cid, { $inc: { voteCount: 1 } })
            )
        );

        res.status(201).json({
            message: 'Vote(s) submitted successfully!',
            votesCount: voteResults.length,
            votes: voteResults.map(v => ({ position: v.position, candidateId: v.candidateId }))
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You voted for this position' });
        }
        console.error('Vote submission error:', error);
        res.status(500).json({ message: 'An error occurred while submitting your vote' });
    }
};

module.exports = {
    getActiveElections,
    verifyStudent,
    getVoteStatus,
    submitPublicVote
};
