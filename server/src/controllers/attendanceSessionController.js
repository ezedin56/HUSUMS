const { AttendanceSession, Attendance, User } = require('../models');

// @desc    Create new attendance session
// @route   POST /api/attendance/sessions
// @access  Private (Secretary)
const createSession = async (req, res) => {
    try {
        const { title, scheduledDay, startTime, endTime, date } = req.body;

        // Validate required fields
        if (!title || !scheduledDay || !startTime || !endTime || !date) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if there's already an active session
        const activeSession = await AttendanceSession.findOne({ status: 'active' });
        if (activeSession) {
            return res.status(400).json({ message: 'There is already an active attendance session' });
        }

        // Get total members count
        const totalMembers = await User.countDocuments({ role: 'member' });

        // Create session
        const session = await AttendanceSession.create({
            title,
            scheduledDay,
            startTime,
            endTime,
            date: new Date(date),
            status: 'active',
            createdBy: req.user._id,
            totalMembers
        });

        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all sessions with filters
// @route   GET /api/attendance/sessions
// @access  Private (Secretary)
const getSessions = async (req, res) => {
    try {
        const { status, startDate, endDate, limit = 50 } = req.query;

        const query = {};

        if (status) {
            query.status = status;
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const sessions = await AttendanceSession.find(query)
            .populate('createdBy', 'firstName lastName')
            .sort({ date: -1 })
            .limit(parseInt(limit));

        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get active session
// @route   GET /api/attendance/sessions/active
// @access  Private (Secretary)
const getActiveSession = async (req, res) => {
    try {
        const session = await AttendanceSession.findOne({ status: 'active' })
            .populate('createdBy', 'firstName lastName');

        if (!session) {
            return res.status(404).json({ message: 'No active session found' });
        }

        res.json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Close session
// @route   PATCH /api/attendance/sessions/:id/close
// @access  Private (Secretary)
const closeSession = async (req, res) => {
    try {
        const session = await AttendanceSession.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        if (session.status === 'closed') {
            return res.status(400).json({ message: 'Session is already closed' });
        }

        // Mark all unmarked members as absent
        const members = await User.find({ role: 'member' });
        const attendanceRecords = await Attendance.find({ sessionId: session._id });
        const markedUserIds = attendanceRecords.map(a => a.userId.toString());

        const unmarkedMembers = members.filter(m => !markedUserIds.includes(m._id.toString()));

        // Create absent records for unmarked members
        const absentRecords = unmarkedMembers.map(member => ({
            sessionId: session._id,
            userId: member._id,
            date: session.date,
            status: 'absent',
            markedBy: req.user._id
        }));

        if (absentRecords.length > 0) {
            await Attendance.insertMany(absentRecords);
        }

        // Update session counts
        const finalRecords = await Attendance.find({ sessionId: session._id });
        session.presentCount = finalRecords.filter(r => r.status === 'present').length;
        session.absentCount = finalRecords.filter(r => r.status === 'absent').length;
        session.lateCount = finalRecords.filter(r => r.status === 'late').length;
        session.excusedCount = finalRecords.filter(r => r.status === 'excused').length;
        session.status = 'closed';
        session.closedAt = new Date();

        await session.save();

        res.json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete session
// @route   DELETE /api/attendance/sessions/:id
// @access  Private (Secretary)
const deleteSession = async (req, res) => {
    try {
        const session = await AttendanceSession.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Delete all attendance records for this session
        await Attendance.deleteMany({ sessionId: session._id });

        // Delete session
        await session.deleteOne();

        res.json({ message: 'Session and related records deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark attendance for a session
// @route   POST /api/attendance/sessions/:id/mark
// @access  Private (Secretary)
const markAttendance = async (req, res) => {
    try {
        const { userId, status, notes } = req.body;
        const sessionId = req.params.id;

        const session = await AttendanceSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        if (session.status === 'closed') {
            return res.status(400).json({ message: 'Cannot mark attendance for a closed session' });
        }

        // Check if attendance already exists
        let attendance = await Attendance.findOne({ sessionId, userId });

        if (attendance) {
            // Update existing record
            attendance.status = status;
            attendance.notes = notes || attendance.notes;
            attendance.checkInTime = ['present', 'late'].includes(status)
                ? new Date().toLocaleTimeString('en-US', { hour12: false })
                : null;
            attendance.markedBy = req.user._id;
            await attendance.save();
        } else {
            // Create new record
            attendance = await Attendance.create({
                sessionId,
                userId,
                date: session.date,
                status,
                notes: notes || '',
                checkInTime: ['present', 'late'].includes(status)
                    ? new Date().toLocaleTimeString('en-US', { hour12: false })
                    : null,
                markedBy: req.user._id
            });
        }

        // Update session counts
        const records = await Attendance.find({ sessionId });
        session.presentCount = records.filter(r => r.status === 'present').length;
        session.absentCount = records.filter(r => r.status === 'absent').length;
        session.lateCount = records.filter(r => r.status === 'late').length;
        session.excusedCount = records.filter(r => r.status === 'excused').length;
        await session.save();

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get attendance records for a session
// @route   GET /api/attendance/sessions/:id/records
// @access  Private (Secretary)
const getSessionRecords = async (req, res) => {
    try {
        const records = await Attendance.find({ sessionId: req.params.id })
            .populate('userId', 'firstName lastName studentId department')
            .populate('markedBy', 'firstName lastName')
            .sort({ 'userId.lastName': 1 });

        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSession,
    getSessions,
    getActiveSession,
    closeSession,
    deleteSession,
    markAttendance,
    getSessionRecords
};
