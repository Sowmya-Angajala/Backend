const Learner = require('../models/Learner');
const Session = require('../models/Session');

// Create Learner
exports.createLearner = async (req, res) => {
    try {
        const learner = await Learner.create(req.body);
        res.status(201).json(learner);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Soft-delete Learner
exports.deleteLearner = async (req, res) => {
    try {
        const learner = await Learner.findByIdAndUpdate(req.params.id, { isActive: false });
        if (!learner) return res.status(404).json({ error: "Learner not found" });

        // Cancel learner from upcoming sessions
        await Session.updateMany(
            { "learners.learner": req.params.id, sessionTime: { $gte: new Date() } },
            { $set: { "learners.$.attendance": "cancelled" } }
        );

        res.json({ message: "Learner soft-deleted and attendance cancelled" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
