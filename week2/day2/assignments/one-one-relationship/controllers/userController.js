const User = require("../models/userModel");
const Profile = require("../models/profileModel");

// Add User
exports.addUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Add Profile
exports.addProfile = async (req, res) => {
  try {
    const { bio, socialMediaLinks, user } = req.body;

    // Check if user exists
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if profile already exists for this user
    const existingProfile = await Profile.findOne({ user });
    if (existingProfile) {
      return res.status(400).json({ error: "Profile already exists for this user" });
    }

    const profile = new Profile({ bio, socialMediaLinks, user });
    await profile.save();
    res.status(201).json({ message: "Profile created successfully", profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all profiles with populated user info
exports.getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", "name email");
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
