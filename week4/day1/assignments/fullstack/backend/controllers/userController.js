const User = require("../models/User");

// Admin: get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

// User: get/update own profile
exports.getProfile = (req, res) => {
  res.status(200).json(req.user);
};

exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;
  try {
    req.user.name = name || req.user.name;
    req.user.email = email || req.user.email;
    await req.user.save();
    res.status(200).json(req.user);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};
