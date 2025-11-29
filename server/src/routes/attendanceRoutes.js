const express = require('express');
const router = express.Router();
const { checkIn, getMyAttendance, getAllAttendance, getAttendanceWarnings, markAttendance, getDailyAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

// router.post('/check-in', protect, authorize('member'), checkIn); // Disabled self check-in
router.get('/my', protect, authorize('member'), getMyAttendance);
router.get('/', protect, authorize('secretary', 'president', 'vp'), getAllAttendance);
router.get('/daily', protect, authorize('secretary'), getDailyAttendance);
router.post('/mark', protect, authorize('secretary'), markAttendance);
router.get('/warnings', protect, authorize('secretary', 'president', 'vp'), getAttendanceWarnings);

module.exports = router;
