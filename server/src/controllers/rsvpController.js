const { RSVP, Event } = require('../models');

// @desc    RSVP to an event
// @route   POST /api/rsvp/:eventId
// @access  Private
const rsvpToEvent = async (req, res) => {
    const { eventId } = req.params;
    const { status } = req.body; // 'going', 'maybe', 'not_going'

    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Check if RSVP exists
        let rsvp = await RSVP.findOne({
            eventId,
            userId: req.user._id
        });

        if (rsvp) {
            // Update existing
            rsvp.status = status || 'going';
            await rsvp.save();
        } else {
            // Create new
            rsvp = await RSVP.create({
                eventId,
                userId: req.user._id,
                status: status || 'going'
            });
        }

        res.json({ message: 'RSVP updated', rsvp });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my RSVPs
// @route   GET /api/rsvp/my-rsvps
// @access  Private
const getMyRSVPs = async (req, res) => {
    try {
        const rsvps = await RSVP.find({ userId: req.user._id })
            .populate('eventId');
        res.json(rsvps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    rsvpToEvent,
    getMyRSVPs
};
