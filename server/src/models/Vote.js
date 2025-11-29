const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    electionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Election',
        required: true
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    },
    position: {
        type: String,
        required: true
    },
    voterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Ensure a user can only vote once per position within an election
voteSchema.index({ electionId: 1, voterId: 1, position: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
