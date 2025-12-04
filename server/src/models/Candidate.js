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
    },
    // Platform points (array of strings)
    platform: {
        type: [String],
        default: []
    },
    // Contact Information
    phone: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    // Location Information
    region: {
        type: String,
        default: ''
    },
    zone: {
        type: String,
        default: ''
    },
    woreda: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    // Background and qualifications
    background: {
        type: String,
        default: ''
    },
    education: {
        type: [String],
        default: []
    },
    experience: {
        type: [String],
        default: []
    },
    achievements: {
        type: [String],
        default: []
    },
    slogan: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Candidate', candidateSchema);
