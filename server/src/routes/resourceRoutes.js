const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getResources, createBooking, getMyBookings, seedResources } = require('../controllers/resourceController');

router.get('/', protect, getResources);
router.post('/book', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.post('/seed', seedResources); // Dev only

module.exports = router;
