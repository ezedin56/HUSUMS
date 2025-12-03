const { AttendanceSchedule } = require('../models');

// @desc    Create or update attendance schedule
// @route   POST /api/attendance/schedule
// @access  Private (Secretary)
const createOrUpdateSchedule = async (req, res) => {
    try {
        const { days, defaultStartTime, defaultEndTime } = req.body;

        // Validate
        if (!days || days.length === 0) {
            return res.status(400).json({ message: 'Please select at least one day' });
        }

        if (days.length > 3) {
            return res.status(400).json({ message: 'Maximum 3 days allowed' });
        }

        if (!defaultStartTime || !defaultEndTime) {
            return res.status(400).json({ message: 'Start and end times are required' });
        }

        // Deactivate existing schedule
        await AttendanceSchedule.updateMany({}, { isActive: false });

        // Create new schedule
        const schedule = await AttendanceSchedule.create({
            days,
            defaultStartTime,
            defaultEndTime,
            isActive: true,
            createdBy: req.user._id
        });

        res.status(201).json(schedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get active schedule
// @route   GET /api/attendance/schedule
// @access  Private (Secretary)
const getActiveSchedule = async (req, res) => {
    try {
        const schedule = await AttendanceSchedule.findOne({ isActive: true })
            .populate('createdBy', 'firstName lastName');

        if (!schedule) {
            return res.status(404).json({ message: 'No active schedule found' });
        }

        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete schedule
// @route   DELETE /api/attendance/schedule/:id
// @access  Private (Secretary)
const deleteSchedule = async (req, res) => {
    try {
        const schedule = await AttendanceSchedule.findById(req.params.id);

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        await schedule.deleteOne();

        res.json({ message: 'Schedule deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrUpdateSchedule,
    getActiveSchedule,
    deleteSchedule
};
