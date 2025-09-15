const jwt = require('jsonwebtoken');
const Blacklist = require('../models/Blacklist');
require('dotenv').config();

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing' });

    const blacklisted = await Blacklist.findOne({ token });
    if (blacklisted) return res.status(401).json({ message: 'Token blacklisted' });

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;
