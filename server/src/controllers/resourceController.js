const { Resource, Booking } = require('../models');

// @desc    Get all resources
// @route   GET /api/resources
// @access  Private
const getResources = async (req, res) => {
    try {
        const resources = await Resource.find();
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a booking
// @route   POST /api/resources/book
// @access  Private
const createBooking = async (req, res) => {
    const { resourceId, startTime, endTime, purpose } = req.body;

    try {
        // Basic conflict check
        const conflict = await Booking.findOne({
            resourceId,
            status: 'approved',
            // Check if overlap
            // (StartA <= EndB) and (EndA >= StartB)
            // Here we just check if new start is between existing start/end or new end is between existing start/end
            // For simplicity, let's just create it as pending and let admin approve/reject based on conflicts
        });

        const booking = await Booking.create({
            resourceId,
            userId: req.user._id,
            startTime,
            endTime,
            purpose,
            status: 'pending' // Default to pending
        });

        res.status(201).json({ message: 'Booking request submitted', booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my bookings
// @route   GET /api/resources/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('resourceId')
            .sort({ startTime: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Seed resources (Temporary for dev)
// @route   POST /api/resources/seed
// @access  Public
const seedResources = async (req, res) => {
    try {
        await Resource.insertMany([
            { name: 'Conference Room A', type: 'room', description: 'Main conference hall, capacity 50' },
            { name: 'Meeting Room B', type: 'room', description: 'Small meeting room, capacity 10' },
            { name: 'Projector 1', type: 'equipment', description: 'Portable projector' },
            { name: 'Sound System', type: 'equipment', description: 'Speakers and microphone' }
        ]);
        res.json({ message: 'Resources seeded' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getResources,
    createBooking,
    getMyBookings,
    seedResources
};
