const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  subscription: {
    plan: { type: String, default: 'free', enum: ['free', 'premium', 'pro'] },
    expiry: { type: Date, default: null }
  }
});

module.exports = mongoose.model('User', userSchema);
