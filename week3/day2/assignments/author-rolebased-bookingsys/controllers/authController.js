const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
  return { accessToken, refreshToken };
};

exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await User.create({ username, email, password, role });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ error: 'Invalid credentials' });

    const tokens = generateTokens(user);
    res.json({ message: 'Login successful', tokens });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.refreshToken = (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ error: 'Refresh token required' });

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: 'Invalid refresh token' });
      const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
      res.json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
