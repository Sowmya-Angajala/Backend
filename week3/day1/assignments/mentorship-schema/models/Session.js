const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
    learners: [{
        learner: { type: mongoose.Schema.Types.ObjectId, ref: 'Learner' },
        attendance: { type: String, enum: ['attended', 'cancelled'], default: 'attended' },
        feedback: { type: String }
    }],
    sessionTime: { type: Date, required: true },
    notes: { type: String },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
