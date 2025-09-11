const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  bio: {
    type: String,
    default: ""
  },
  socialMediaLinks: {
    type: [String],
    default: []
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true   // ensures one profile per user
  }
});

module.exports = mongoose.model("Profile", profileSchema);
