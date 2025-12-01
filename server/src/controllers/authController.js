const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key_change_me', {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { studentId, password } = req.body;

    try {
        console.log('Login attempt:', { studentId, password });
        const user = await User.findOne({ studentId });
        console.log('User found:', user ? user.studentId : 'No user');

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            console.log('Password match:', isMatch);
            if (isMatch) {
                res.json({
                    _id: user._id,
                    studentId: user.studentId,
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profilePicture: user.profilePicture,
                    isProfileComplete: user.isProfileComplete,
                    token: generateToken(user._id),
                });
                return;
            }
        }

        res.status(401).json({
            message: 'Invalid student ID or password',
            debug: {
                receivedStudentId: studentId,
                receivedPassword: password,
                userFound: !!user,
                storedHash: user ? user.password : null
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register a new user (Admin only)
// @route   POST /api/auth/register
// @access  Private/Admin
const registerUser = async (req, res) => {
    const { studentId, role, firstName, lastName } = req.body;

    try {
        // Only check for duplicate studentId, not email
        const userExists = await User.findOne({ studentId });

        if (userExists) {
            return res.status(400).json({ message: 'Student ID already exists' });
        }

        // Generate a temporary password (e.g., studentId + 123) if not provided
        const passwordToHash = req.body.password || studentId + '123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passwordToHash, salt);

        const user = new User({
            studentId,
            password: hashedPassword,
            role: role || 'member',
            firstName,
            lastName
        });
        await user.save();

        if (user) {
            res.status(201).json({
                _id: user._id,
                studentId: user.studentId,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                tempPassword: req.body.password ? 'Set by Secretary' : passwordToHash, // Return temp password to admin to share
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Student ID already exists' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile picture
// @route   PUT /api/auth/profile-picture
// @access  Private
const updateProfilePicture = async (req, res) => {
    try {
        const userId = req.user._id;
        const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

        if (!profilePicture) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.profilePicture = profilePicture;
        await user.save();

        res.json({
            message: 'Profile picture updated successfully',
            profilePicture: user.profilePicture
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { loginUser, registerUser, updateProfilePicture };
