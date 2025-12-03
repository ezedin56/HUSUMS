const { AttendanceSession, Attendance, User } = require('../models');

const autoCloseAttendance = async () => {
    try {
        const now = new Date();
        const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
        const today = new Date(now.setHours(0, 0, 0, 0));

        // Find active sessions that should be closed
        // We check sessions that are active AND (date is before today OR (date is today AND endTime < currentTime))
        const sessionsToClose = await AttendanceSession.find({
            status: 'active',
            $or: [
                { date: { $lt: today } },
                {
                    date: today,
                    endTime: { $lt: currentTime }
                }
            ]
        });

        if (sessionsToClose.length === 0) return;

        console.log(`Found ${sessionsToClose.length} sessions to auto-close`);

        for (const session of sessionsToClose) {
            // Mark all unmarked members as absent
            const members = await User.find({ role: 'member' });
            const attendanceRecords = await Attendance.find({ sessionId: session._id });
            const markedUserIds = attendanceRecords.map(a => a.userId.toString());

            const unmarkedMembers = members.filter(m => !markedUserIds.includes(m._id.toString()));

            // Create absent records
            const absentRecords = unmarkedMembers.map(member => ({
                sessionId: session._id,
                userId: member._id,
                date: session.date,
                status: 'absent',
                markedBy: session.createdBy // Or a system user ID if available
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
            console.log(`Auto-closed session: ${session.title} (${session._id})`);
        }
    } catch (error) {
        console.error('Error in auto-close job:', error);
    }
};

// Run every 5 minutes
const startAutoCloseJob = () => {
    // Run immediately on startup
    autoCloseAttendance();

    // Then run every 5 minutes
    setInterval(autoCloseAttendance, 5 * 60 * 1000);
    console.log('Auto-close attendance job started');
};

module.exports = startAutoCloseJob;
