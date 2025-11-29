const { User, Message } = require('../models');

// @desc    Get union leaders (Public)
// @route   GET /api/public/leaders
// @access  Public
const getLeaders = async (req, res) => {
    try {
        const leaders = await User.find({
            role: { $in: ['president', 'vp', 'secretary', 'dept_head'] }
        })
            .select('firstName lastName role profilePicture bio');
        res.json(leaders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit a problem (Public)
// @route   POST /api/public/problems
// @access  Public
const submitProblem = async (req, res) => {
    const { senderName, senderEmail, subject, content, recipientRole } = req.body;

    try {
        const message = await Message.create({
            senderName,
            senderEmail,
            recipientRole: recipientRole || 'president', // Default to president if not specified
            subject,
            content,
            type: 'problem'
        });

        res.status(201).json({ message: 'Problem submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getLeaders,
    submitProblem
};
