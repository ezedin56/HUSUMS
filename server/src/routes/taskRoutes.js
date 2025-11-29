const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getMyTasks, createTask, updateTask } = require('../controllers/taskController');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `report-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10000000 } // 10MB limit
});

router.get('/my-tasks', protect, getMyTasks);
router.post('/', protect, authorize('dept_head', 'president'), createTask);
router.put('/:id', protect, upload.single('report'), updateTask);

module.exports = router;
