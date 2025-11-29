// Import all Mongoose models
const User = require('./User');
const Election = require('./Election');
const Candidate = require('./Candidate');
const Vote = require('./Vote');
const Attendance = require('./Attendance');
const Department = require('./Department');
const Message = require('./Message');
const Event = require('./Event');
const BroadcastTemplate = require('./BroadcastTemplate');
const Task = require('./Task');
const RSVP = require('./RSVP');
const Resource = require('./Resource');
const Booking = require('./Booking');
const AuditLog = require('./AuditLog');
const Archive = require('./Archive');
const ProblemReport = require('./ProblemReport');

module.exports = {
    User,
    Election,
    Candidate,
    Vote,
    Attendance,
    Department,
    Message,
    Event,
    BroadcastTemplate,
    Task,
    RSVP,
    Resource,
    Booking,
    AuditLog,
    Archive,
    ProblemReport
};
