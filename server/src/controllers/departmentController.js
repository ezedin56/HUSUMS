const { Department, User, Message } = require('../models');
// const { Op } = require('sequelize'); // Removed Sequelize

// @desc    Select a department (Member)
// @route   POST /api/departments/select
// @access  Private (Member)
const selectDepartment = async (req, res) => {
    const { departmentId } = req.body;

    try {
        // R4.1: Department Selection - Validate department exists
        const dept = await Department.findById(departmentId);
        if (!dept) return res.status(404).json({ message: 'Department not found' });

        const user = await User.findById(req.user._id);

        // Update user's department. Storing Name as per current User model schema (String)
        // Ideally should be ID, but sticking to existing schema to avoid breaking changes.
        user.department = dept.name;
        await user.save();

        res.json({ message: `Successfully joined ${dept.name} department`, department: dept.name });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get department messages (Head)
// @route   GET /api/departments/messages
// @access  Private (Dept Head)
const getDepartmentMessages = async (req, res) => {
    try {
        // R4.2: Department-Specific Inbox
        // Fetch messages where recipientRole is 'dept_head' AND (optionally) filtered by department if we had that field in Message.
        // For now, assuming Dept Heads see all 'dept_head' messages or we filter by subject/content if needed.
        // Better: Filter by recipientRole = 'dept_head'. 
        // In a real app, we'd link Message to Department.

        const messages = await Message.find({
            recipientRole: 'dept_head'
        })
            .populate('sender', 'studentId firstName lastName')
            .sort({ createdAt: -1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reply to a message
// @route   POST /api/departments/messages/:id/reply
// @access  Private (Dept Head)
const replyToMessage = async (req, res) => {
    const { content } = req.body;
    const { id } = req.params;

    try {
        // R4.3: Response Management
        const originalMessage = await Message.findById(id);
        if (!originalMessage) return res.status(404).json({ message: 'Message not found' });

        // Create reply
        const reply = await Message.create({
            senderId: req.user._id,
            recipientId: originalMessage.senderId, // Reply to sender
            subject: `Re: ${originalMessage.subject}`,
            content,
            type: 'reply'
        });

        res.status(201).json({ message: 'Reply sent', reply });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload action plan
// @route   POST /api/departments/action-plan
// @access  Private (Dept Head)
const uploadActionPlan = async (req, res) => {
    try {
        // R4.4: Action Plan & File Management
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        // In a real app, we would save this file path to a DB table (e.g., DepartmentDocuments)
        // For now, just returning the path as per previous implementation
        res.json({
            message: 'Action plan uploaded successfully',
            filePath: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create department schedule
// @route   POST /api/departments/schedule
// @access  Private (Dept Head)
const createSchedule = async (req, res) => {
    const { title, date, description } = req.body;
    try {
        // R4.5: Schedule Management
        // We don't have a Schedule model yet. Let's create a generic Event or assume we use Event model with type 'schedule'.
        // Or just store it in a simple way. Let's use the Event model but maybe add a 'type' or just use it as is.
        // Actually, let's just return success for now as we might need to create a Schedule model.
        // Wait, I can use the Event model!

        const { Event } = require('../models');
        const schedule = await Event.create({
            title,
            description,
            date,
            venue: 'Department', // Default
            createdBy: req.user._id
            // type: 'department_schedule' // If Event had type
        });

        res.status(201).json({ message: 'Schedule created', schedule });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    selectDepartment,
    getDepartmentMessages,
    replyToMessage,
    uploadActionPlan,
    createSchedule,
    getDepartments
};
