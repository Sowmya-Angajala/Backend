const express = require('express');
const Content = require('../models/Content');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/role');
const User = require('../models/User');
const router = express.Router();

// Free content
router.get('/free', auth, async (req, res) => {
  const content = await Content.find({ category: 'free' });
  res.json(content);
});

// Premium content
router.get('/premium', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const plan = user.subscription.plan;
  if (plan === 'free') return res.status(403).json({ message: 'Upgrade to access premium content' });
  const content = await Content.find({ category: { $in: ['free', 'premium'] } });
  res.json(content);
});

// Admin - Create content
router.post('/', auth, roleCheck(['admin']), async (req, res) => {
  const content = await Content.create(req.body);
  res.json(content);
});

// Admin - Delete content
router.delete('/:id', auth, roleCheck(['admin']), async (req, res) => {
  await Content.findByIdAndDelete(req.params.id);
  res.json({ message: 'Content deleted' });
});

module.exports = router;
