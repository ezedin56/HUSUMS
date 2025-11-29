const express = require('express');
const router = express.Router();
const { checkIn, getMyAttendance, getAllAttendance, getAttendanceWarnings } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/check-in', protect, authorize('member'), checkIn);
router.get('/my', protect, authorize('member'), getMyAttendance);
router.get('/', protect, authorize('secretary', 'president', 'vp'), getAllAttendance);
router.get('/warnings', protect, authorize('secretary', 'president', 'vp'), getAttendanceWarnings);

module.exports = router;
