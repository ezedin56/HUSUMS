const mongoose = require('mongoose');

const attendanceSessionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    scheduledDay: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        required: true
    },
    startTime: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    },
    endTime: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'active', 'closed'],
        default: 'scheduled'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    closedAt: {
        type: Date
    },
    totalMembers: {
        type: Number,
        default: 0
    },
    presentCount: {
        type: Number,
        default: 0
    },
    absentCount: {
        type: Number,
        default: 0
    },
    lateCount: {
        type: Number,
        default: 0
    },
    excusedCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for faster queries
attendanceSessionSchema.index({ date: -1, status: 1 });
attendanceSessionSchema.index({ createdBy: 1 });

module.exports = mongoose.model('AttendanceSession', attendanceSessionSchema);
