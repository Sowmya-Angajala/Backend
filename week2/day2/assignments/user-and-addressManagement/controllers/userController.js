const User = require("../models/userModel");

// Create User
exports.createUser = async (req, res) => {
      console.log("Incoming body:", req.body); 
  try {
    const { name, email, age } = req.body || {};
    const user = new User({ name, email, age });
    await user.save();
    res.status(201).json({ message: "User created", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add Address
exports.addAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { street, city, state, country, pincode } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.addresses.push({ street, city, state, country, pincode });
    await user.save();

    res.status(201).json({ message: "Address added", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Users Summary
exports.getUsersSummary = async (req, res) => {
  try {
    const users = await User.find();

    const totalUsers = users.length;
    const totalAddresses = users.reduce((acc, u) => acc + u.addresses.length, 0);

    const userSummary = users.map(u => ({
      name: u.name,
      addressesCount: u.addresses.length
    }));

    res.json({ totalUsers, totalAddresses, userSummary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User by ID with Addresses
exports.getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a specific address
exports.deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.addresses.id(addressId).deleteOne();
    await user.save();

    res.json({ message: "Address deleted", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
