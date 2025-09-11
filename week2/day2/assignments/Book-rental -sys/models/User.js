const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  rentedBooks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
