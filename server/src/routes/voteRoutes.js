const express = require('express');
const router = express.Router();
const {
    getActiveElections,
    getCandidatesByElection,
    submitVote,
    getVoteStatus,
    getElectionResults
} = require('../controllers/voteController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.get('/elections/active', protect, getActiveElections);
router.get('/elections/results/:electionId', protect, getElectionResults);
router.get('/candidates/:electionId', protect, getCandidatesByElection);
router.post('/vote', protect, submitVote);
router.get('/vote/status/:electionId', protect, getVoteStatus);

module.exports = router;
