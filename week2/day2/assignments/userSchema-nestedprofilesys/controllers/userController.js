const User = require('../models/User');

// Helper to standardize API responses for not found
const notFound = (res, message = 'Not found') => res.status(404).json({ message });

// Route 1: Add User
exports.addUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    // duplicate key error code from MongoDB is 11000
    if (err.code === 11000) {
      err.status = 400;
      err.message = 'Email already exists';
    }
    next(err);
  }
};

// Route 2: Add Profile
exports.addProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { profileName, url } = req.body;

    const user = await User.findById(userId);
    if (!user) return notFound(res, 'User not found');

    // prevent adding duplicate profileName for the same user
    const exists = user.profiles.find((p) => p.profileName === profileName);
    if (exists)
      return res.status(400).json({ message: 'Profile already exists for this user' });

    user.profiles.push({ profileName, url });
    await user.save();

    res.status(201).json({ message: 'Profile added', profiles: user.profiles });
  } catch (err) {
    next(err);
  }
};

// Route 3: Get Users (with optional profile filter)
exports.getUsers = async (req, res, next) => {
  try {
    const { profile } = req.query; // e.g. ?profile=github
    let users;

    if (profile) {
      users = await User.find({ 'profiles.profileName': profile });
    } else {
      users = await User.find();
    }

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (err) {
    next(err); 
  }
};

// Route 4: Search user and profile
exports.search = async (req, res, next) => {
  try {
    const { name, profile } = req.query;

    const user = await User.findOne({ name });
    if (!user) return res.status(404).json({ message: "User not found" });

    const foundProfile = user.profiles.find(p => p.profileName === profile);

    if (foundProfile) {
      return res.status(200).json({
        message: "User and profile found",
        user: {
          name: user.name,
          email: user.email,
          profile: foundProfile
        }
      });
    } else {
      return res.status(200).json({
        message: "User found, but profile not found",
        user: {
          name: user.name,
          email: user.email,
          profiles: user.profiles
        }
      });
    }
  } catch (err) {
    next(err);
  }
};

// Route 5: Update profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { userId, profileName } = req.params;
    const { url } = req.body;

    const user = await User.findById(userId);
    if (!user) return notFound(res, 'User not found');

    const profile = user.profiles.find(p => p.profileName === profileName);
    if (!profile) return notFound(res, 'Profile not found');

    profile.url = url || profile.url; // update only if new url provided
    await user.save();

    res.status(200).json({ message: 'Profile updated', profile });
  } catch (err) {
    next(err);
  }
};

// Route 6: Delete profile
exports.deleteProfile = async (req, res, next) => {
  try {
    const { userId, profileName } = req.params;

    const user = await User.findById(userId);
    if (!user) return notFound(res, 'User not found');

    const initialCount = user.profiles.length;
    user.profiles = user.profiles.filter(p => p.profileName !== profileName);

    if (user.profiles.length === initialCount) {
      return notFound(res, 'Profile not found');
    }

    await user.save();
    res.status(200).json({ message: 'Profile deleted', profiles: user.profiles });
  } catch (err) {
    next(err);
  }
};
