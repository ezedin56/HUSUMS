const express = require('express');
const router = express.Router();
const {
    createOrUpdateSchedule,
    getActiveSchedule,
    deleteSchedule
} = require('../controllers/attendanceScheduleController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected and restricted to secretary
router.use(protect);
router.use(authorize('secretary'));

router.post('/', createOrUpdateSchedule);
router.get('/', getActiveSchedule);
router.delete('/:id', deleteSchedule);

module.exports = router;
