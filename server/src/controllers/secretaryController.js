const { User, Department, Attendance } = require('../models');

// @desc    Get all members
// @route   GET /api/secretary/members
// @access  Private (Secretary/President/VP)
const getAllMembers = async (req, res) => {
    try {
        const members = await User.find()
            .select('-password');
        // Note: Department is currently a string in User model, so no populate needed if we just want the name.
        // If we need Department details, we'd need to refactor User to use ObjectId for department.
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get member profile by ID
// @route   GET /api/secretary/members/:id
// @access  Private (Secretary/President/VP)
const getMemberProfile = async (req, res) => {
    const { id } = req.params;

    try {
        const member = await User.findById(id)
            .select('-password');

        if (member) {
            res.json(member);
        } else {
            res.status(404).json({ message: 'Member not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get comprehensive member records (R3.2)
// @route   GET /api/secretary/records
// @access  Private (Secretary)
const getMemberRecords = async (req, res) => {
    try {
        // Fetch all members with their department and attendance stats
        const members = await User.find({
            role: { $in: ['member', 'dept_head', 'secretary', 'president', 'vp'] }
        })
            .select('-password');

        // In a real app, we might aggregate attendance here or fetch separately.
        // For now, returning the master list of members is sufficient for "Record Keeping".

        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllMembers,
    getMemberProfile,
    getMemberRecords
};
