const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Subscribe
router.post('/subscribe', auth, async (req, res) => {
  const { plan } = req.body; // free, premium, pro
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 30);

  await User.findByIdAndUpdate(req.user.id, { subscription: { plan, expiry } });
  res.json({ message: `Subscribed to ${plan} plan until ${expiry}` });
});

// Subscription Status
router.get('/subscription-status', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const now = new Date();
  if (!user.subscription.expiry || now > user.subscription.expiry) {
    user.subscription = { plan: 'free', expiry: null };
    await user.save();
    return res.json({ plan: 'free', status: 'expired' });
  }
  res.json({ plan: user.subscription.plan, expiry: user.subscription.expiry });
});

// Renew Subscription
router.patch('/renew', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user.subscription.expiry || new Date() > user.subscription.expiry) {
    return res.status(400).json({ message: 'Subscription expired. Please subscribe again.' });
  }
  const newExpiry = new Date(user.subscription.expiry);
  newExpiry.setDate(newExpiry.getDate() + 30);
  user.subscription.expiry = newExpiry;
  await user.save();
  res.json({ message: `Subscription renewed until ${newExpiry}` });
});

// Cancel Subscription
router.post('/cancel-subscription', auth, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { subscription: { plan: 'free', expiry: null } });
  res.json({ message: 'Subscription cancelled, reverted to free plan' });
});

module.exports = router;
