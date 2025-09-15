const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Blacklist = require('../models/Blacklist');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashed });
  await user.save();
  res.json({ message: 'User registered successfully' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.json({ accessToken, refreshToken });
});

// Logout
router.post('/logout', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(400).json({ message: 'Token missing' });

  const decoded = jwt.decode(token);
  await Blacklist.create({ token, expiresAt: new Date(decoded.exp * 1000) });
  res.json({ message: 'Logged out successfully' });
});

// Refresh
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Refresh token missing' });

  const blacklisted = await Blacklist.findOne({ token: refreshToken });
  if (blacklisted) return res.status(401).json({ message: 'Token blacklisted' });

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

module.exports = router;
