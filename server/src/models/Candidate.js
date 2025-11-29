const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    electionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Election',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    position: {
        type: String,
        required: true
    },
    manifesto: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    photo: {
        type: String,
        required: false,
        default: ''
    },
    voteCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Candidate', candidateSchema);
