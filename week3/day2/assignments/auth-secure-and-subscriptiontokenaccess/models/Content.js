const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: { type: String, enum: ['free', 'premium'], default: 'free' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', contentSchema);
