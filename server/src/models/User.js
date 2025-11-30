const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['member', 'dept_head', 'secretary', 'president', 'vp', 'publicvote_admin'],
        default: 'member'
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    profilePicture: {
        type: String,
        default: null
    },
    department: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: ''
    },
    isProfileComplete: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: true
    },
    academicYear: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for avatar (alias for profilePicture)
userSchema.virtual('avatar').get(function () {
    return this.profilePicture;
});

userSchema.virtual('avatar').set(function (value) {
    this.profilePicture = value;
});

// Virtual for year (alias for academicYear)
userSchema.virtual('year').get(function () {
    return this.academicYear;
});

userSchema.virtual('year').set(function (value) {
    this.academicYear = value;
});

module.exports = mongoose.model('User', userSchema);
