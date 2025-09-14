const mongoose = require('mongoose');

const learnerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    interests: [String],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Learner', learnerSchema);
