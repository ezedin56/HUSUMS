const express = require('express');
const router = express.Router();
const {
    sendBroadcast,
    createEvent,
    getEvents,
    createElection,
    addCandidate,
    getElections,
    getAllMembers,
    updateMemberStatus,
    getMemberAnalytics,
    getBroadcastTemplates,
    createBroadcastTemplate,
    updateEventStatus,
    getLiveElectionResults,
    getSystemAnalytics,
    getDepartmentOverview,
    getDepartmentTasks,
    getPresidentInbox,
    updateProblemStatus,
    getAuditLogs,
    updateUserRole,
    getArchives,
    createArchive,
    deleteMember,
    getMembersWithWarnings,
    getRegistrationStatus,
    updateRegistrationStatus,
    openElection,
    closeElection,
    getLiveResults,
    getWinner,
    getVoterAnalytics
} = require('../controllers/presidentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `candidate-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
});

router.post('/broadcast', protect, authorize('president', 'vp'), sendBroadcast);
router.get('/broadcast/templates', protect, authorize('president', 'vp'), getBroadcastTemplates);
router.post('/broadcast/templates', protect, authorize('president', 'vp'), createBroadcastTemplate);

router.post('/events', protect, authorize('president', 'vp'), createEvent);
router.get('/events', protect, authorize('president', 'vp', 'member', 'secretary'), getEvents);
router.put('/events/:id/status', protect, authorize('president', 'vp'), updateEventStatus);

router.post('/elections', protect, authorize('president', 'vp'), createElection);
router.get('/elections/live', protect, authorize('president', 'vp'), getLiveElectionResults);
router.post('/elections/:id/candidates', protect, authorize('president', 'vp'), upload.single('photo'), addCandidate);
router.get('/elections', protect, authorize('president', 'vp', 'member', 'secretary'), getElections);
router.patch('/elections/:id/open', protect, authorize('president', 'vp'), openElection);
router.patch('/elections/:id/close', protect, authorize('president', 'vp'), closeElection);
router.get('/results/:electionId', protect, authorize('president', 'vp'), getLiveResults);
router.get('/winner/:electionId', protect, authorize('president', 'vp'), getWinner);
router.get('/analytics/:electionId', protect, authorize('president', 'vp'), getVoterAnalytics);

// Member Management Routes
router.get('/members', protect, authorize('president', 'vp'), getAllMembers);
router.get('/members/warnings', protect, authorize('president', 'vp'), getMembersWithWarnings);
router.delete('/members/:id', protect, authorize('president'), deleteMember);
router.put('/members/:id/status', protect, authorize('president', 'vp'), updateMemberStatus);
router.get('/analytics/members', protect, authorize('president', 'vp'), getMemberAnalytics);

// Registration Control Routes
router.get('/registration/status', protect, authorize('president', 'vp'), getRegistrationStatus);
router.put('/registration/status', protect, authorize('president'), updateRegistrationStatus);

// Analytics Routes
router.get('/analytics/system', protect, authorize('president', 'vp'), getSystemAnalytics);

// Department Oversight Routes
router.get('/departments', protect, authorize('president', 'vp'), getDepartmentOverview);
router.get('/departments/:id/tasks', protect, authorize('president', 'vp'), getDepartmentTasks);

// Executive Inbox Routes
router.get('/inbox', protect, authorize('president', 'vp'), getPresidentInbox);
router.put('/inbox/:id/status', protect, authorize('president', 'vp'), updateProblemStatus);

// System Administration Routes
router.get('/system/audit-logs', protect, authorize('president'), getAuditLogs);
router.put('/system/users/:id/role', protect, authorize('president'), updateUserRole);

// Digital Archives Routes
router.get('/archives', protect, authorize('president', 'vp'), getArchives);
router.post('/archives', protect, authorize('president', 'vp'), createArchive);

module.exports = router;
