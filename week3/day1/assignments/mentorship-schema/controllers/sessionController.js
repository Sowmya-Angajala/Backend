const Session = require('../models/Session');
const Mentor = require('../models/Mentor');
const Learner = require('../models/Learner');

// Create session
exports.createSession = async (req, res) => {
    try {
        const session = await Session.create(req.body);
        res.status(201).json(session);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Archive session
exports.archiveSession = async (req, res) => {
    try {
        const session = await Session.findByIdAndUpdate(req.params.id, { isArchived: true, isActive: false });
        if (!session) return res.status(404).json({ error: "Session not found" });

        res.json({ message: "Session archived successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get active sessions by mentor
exports.getSessionsByMentor = async (req, res) => {
    try {
        const sessions = await Session.find({ mentor: req.params.id, isActive: true })
            .populate('mentor', 'name email')
            .populate('learners.learner', 'name email');
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get active sessions by learner
exports.getSessionsByLearner = async (req, res) => {
    try {
        const sessions = await Session.find({ "learners.learner": req.params.id, isActive: true })
            .populate('mentor', 'name email')
            .populate('learners.learner', 'name email');
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get recent sessions (limit 5)
exports.getRecentSessions = async (req, res) => {
    try {
        const sessions = await Session.find({ isActive: true })
            .sort({ sessionTime: -1 })
            .limit(5)
            .populate('mentor', 'name email')
            .populate('learners.learner', 'name email');
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Count number of learners for a mentor's sessions
exports.countLearnersForMentor = async (req, res) => {
    try {
        const sessions = await Session.find({ mentor: req.params.id, isActive: true });
        let learnerSet = new Set();
        sessions.forEach(session => {
            session.learners.forEach(l => {
                if (l.attendance === 'attended') learnerSet.add(l.learner.toString());
            });
        });
        res.json({ totalLearners: learnerSet.size });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// List all mentors a learner has interacted with
exports.getMentorsForLearner = async (req, res) => {
    try {
        const sessions = await Session.find({ "learners.learner": req.params.id, isActive: true })
            .populate('mentor', 'name email');

        const mentorSet = new Map();
        sessions.forEach(s => {
            mentorSet.set(s.mentor._id.toString(), s.mentor);
        });

        res.json([...mentorSet.values()]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// List all learners for a particular session
exports.getLearnersForSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate('learners.learner', 'name email');
        if (!session) return res.status(404).json({ error: "Session not found" });

        const learners = session.learners.map(l => ({
            learner: l.learner,
            attendance: l.attendance,
            feedback: l.feedback
        }));

        res.json(learners);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get learners who attended more than 3 sessions
exports.getActiveLearnersMoreThanThree = async (req, res) => {
    try {
        const sessions = await Session.find({ isActive: true });
        const learnerCount = {};

        sessions.forEach(session => {
            session.learners.forEach(l => {
                if (l.attendance === 'attended') {
                    const id = l.learner.toString();
                    learnerCount[id] = (learnerCount[id] || 0) + 1;
                }
            });
        });

        const result = [];
        for (const learnerId in learnerCount) {
            if (learnerCount[learnerId] > 3) {
                const learner = await Learner.findById(learnerId).select('name email');
                if (learner) result.push(learner);
            }
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
