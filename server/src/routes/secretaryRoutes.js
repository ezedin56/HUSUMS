const express = require('express');
const router = express.Router();
const {
    getAllMembers,
    getMemberProfile,
    getMemberRecords
} = require('../controllers/secretaryController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected and restricted to Secretary/President/VP
// router.use(protect); // Removed as per instruction
// router.use(authorize('secretary', 'president', 'vp')); // Removed as per instruction

router.get('/members', protect, authorize('secretary', 'president', 'vp'), getAllMembers);
router.get('/members/:id', protect, authorize('secretary', 'president', 'vp'), getMemberProfile);
router.get('/records', protect, authorize('secretary'), getMemberRecords); // Added this route

module.exports = router;
