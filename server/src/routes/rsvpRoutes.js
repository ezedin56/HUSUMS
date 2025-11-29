const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { rsvpToEvent, getMyRSVPs } = require('../controllers/rsvpController');

router.post('/:eventId', protect, rsvpToEvent);
router.get('/my-rsvps', protect, getMyRSVPs);

module.exports = router;
