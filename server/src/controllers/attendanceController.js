const { Attendance, User } = require('../models');
// const { Op } = require('sequelize'); // Removed Sequelize

// @desc    Check in for attendance
// @route   POST /api/attendance/check-in
// @access  Private (Member)
const checkIn = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const currentHour = now.getHours();

        // R5.1: Digital Attendance - Time Window Check (6:00 AM - 9:00 AM)
        if (currentHour < 6 || currentHour >= 9) {
            return res.status(400).json({ message: 'Check-in is only allowed between 6:00 AM and 9:00 AM.' });
        }

        // Check if already checked in
        const existingAttendance = await Attendance.findOne({
            userId: req.user._id,
            date: today
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Already checked in today' });
        }

        const attendance = await Attendance.create({
            userId: req.user._id,
            date: today,
            checkInTime: now.toLocaleTimeString('en-US', { hour12: false }),
            status: 'present'
        });

        res.status(201).json({ message: 'Check-in successful', attendance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my attendance
// @route   GET /api/attendance/my
// @access  Private (Member)
const getMyAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ userId: req.user._id })
            .sort({ date: -1 });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all attendance (Secretary/Admin)
// @route   GET /api/attendance
// @access  Private (Secretary/President/VP)
const getAllAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find()
            .populate('userId', 'studentId firstName lastName')
            .sort({ date: -1 });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get attendance warnings (3 consecutive absences)
// @route   GET /api/attendance/warnings
// @access  Private (Secretary/President/VP)
const getAttendanceWarnings = async (req, res) => {
    try {
        // R5.2: Automated Warnings - Identify members with 3 consecutive absences
        // This is a simplified logic. In a real app, we'd check against a calendar of required days.
        // Here, we'll look for users who haven't checked in for the last 3 days.

        const users = await User.find({ role: 'member' });
        const warnings = [];

        // Get last 3 days
        const dates = [];
        for (let i = 1; i <= 3; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(d.toISOString().split('T')[0]);
        }

        for (const user of users) {
            const attendanceCount = await Attendance.countDocuments({
                userId: user._id,
                date: { $in: dates }
            });

            if (attendanceCount === 0) {
                warnings.push({
                    userId: user._id,
                    name: `${user.firstName} ${user.lastName}`,
                    studentId: user.studentId,
                    message: 'Absent for the last 3 days'
                });
            }
        }

        res.json(warnings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    checkIn,
    getMyAttendance,
    getAllAttendance,
    getAttendanceWarnings
};
