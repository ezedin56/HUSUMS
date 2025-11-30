const express = require('express');
const router = express.Router();
const {
    getActiveElections,
    verifyStudent,
    submitPublicVote
} = require('../controllers/publicVoteController');

// Public routes - no authentication required
router.get('/elections/active', getActiveElections);
router.post('/verify-student', verifyStudent);
router.post('/vote', submitPublicVote);

module.exports = router;
