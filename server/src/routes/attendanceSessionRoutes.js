const express = require('express');
const router = express.Router();
const {
    createSession,
    getSessions,
    getActiveSession,
    closeSession,
    deleteSession,
    markAttendance,
    getSessionRecords
} = require('../controllers/attendanceSessionController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected and restricted to secretary
router.use(protect);
router.use(authorize('secretary'));

router.post('/', createSession);
router.get('/', getSessions);
router.get('/active', getActiveSession);
router.patch('/:id/close', closeSession);
router.delete('/:id', deleteSession);
router.post('/:id/mark', markAttendance);
router.get('/:id/records', getSessionRecords);

module.exports = router;
