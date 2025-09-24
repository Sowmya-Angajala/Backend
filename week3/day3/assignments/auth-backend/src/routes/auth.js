const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');


const User = require('../models/User');
const ResetToken = require('../models/ResetToken');
const { sendMail } = require('../utils/mailer');
const { forgotPasswordLimiter, loginLimiter } = require('../middleware/rateLimit');


const router = express.Router();


// POST /signup
router.post('/signup', async (req, res) => {
const { name, email, password } = req.body;
if(!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
try{
const existing = await User.findOne({ email: email.toLowerCase() });
if(existing) return res.status(409).json({ message: 'Email already in use' });
const salt = await bcrypt.genSalt(12);
const hashed = await bcrypt.hash(password, salt);
const user = await User.create({ name, email: email.toLowerCase(), password: hashed });
res.status(201).json({ message: 'User created' });
}catch(err){
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


// POST /login
router.post('/login', loginLimiter, async (req, res) => {
const { email, password } = req.body;
if(!email || !password) return res.status(400).json({ message: 'Missing fields' });
try{
const user = await User.findOne({ email: email.toLowerCase() });
if(!user) return res.status(401).json({ message: 'Invalid credentials' });
const ok = await bcrypt.compare(password, user.password);
if(!ok) return res.status(401).json({ message: 'Invalid credentials' });
const token = jwt.sign({ sub: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '1d' });
res.json({ accessToken: token });
}catch(err){
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


// POST /forgot-password
// POST /forgot-password
router.post('/forgot-password', forgotPasswordLimiter, async (req, res) => {
  const { email } = req.body;
  // Always return same response for security reasons
  const genericRes = { message: 'If an account with that email exists, you will receive a reset link shortly.' };
  if (!email) return res.status(200).json(genericRes);

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(200).json(genericRes);

    // create token
    const token = uuidv4();
    const mins = Number(process.env.RESET_TOKEN_EXPIRES_MIN || 30);
    const expiresAt = new Date(Date.now() + mins * 60 * 1000);

    await ResetToken.create({ userId: user._id, token, expiresAt });

    const resetLink = `${process.env.FRONTEND_URL || ''}/reset-password/${token}`;

    const info = await sendMail({
      from: process.env.FROM_EMAIL,
      to: user.email,
      subject: 'Password Reset Request',
      text: `To reset your password, click this link: ${resetLink}`,
      html: `<p>To reset your password, click <a href="${resetLink}">here</a>. 
             This link expires in ${mins} minutes.</p>`
    });

    if (info && info.messageId) {
      console.log('Reset email sent:', info.messageId);
    }

    return res.status(200).json(genericRes);
  } catch (err) {
    console.error(err);
    return res.status(200).json(genericRes);
  }
});

// POST /reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: 'Missing password' });

  try {
    const record = await ResetToken.findOne({ token });
    if (!record) return res.status(400).json({ message: 'Invalid or expired token' });
    if (record.used) return res.status(400).json({ message: 'Token already used' });
    if (record.expiresAt < new Date()) return res.status(400).json({ message: 'Token expired' });

    const user = await User.findById(record.userId);
    if (!user) return res.status(400).json({ message: 'Invalid token' });

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    record.used = true;
    await record.save();

    res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
