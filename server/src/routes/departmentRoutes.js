const express = require('express');
const router = express.Router();
const {
    selectDepartment,
    getDepartmentMessages,
    replyToMessage,
    uploadActionPlan,
    createSchedule,
    getDepartments
} = require('../controllers/departmentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getDepartments);
router.post('/select', protect, authorize('member'), selectDepartment);
router.get('/messages', protect, authorize('dept_head'), getDepartmentMessages);
router.post('/messages/:id/reply', protect, authorize('dept_head'), replyToMessage);
router.post('/action-plan', protect, authorize('dept_head'), upload.single('file'), uploadActionPlan);
router.post('/schedule', protect, authorize('dept_head'), createSchedule);

module.exports = router;
