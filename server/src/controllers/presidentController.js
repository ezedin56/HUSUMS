const { Message, Event, Election, Candidate, User, Vote, BroadcastTemplate, AuditLog } = require('../models');

// @desc    Send a broadcast message
// @route   POST /api/president/broadcast
// @access  Private (President/VP)
const sendBroadcast = async (req, res) => {
    const { subject, content, recipientRole, type } = req.body;

    try {
        const message = await Message.create({
            senderId: req.user._id,
            recipientRole: recipientRole || 'all', // 'all', 'member', 'executive', 'student'
            subject,
            content,
            type: type || 'broadcast'
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get broadcast templates
// @route   GET /api/president/broadcast/templates
// @access  Private (President/VP)
const getBroadcastTemplates = async (req, res) => {
    try {
        const templates = await BroadcastTemplate.find();
        res.json(templates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create broadcast template
// @route   POST /api/president/broadcast/templates
// @access  Private (President/VP)
const createBroadcastTemplate = async (req, res) => {
    const { title, subject, content, type } = req.body;
    try {
        const template = await BroadcastTemplate.create({
            title,
            subject,
            content,
            type
        });
        res.status(201).json(template);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an event
// @route   POST /api/president/events
// @access  Private (President/VP)
const createEvent = async (req, res) => {
    const { title, description, date, time, venue } = req.body;

    try {
        const event = await Event.create({
            title,
            description,
            date,
            time,
            venue,
            createdBy: req.user._id
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all events
// @route   GET /api/president/events
// @access  Private (All)
const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an election
// @route   POST /api/president/elections
// @access  Private (President/VP)
const createElection = async (req, res) => {
    const { title, description, positions, startDate, endDate } = req.body;

    try {
        // Determine election type based on user role
        const electionType = req.user.role === 'publicvote_admin' ? 'public' : 'internal';

        const election = await Election.create({
            title,
            description,
            positions,
            startDate,
            endDate,
            status: 'upcoming',
            electionType,
            createdBy: req.user._id
        });

        // Log audit
        await AuditLog.create({
            user: req.user._id,
            action: 'ELECTION_CREATED',
            targetType: 'Election',
            targetId: election._id,
            details: { title, positions: positions.length, electionType },
            ipAddress: req.ip
        });

        res.status(201).json(election);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add candidate to election
// @route   POST /api/president/elections/:id/candidates
// @access  Private (President/VP)
const addCandidate = async (req, res) => {
    const {
        position, userId, manifesto, description,
        platform, phone, email,
        region, zone, woreda, city,
        background, education, experience, achievements, slogan
    } = req.body;
    const { id } = req.params;

    let photo = '';
    if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const mimeType = req.file.mimetype;
        photo = `data:${mimeType};base64,${b64}`;
    }

    try {
        const candidate = await Candidate.create({
            electionId: id,
            position,
            userId,
            manifesto: manifesto || '',
            description: description || '',
            photo,
            platform: platform ? JSON.parse(platform) : [],
            phone: phone || '',
            email: email || '',
            region: region || '',
            zone: zone || '',
            woreda: woreda || '',
            city: city || '',
            background: background || '',
            education: education ? JSON.parse(education) : [],
            experience: experience ? JSON.parse(experience) : [],
            achievements: achievements ? JSON.parse(achievements) : [],
            slogan: slogan || ''
        });

        // Log audit
        const user = await User.findById(userId).select('firstName lastName');
        await AuditLog.create({
            user: req.user._id,
            action: 'CANDIDATE_ADDED',
            targetType: 'Candidate',
            targetId: candidate._id,
            details: {
                candidateName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
                position,
                electionId: id
            },
            ipAddress: req.ip
        });

        res.status(201).json(candidate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update candidate details
// @route   PUT /api/president/candidates/:id
// @access  Private (President/VP/Public Admin)
const updateCandidate = async (req, res) => {
    const { id } = req.params;
    const {
        position, manifesto, description,
        platform, phone, email,
        region, zone, woreda, city,
        background, education, experience, achievements, slogan
    } = req.body;
    let photo;
    if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const mimeType = req.file.mimetype;
        photo = `data:${mimeType};base64,${b64}`;
    }

    try {
        const candidate = await Candidate.findById(id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        // Update fields
        if (position) candidate.position = position;
        if (manifesto !== undefined) candidate.manifesto = manifesto;
        if (description !== undefined) candidate.description = description;
        if (photo) candidate.photo = photo;
        if (platform !== undefined) candidate.platform = JSON.parse(platform);
        if (phone !== undefined) candidate.phone = phone;
        if (email !== undefined) candidate.email = email;
        if (region !== undefined) candidate.region = region;
        if (zone !== undefined) candidate.zone = zone;
        if (woreda !== undefined) candidate.woreda = woreda;
        if (city !== undefined) candidate.city = city;
        if (background !== undefined) candidate.background = background;
        if (education !== undefined) candidate.education = JSON.parse(education);
        if (experience !== undefined) candidate.experience = JSON.parse(experience);
        if (achievements !== undefined) candidate.achievements = JSON.parse(achievements);
        if (slogan !== undefined) candidate.slogan = slogan;

        await candidate.save();

        // Log audit
        await AuditLog.create({
            user: req.user._id,
            action: 'CANDIDATE_UPDATED',
            targetType: 'Candidate',
            targetId: candidate._id,
            details: {
                position: candidate.position,
                updates: { position, manifesto: !!manifesto, description: !!description, photo: !!photo }
            },
            ipAddress: req.ip
        });

        res.json(candidate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all elections
// @route   GET /api/president/elections
// @access  Private (President/VP/Member)
const getElections = async (req, res) => {
    try {
        // Determine which elections to show based on user role
        let query = {};

        if (req.user.role === 'publicvote_admin') {
            // Public Admin sees only public elections
            query.electionType = 'public';
        } else {
            // President, VP, Members, Secretary see only internal elections
            query.electionType = 'internal';
        }

        const elections = await Election.find(query)
            .populate('createdBy', 'firstName lastName')
            .sort({ startDate: -1 });

        // Manually fetch candidates for each election
        const electionsWithCandidates = await Promise.all(
            elections.map(async (election) => {
                const candidates = await Candidate.find({ electionId: election._id })
                    .populate('userId', 'firstName lastName');

                return {
                    ...election.toObject(),
                    Candidates: candidates.map(c => ({
                        id: c._id,
                        userId: c.userId ? c.userId._id : null,
                        position: c.position,
                        manifesto: c.manifesto,
                        description: c.description,
                        photoUrl: c.photo,
                        voteCount: c.voteCount,
                        User: c.userId ? {
                            firstName: c.userId.firstName,
                            lastName: c.userId.lastName
                        } : { firstName: 'Unknown', lastName: 'User' }
                    }))
                };
            })
        );

        res.json(electionsWithCandidates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get election results
// @route   GET /api/president/elections/:id/results
// @access  Private (President/VP)
const getElectionResults = async (req, res) => {
    const { id } = req.params;
    try {
        const candidates = await Candidate.find({ electionId: id })
            .populate('userId', 'firstName lastName');

        const results = await Promise.all(candidates.map(async (candidate) => {
            let voteCount = 0;
            try {
                if (Vote) {
                    voteCount = await Vote.countDocuments({ candidateId: candidate._id });
                }
            } catch (e) {
                console.log('Error counting votes', e);
            }

            return {
                candidate: `${candidate.userId.firstName} ${candidate.userId.lastName}`,
                position: candidate.position,
                votes: voteCount
            };
        }));

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cast a vote
// @route   POST /api/president/elections/:id/vote
// @access  Private (Member)
const castVote = async (req, res) => {
    const { id } = req.params;
    const { candidateId } = req.body;
    const voterId = req.user._id;

    try {
        // Check if election exists and is ongoing
        const election = await Election.findById(id);
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }
        if (election.status !== 'ongoing') {
            return res.status(400).json({ message: 'Election is not active' });
        }

        // Check if user has already voted in this election
        const existingVote = await Vote.findOne({
            electionId: id,
            voterId
        });

        if (existingVote) {
            return res.status(400).json({ message: 'You have already voted in this election' });
        }

        // Create vote
        const candidate = await Candidate.findById(candidateId);
        const vote = await Vote.create({
            electionId: id,
            candidateId,
            voterId,
            studentId: req.user.studentId,
            position: candidate ? candidate.position : 'Unknown'
        });

        // Increment candidate vote count (optional, can be calculated dynamically)
        if (candidate) {
            candidate.voteCount += 1;
            await candidate.save();
        }

        res.status(201).json({ message: 'Vote cast successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get audit logs
// @route   GET /api/president/system/audit-logs
// @access  Private (President/VP)
const getAuditLogs = async (req, res) => {
    try {
        const { AuditLog, User } = require('../models');
        const { limit = 50 } = req.query;

        const logs = await AuditLog.find()
            .populate('user', 'firstName lastName studentId')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user role
// @route   PUT /api/president/system/users/:id/role
// @access  Private (President only)
const updateUserRole = async (req, res) => {
    try {
        const { User } = require('../models');
        const { role } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get archives
// @route   GET /api/president/archives
// @access  Private (President/VP)
const getArchives = async (req, res) => {
    try {
        const { Archive, User } = require('../models');
        const { category, year, search } = req.query;
        // const { Op } = require('sequelize'); // Removed Sequelize

        const where = {};
        if (category) where.category = category;
        if (year) where.year = parseInt(year);
        if (search) {
            where.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const archives = await Archive.find(where)
            .populate('archiver', 'firstName lastName')
            .sort({ year: -1, createdAt: -1 });

        res.json(archives);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create archive entry
// @route   POST /api/president/archives
// @access  Private (President/VP)
const createArchive = async (req, res) => {
    try {
        const { Archive } = require('../models');
        const { title, description, category, year, fileUrl, metadata } = req.body;

        const archive = await Archive.create({
            title,
            description,
            category,
            year,
            fileUrl,
            metadata,
            archivedBy: req.user._id
        });

        res.status(201).json(archive);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get president inbox (problem reports)
// @route   GET /api/president/inbox
// @access  Private (President/VP)
const getPresidentInbox = async (req, res) => {
    try {
        const { ProblemReport, User } = require('../models');
        const { category, status } = req.query;

        const where = {};
        if (category) where.category = category;
        if (status) where.status = status;

        const problems = await ProblemReport.find(where)
            .populate('reportedBy', 'firstName lastName studentId')
            .sort({ createdAt: -1 });

        res.json(problems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update problem report status
// @route   PUT /api/president/inbox/:id/status
// @access  Private (President/VP)
const updateProblemStatus = async (req, res) => {
    try {
        const { ProblemReport } = require('../models');
        const { status, resolution } = req.body;

        const problem = await ProblemReport.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ message: 'Problem report not found' });
        }

        problem.status = status;
        if (resolution) problem.resolution = resolution;
        await problem.save();

        res.json(problem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get department overview with metrics
// @route   GET /api/president/departments
// @access  Private (President/VP)
const getDepartmentOverview = async (req, res) => {
    try {
        const { Department, User, Task } = require('../models');

        const departments = await Department.find()
            .populate({
                path: 'members', // Assuming 'members' is a virtual or reference in Department model
                select: '_id firstName lastName role'
            });

        const departmentData = await Promise.all(departments.map(async (dept) => {
            const taskCount = await Task.countDocuments({
                assignedTo: { $in: dept.members ? dept.members.map(m => m._id) : [] }
            });

            const completedTasks = await Task.countDocuments({
                assignedTo: { $in: dept.members ? dept.members.map(m => m._id) : [] },
                status: 'completed'
            });

            return {
                id: dept.id,
                name: dept.name,
                description: dept.description,
                status: dept.status,
                budget: dept.budget,
                memberCount: dept.members.length,
                taskCount,
                completedTasks,
                metrics: dept.metrics || {}
            };
        }));

        res.json(departmentData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get tasks for a specific department
// @route   GET /api/president/departments/:id/tasks
// @access  Private (President/VP)
const getDepartmentTasks = async (req, res) => {
    try {
        const { Department, User, Task } = require('../models');

        const department = await Department.findById(req.params.id)
            .populate('members', '_id');

        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        const memberIds = department.members.map(m => m._id);

        const tasks = await Task.find({
            assignedTo: { $in: memberIds }
        })
            .populate('assignee', 'firstName lastName')
            .populate('assigner', 'firstName lastName')
            .sort({ createdAt: -1 });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get system-wide analytics
// @route   GET /api/president/analytics/system
// @access  Private (President/VP)
const getSystemAnalytics = async (req, res) => {
    try {
        const totalMembers = await User.countDocuments({ role: 'member' });
        const totalEvents = await Event.countDocuments();
        const totalElections = await Election.countDocuments();
        const totalVotes = await Vote.countDocuments();

        // Mock data for charts (replace with real aggregations later)
        const engagementData = [
            { name: 'Jan', value: 400 },
            { name: 'Feb', value: 300 },
            { name: 'Mar', value: 600 },
            { name: 'Apr', value: 800 },
            { name: 'May', value: 500 }
        ];

        const budgetData = [
            { name: 'Events', value: 4000 },
            { name: 'Marketing', value: 3000 },
            { name: 'Operations', value: 2000 },
            { name: 'Misc', value: 1000 }
        ];

        res.json({
            overview: {
                totalMembers,
                totalEvents,
                totalElections,
                totalVotes
            },
            engagement: engagementData,
            budget: budgetData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get live election results
// @route   GET /api/president/elections/live
// @access  Private (President/VP)
const getLiveElectionResults = async (req, res) => {
    try {
        // Look for ongoing elections first (isOpen: true, status: 'ongoing')
        let activeElection = await Election.findOne({ isOpen: true, status: 'ongoing' });

        // If no ongoing election, get the most recent completed election
        if (!activeElection) {
            activeElection = await Election.findOne({ status: 'completed' })
                .sort({ endDate: -1 }); // Get most recent
        }

        if (!activeElection) {
            return res.json({ message: 'No election to display', active: false });
        }

        // Get candidates for this election
        const candidates = await Candidate.find({ electionId: activeElection._id })
            .populate('userId', 'firstName lastName');

        const results = candidates.map(candidate => ({
            id: candidate._id,
            name: `${candidate.userId.firstName} ${candidate.userId.lastName}`,
            position: candidate.position,
            votes: candidate.voteCount,
            photoUrl: candidate.photo
        }));

        res.json({
            active: true,
            election: {
                id: activeElection._id,
                title: activeElection.title,
                description: activeElection.description,
                status: activeElection.status
            },
            results
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update event status
// @route   PUT /api/president/events/:id/status
// @access  Private (President/VP)
const updateEventStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        event.status = status;
        await event.save();
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all members with filtering and sorting
// @route   GET /api/president/members
// @access  Private (President/VP)
const getAllMembers = async (req, res) => {
    try {
        const { status, department, search, sortBy, order } = req.query;

        const where = {};

        // Assuming we add isApproved column to User model or use existing field
        // For now, let's assume we use 'isProfileComplete' as a proxy for 'active' or add a new field
        // But the prompt asked for "Approve/reject new member registrations"
        // So I should probably add 'isApproved' to User model if not exists.
        // Let's check User model again.

        if (status) {
            if (status === 'approved') where.isApproved = true;
            if (status === 'pending') where.isApproved = false;
        }

        if (department) where.department = department;

        if (search) {
            where.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { studentId: { $regex: search, $options: 'i' } }
            ];
        }

        const members = await User.find(where)
            .select('-password')
            .sort({ [sortBy || 'createdAt']: order === 'ASC' ? 1 : -1 });

        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update member status (Approve/Reject)
// @route   PUT /api/president/members/:id/status
// @access  Private (President/VP)
const updateMemberStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'approved', 'rejected'
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (status === 'approved') {
            user.isApproved = true;
        } else if (status === 'rejected') {
            user.isApproved = false;
        }

        await user.save();
        res.json({ message: `Member ${status}`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get member analytics
// @route   GET /api/president/analytics/members
// @access  Private (President/VP)
const getMemberAnalytics = async (req, res) => {
    try {
        const totalMembers = await User.count({ where: { role: 'member' } });
        const activeMembers = await User.count({ where: { role: 'member', isApproved: true } });
        const pendingMembers = await User.count({ where: { role: 'member', isApproved: false } });

        // Department distribution
        const departmentDistribution = await User.aggregate([
            { $match: { role: 'member' } },
            { $group: { _id: '$department', count: { $sum: 1 } } }
        ]);

        // Academic Year distribution
        const yearDistribution = await User.aggregate([
            { $match: { role: 'member' } },
            { $group: { _id: '$academicYear', count: { $sum: 1 } } }
        ]);

        res.json({
            totalMembers,
            activeMembers,
            pendingMembers,
            departmentDistribution,
            yearDistribution
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a member
// @route   DELETE /api/president/members/:id
// @access  Private (President only)
const deleteMember = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent deleting president, vp, or secretary
        if (['president', 'vp', 'secretary'].includes(user.role)) {
            return res.status(403).json({ message: 'Cannot delete executive members' });
        }

        await User.deleteOne({ _id: user._id });
        res.json({ message: 'Member deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get members with attendance warnings
// @route   GET /api/president/members/warnings
// @access  Private (President/VP)
const getMembersWithWarnings = async (req, res) => {
    try {
        const { Attendance } = require('../models');
        // const { Op } = require('sequelize'); // Removed Sequelize

        // Get all members
        const members = await User.find({ role: 'member' })
            .select('-password');

        // For each member, check their attendance warnings
        const membersWithWarnings = await Promise.all(members.map(async (member) => {
            // Get attendance records for this member, ordered by date
            const attendanceRecords = await Attendance.find({ userId: member._id })
                .sort({ date: -1 })
                .limit(10);

            // Count consecutive absences
            let consecutiveAbsences = 0;
            for (const record of attendanceRecords) {
                if (record.status === 'absent') {
                    consecutiveAbsences++;
                } else {
                    break; // Stop counting if present
                }
            }

            return {
                ...member.toJSON(),
                warningCount: consecutiveAbsences,
                hasWarning: consecutiveAbsences >= 3
            };
        }));

        // Filter to only members with warnings
        const filtered = membersWithWarnings.filter(m => m.hasWarning);

        res.json(filtered);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get registration status
// @route   GET /api/president/registration/status
// @access  Private (President/VP)
const getRegistrationStatus = async (req, res) => {
    try {
        // For simplicity, we'll use a simple approach: check if there's a setting in the database
        // or use an environment variable. For now, let's create a simple settings table approach
        // We'll store it in a JSON file or use a Settings model

        // Simple approach: Use a global variable or file-based storage
        // For production, you'd want a proper Settings table
        const fs = require('fs');
        const path = require('path');
        const settingsPath = path.join(__dirname, '../../registration-settings.json');

        let settings = { isOpen: true }; // Default to open

        if (fs.existsSync(settingsPath)) {
            settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        }

        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update registration status
// @route   PUT /api/president/registration/status
// @access  Private (President only)
const updateRegistrationStatus = async (req, res) => {
    try {
        const { isOpen } = req.body;
        const fs = require('fs');
        const path = require('path');
        const settingsPath = path.join(__dirname, '../../registration-settings.json');

        const settings = { isOpen: !!isOpen };

        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

        res.json({ message: 'Registration status updated', settings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export all functions


// @desc    Open an election for voting
// @route   PATCH /api/president/elections/:id/open
// @access  Private (President)
const openElection = async (req, res) => {
    const { id } = req.params;
    try {
        const election = await Election.findById(id);
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }
        election.isOpen = true;
        election.status = 'ongoing';
        await election.save();

        // Log audit
        await AuditLog.create({
            user: req.user._id,
            action: 'ELECTION_OPENED',
            targetType: 'Election',
            targetId: id,
            details: { title: election.title },
            ipAddress: req.ip
        });

        res.json({ message: 'Election opened successfully', election });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Close an election
// @route   PATCH /api/president/elections/:id/close
// @access  Private (President)
const closeElection = async (req, res) => {
    const { id } = req.params;
    try {
        const election = await Election.findById(id);
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }
        election.isOpen = false;
        election.status = 'completed';
        await election.save();

        // Log audit
        await AuditLog.create({
            user: req.user._id,
            action: 'ELECTION_CLOSED',
            targetType: 'Election',
            targetId: id,
            details: { title: election.title },
            ipAddress: req.ip
        });

        res.json({ message: 'Election closed successfully', election });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get live results for an election
// @route   GET /api/president/results/:electionId
// @access  Private (President)
const getLiveResults = async (req, res) => {
    const { electionId } = req.params;
    try {
        const candidates = await Candidate.find({ electionId })
            .populate('userId', 'firstName lastName profilePicture')
            .sort({ voteCount: -1 });

        const totalVotes = await Vote.countDocuments({ electionId });

        // Calculate total votes per position
        const votesByPosition = {};
        candidates.forEach(candidate => {
            if (!votesByPosition[candidate.position]) {
                votesByPosition[candidate.position] = 0;
            }
            votesByPosition[candidate.position] += candidate.voteCount;
        });

        const results = candidates.map(candidate => {
            const positionTotal = votesByPosition[candidate.position] || 0;
            return {
                _id: candidate._id,
                name: `${candidate.userId.firstName} ${candidate.userId.lastName}`,
                position: candidate.position,
                photo: candidate.photo,
                voteCount: candidate.voteCount,
                percentage: positionTotal > 0 ? ((candidate.voteCount / positionTotal) * 100).toFixed(2) : 0
            };
        });

        res.json({
            totalVotes,
            results
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get winner for an election
// @route   GET /api/president/winner/:electionId
// @access  Private (President)
const getWinner = async (req, res) => {
    const { electionId } = req.params;
    try {
        const election = await Election.findById(electionId);
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }
        if (election.isOpen) {
            return res.status(400).json({ message: 'Election is still open' });
        }

        // Get candidates grouped by position
        const candidates = await Candidate.find({ electionId })
            .populate('userId', 'firstName lastName profilePicture')
            .sort({ position: 1, voteCount: -1 });

        // Group by position and find winner for each
        // Group by position and find winner for each
        const positions = {};
        const votesByPosition = {}; // Track total votes per position

        candidates.forEach(candidate => {
            if (!positions[candidate.position]) {
                positions[candidate.position] = [];
                votesByPosition[candidate.position] = 0;
            }
            positions[candidate.position].push(candidate);
            votesByPosition[candidate.position] += candidate.voteCount;
        });

        const winners = {};
        Object.keys(positions).forEach(position => {
            const positionCandidates = positions[position];
            if (positionCandidates.length > 0) {
                // Candidates are already sorted by voteCount desc
                const winner = positionCandidates[0];
                const positionTotal = votesByPosition[position];

                winners[position] = {
                    _id: winner._id,
                    name: `${winner.userId.firstName} ${winner.userId.lastName}`,
                    photo: winner.photo,
                    voteCount: winner.voteCount,
                    percentage: positionTotal > 0 ? ((winner.voteCount / positionTotal) * 100).toFixed(2) : 0,
                    totalVotes: positionTotal
                };
            }
        });

        res.json({ winners });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get voter analytics for an election
// @route   GET /api/president/analytics/:electionId
// @access  Private (President)
const getVoterAnalytics = async (req, res) => {
    const { electionId } = req.params;
    try {
        const totalMembers = await User.countDocuments({ role: { $in: ['member', 'president', 'vp', 'secretary', 'dept_head'] } });
        const totalVotes = await Vote.countDocuments({ electionId });
        const turnoutPercentage = totalMembers > 0 ? ((totalVotes / totalMembers) * 100).toFixed(2) : 0;

        // Department breakdown
        const votes = await Vote.find({ electionId }).populate('voterId', 'department');
        const departmentBreakdown = {};
        votes.forEach(vote => {
            const dept = vote.voterId.department || 'No Department';
            departmentBreakdown[dept] = (departmentBreakdown[dept] || 0) + 1;
        });

        // Voting timeline (votes per hour)
        const votingTimeline = await Vote.aggregate([
            { $match: { electionId: require('mongoose').Types.ObjectId(electionId) } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d %H:00', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            totalMembers,
            totalVotes,
            turnoutPercentage,
            departmentBreakdown,
            votingTimeline
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle election results announcement
// @route   PATCH /api/president/elections/:id/announce
// @access  Private (President)
const announceResults = async (req, res) => {
    const { id } = req.params;
    try {
        const election = await Election.findById(id);
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }

        // Toggle the status
        election.resultsAnnounced = !election.resultsAnnounced;
        await election.save();

        // Log audit
        await AuditLog.create({
            user: req.user._id,
            action: election.resultsAnnounced ? 'RESULTS_ANNOUNCED' : 'RESULTS_HIDDEN',
            targetType: 'Election',
            targetId: id,
            details: { title: election.title },
            ipAddress: req.ip
        });

        res.json({
            message: `Results ${election.resultsAnnounced ? 'announced' : 'hidden'} successfully`,
            election
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a candidate
// @route   DELETE /api/president/candidates/:id
// @access  Private (President/Public Admin)
const deleteCandidate = async (req, res) => {
    const { id } = req.params;
    try {
        const candidate = await Candidate.findById(id).populate('userId', 'firstName lastName');
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        // Delete associated votes for this candidate
        await Vote.deleteMany({ candidateId: id });
        await Candidate.findByIdAndDelete(id);

        // Log audit
        await AuditLog.create({
            user: req.user._id,
            action: 'CANDIDATE_DELETED',
            targetType: 'Candidate',
            targetId: id,
            details: {
                candidateName: candidate.userId ? `${candidate.userId.firstName} ${candidate.userId.lastName}` : 'Unknown',
                position: candidate.position
            },
            ipAddress: req.ip
        });

        res.json({ message: 'Candidate deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an election
// @route   DELETE /api/president/elections/:id
// @access  Private (President)
const deleteElection = async (req, res) => {
    const { id } = req.params;
    try {
        const election = await Election.findById(id);
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }

        // Delete associated candidates and votes
        await Candidate.deleteMany({ electionId: id });
        await Vote.deleteMany({ electionId: id });
        await Election.findByIdAndDelete(id);

        // Log audit
        await AuditLog.create({
            user: req.user._id,
            action: 'ELECTION_DELETED',
            targetType: 'Election',
            targetId: id,
            details: { title: election.title, status: election.status },
            ipAddress: req.ip
        });

        res.json({ message: 'Election deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    sendBroadcast,
    createEvent,
    getEvents,
    createElection,
    addCandidate,
    getElections,
    getElectionResults,
    castVote,
    getAllMembers,
    updateMemberStatus,
    getMemberAnalytics,
    getBroadcastTemplates,
    createBroadcastTemplate,
    updateEventStatus,
    getLiveElectionResults,
    getSystemAnalytics,
    getDepartmentOverview,
    getDepartmentTasks,
    getPresidentInbox,
    updateProblemStatus,
    getAuditLogs,
    updateUserRole,
    getArchives,
    createArchive,
    deleteMember,
    getMembersWithWarnings,
    getRegistrationStatus,
    updateRegistrationStatus,
    openElection,
    closeElection,
    getLiveResults,
    getWinner,
    getVoterAnalytics,
    announceResults,
    deleteElection,
    deleteCandidate,
    updateCandidate
};
