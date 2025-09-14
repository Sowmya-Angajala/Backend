const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    expertise: [String],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Mentor', mentorSchema);
