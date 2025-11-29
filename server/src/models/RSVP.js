const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['attending', 'maybe', 'not_attending'],
        default: 'attending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('RSVP', rsvpSchema);
