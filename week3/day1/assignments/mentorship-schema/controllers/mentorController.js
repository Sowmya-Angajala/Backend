const Mentor = require('../models/Mentor');
const Session = require('../models/Session');

// Create Mentor
exports.createMentor = async (req, res) => {
    try {
        const mentor = await Mentor.create(req.body);
        res.status(201).json(mentor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Soft-delete Mentor
exports.deleteMentor = async (req, res) => {
    try {
        const mentor = await Mentor.findByIdAndUpdate(req.params.id, { isActive: false });
        if (!mentor) return res.status(404).json({ error: "Mentor not found" });

        // Disable upcoming sessions
        await Session.updateMany(
            { mentor: req.params.id, sessionTime: { $gte: new Date() } },
            { isActive: false }
        );

        res.json({ message: "Mentor soft-deleted and sessions disabled" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get mentors with no active sessions
exports.getMentorsWithoutActiveSessions = async (req, res) => {
    try {
        const mentorsWithSessions = await Session.distinct('mentor', { isActive: true });
        const mentors = await Mentor.find({ 
            _id: { $nin: mentorsWithSessions }, 
            isActive: true 
        });
        res.json(mentors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
