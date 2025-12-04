const { AttendanceSession, AttendanceSchedule, User } = require('../models');

const autoCreateSession = async () => {
    try {
        const now = new Date();
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const currentDay = days[now.getDay()];
        const today = new Date(now.setHours(0, 0, 0, 0));

        // 1. Check if a session already exists for today
        const existingSession = await AttendanceSession.findOne({
            date: today
        });

        if (existingSession) {
            console.log('Session already exists for today:', existingSession.title);
            return;
        }

        // 2. Get active schedule
        const schedule = await AttendanceSchedule.findOne({ isActive: true });

        if (!schedule) {
            console.log('No active attendance schedule found.');
            return;
        }

        // 3. Check if today is a scheduled day
        if (!schedule.days.includes(currentDay)) {
            console.log(`Today (${currentDay}) is not a scheduled attendance day.`);
            return;
        }

        // 4. Create new session
        const newSession = await AttendanceSession.create({
            title: `Attendance - ${new Date().toLocaleDateString()}`,
            scheduledDay: currentDay,
            startTime: schedule.defaultStartTime,
            endTime: schedule.defaultEndTime,
            date: today,
            status: 'active', // Or 'scheduled' if we want to wait for start time, but 'active' simplifies logic
            createdBy: schedule.createdBy,
            totalMembers: await User.countDocuments({ role: 'member' })
        });

        console.log(`Created new attendance session: ${newSession.title}`);

    } catch (error) {
        console.error('Error in auto-create session job:', error);
    }
};

// Run daily at 12:01 AM
const startAutoCreateJob = () => {
    // Run immediately on startup to catch missed sessions
    autoCreateSession();

    // Calculate time until next run (next midnight)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 1, 0, 0);
    const timeUntilMidnight = tomorrow - now;

    // Schedule first run
    setTimeout(() => {
        autoCreateSession();
        // Then run every 24 hours
        setInterval(autoCreateSession, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);

    console.log('Auto-create session job started');
};

module.exports = startAutoCreateJob;
