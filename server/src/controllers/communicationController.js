const { ProblemReport, Message, User } = require('../models');
// const { Op } = require('sequelize'); // Removed Sequelize

// @desc    Submit a problem report
// @route   POST /api/communication/report
// @access  Private
const submitReport = async (req, res) => {
    const { category, subject, description } = req.body;

    try {
        const report = await ProblemReport.create({
            userId: req.user._id,
            category,
            subject,
            description
        });

        res.status(201).json({ message: 'Report submitted successfully', report });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my reports
// @route   GET /api/communication/my-reports
// @access  Private
const getMyReports = async (req, res) => {
    try {
        const reports = await ProblemReport.find({ userId: req.user._id })
            .sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my messages (Inbox)
// @route   GET /api/communication/inbox
// @access  Private
const getMyMessages = async (req, res) => {
    try {
        const messages = await Message.find({ recipientId: req.user._id })
            .populate('sender', 'firstName lastName role')
            .sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send a message (Member to Member/Exec)
// @route   POST /api/communication/message
// @access  Private
const sendMessage = async (req, res) => {
    const { recipientId, subject, content } = req.body;

    try {
        const message = await Message.create({
            senderId: req.user._id,
            recipientId,
            subject,
            content,
            type: 'direct'
        });

        res.status(201).json({ message: 'Message sent', message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    submitReport,
    getMyReports,
    getMyMessages,
    sendMessage
};
