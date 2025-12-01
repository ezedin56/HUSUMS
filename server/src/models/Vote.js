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
        required: false // Made optional for public voting
    },
    studentId: {
        type: String,
        required: true // Required for both authenticated and public voting
    },
    voterName: {
        type: String,
        required: false // Store full name for public votes
    },
    ipAddress: {
        type: String,
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});


// Ensure a student can only vote once per position per election
voteSchema.index({ electionId: 1, studentId: 1, position: 1 }, { unique: true });


module.exports = mongoose.model('Vote', voteSchema);
