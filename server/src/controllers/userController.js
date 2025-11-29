const { User } = require('../models');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const {
            firstName,
            middleName,
            lastName,
            bio,
            major,
            academicYear,
            phoneNumber,
            region,
            zone,
            woreda,
            city
        } = req.body;

        // Update fields if provided
        // Update fields if provided (allow empty strings to clear fields)
        if (firstName !== undefined) user.firstName = firstName;
        if (middleName !== undefined) user.middleName = middleName;
        if (lastName !== undefined) user.lastName = lastName;
        if (bio !== undefined) user.bio = bio;
        if (major !== undefined) user.major = major;
        if (academicYear !== undefined) user.academicYear = academicYear;
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
        if (region !== undefined) user.region = region;
        if (zone !== undefined) user.zone = zone;
        if (woreda !== undefined) user.woreda = woreda;
        if (city !== undefined) user.city = city;

        if (city !== undefined) user.city = city;

        // Handle password update
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        // Handle profile picture upload
        if (req.file) {
            user.profilePicture = `/uploads/${req.file.filename}`;
        }

        // Mark profile as complete if key fields are present
        if (user.firstName && user.lastName && user.major && user.academicYear) {
            user.isProfileComplete = true;
        }

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePicture,
                isProfileComplete: user.isProfileComplete
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/users/stats
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        const { User, Event, Election, Vote, Attendance } = require('../models');
        
        // Count members
        const memberCount = await User.countDocuments({ role: 'member' });
        
        // Count events
        const eventCount = await Event.countDocuments();
        
        // Count active elections
        const activeElectionCount = await Election.countDocuments({ status: 'active' });
        
        // Count votes cast by current user (if member)
        let votesCast = 0;
        if (req.user.role === 'member') {
            votesCast = await Vote.countDocuments({ userId: req.user._id });
        }
        
        // Get user's attendance stats (if member)
        let attendanceStats = null;
        if (req.user.role === 'member') {
            const attendanceRecords = await Attendance.find({ userId: req.user._id });
            const totalPresent = attendanceRecords.filter(a => a.status === 'present' || a.status === 'late').length;
            const totalRecords = attendanceRecords.length;
            const attendanceRate = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;
            
            attendanceStats = {
                totalCheckIns: totalPresent,
                attendanceRate
            };
        }
        
        res.json({
            members: memberCount,
            events: eventCount,
            elections: activeElectionCount,
            votescast: votesCast,
            attendance: attendanceStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getDashboardStats
};
