const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { submitReport, getMyReports, getMyMessages, sendMessage } = require('../controllers/communicationController');

router.post('/report', protect, submitReport);
router.get('/my-reports', protect, getMyReports);
router.get('/inbox', protect, getMyMessages);
router.post('/message', protect, sendMessage);

module.exports = router;
