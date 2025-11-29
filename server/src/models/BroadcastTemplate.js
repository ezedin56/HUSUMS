const mongoose = require('mongoose');

const broadcastTemplateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'general'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BroadcastTemplate', broadcastTemplateSchema);
