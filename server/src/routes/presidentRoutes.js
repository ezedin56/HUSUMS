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
    getVoterAnalytics,
    announceResults,
    deleteElection,
    deleteCandidate,
    updateCandidate
} = require('../controllers/presidentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.memoryStorage();

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

// Election routes with publicvote_admin access
router.post('/elections', protect, authorize('president', 'publicvote_admin'), createElection);
router.get('/elections/live', protect, authorize('president', 'vp', 'publicvote_admin'), getLiveElectionResults);
router.post('/elections/:id/candidates', protect, authorize('president', 'publicvote_admin'), upload.single('photo'), addCandidate);
router.get('/elections', protect, authorize('president', 'vp', 'member', 'secretary', 'publicvote_admin'), getElections);
router.patch('/elections/:id/open', protect, authorize('president', 'publicvote_admin'), openElection);
router.patch('/elections/:id/close', protect, authorize('president', 'publicvote_admin'), closeElection);
router.get('/results/:electionId', protect, authorize('president', 'vp', 'publicvote_admin'), getLiveResults);
router.get('/winner/:electionId', protect, authorize('president', 'vp', 'publicvote_admin'), getWinner);
router.get('/analytics/:electionId', protect, authorize('president', 'vp', 'publicvote_admin'), getVoterAnalytics);
router.patch('/elections/:id/announce', protect, authorize('president', 'publicvote_admin'), announceResults);
router.delete('/elections/:id', protect, authorize('president', 'publicvote_admin'), deleteElection);
router.delete('/candidates/:id', protect, authorize('president', 'publicvote_admin'), deleteCandidate);
router.put('/candidates/:id', protect, authorize('president', 'publicvote_admin'), upload.single('photo'), updateCandidate);

// Member Management Routes
router.get('/members', protect, authorize('president', 'vp', 'publicvote_admin'), getAllMembers);
router.get('/members/warnings', protect, authorize('president', 'vp'), getMembersWithWarnings);
router.delete('/members/:id', protect, authorize('president'), deleteMember);
router.put('/members/:id/status', protect, authorize('president', 'vp'), updateMemberStatus);
router.get('/analytics/members', protect, authorize('president', 'vp'), getMemberAnalytics);

// Registration Control Routes
router.get('/registration/status', protect, authorize('president', 'vp'), getRegistrationStatus);
router.put('/registration/status', protect, authorize('president'), updateRegistrationStatus);

// Analytics Routes
router.get('/analytics/system', protect, authorize('president', 'vp', 'publicvote_admin'), getSystemAnalytics);

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
