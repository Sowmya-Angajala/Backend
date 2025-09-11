const User = require('../models/User');
const Book = require('../models/Book');

exports.addUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const user = new User({ name, email });
    await user.save();
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('rentedBooks');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserRentals = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('rentedBooks');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ rentedBooks: user.rentedBooks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
