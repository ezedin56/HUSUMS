const mongoose = require('mongoose');

const archiveSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed
    },
    archivedAt: {
        type: Date,
        default: Date.now
    },
    archivedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Archive', archiveSchema);
