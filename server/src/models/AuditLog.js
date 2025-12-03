const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: [
            'ELECTION_CREATED',
            'ELECTION_DELETED',
            'ELECTION_OPENED',
            'ELECTION_CLOSED',
            'CANDIDATE_ADDED',
            'CANDIDATE_UPDATED',
            'CANDIDATE_DELETED',
            'VOTE_CAST',
            'RESULTS_ANNOUNCED',
            'RESULTS_HIDDEN',
            'USER_LOGIN',
            'USER_LOGOUT',
            'OTHER'
        ]
    },
    targetType: {
        type: String,
        enum: ['Election', 'Candidate', 'Vote', 'User', 'Other']
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    }
}, {
    timestamps: true
});

// Indexes for faster queries
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ targetType: 1, targetId: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
