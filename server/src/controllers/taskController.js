const { Task, User } = require('../models');

// @desc    Get my tasks (Member)
// @route   GET /api/tasks/my-tasks
// @access  Private
const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id })
            .populate('assigner', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a task (Dept Head)
// @route   POST /api/tasks
// @access  Private (Dept Head)
const createTask = async (req, res) => {
    const { title, description, assignedTo, dueDate } = req.body;

    try {
        const task = await Task.create({
            title,
            description,
            assignedTo,
            assignedBy: req.user._id,
            dueDate
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update task status/report (Member)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    try {
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user is authorized (assignee or assigner)
        // Check if user is authorized (assignee or assigner)
        if (task.assignedTo.toString() !== req.user.id && task.assignedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (status) task.status = status;

        // Handle file upload for report
        if (req.file) {
            task.reportUrl = `/uploads/${req.file.filename}`;
            task.status = 'completed'; // Auto-complete on report upload
        }

        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMyTasks,
    createTask,
    updateTask
};
