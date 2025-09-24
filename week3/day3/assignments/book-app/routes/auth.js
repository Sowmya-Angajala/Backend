const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { generateToken } = require('../middleware/auth');

// In-memory user store for demo
const users = new Map();

router.post('/signup', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    if (users.has(username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = require('uuid').v4();
    
    users.set(username, {
      userId,
      username,
      password: hashedPassword,
      email,
      createdAt: new Date()
    });

    const token = generateToken(userId, username);
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { userId, username, email }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = users.get(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.userId, username);
    
    res.json({
      message: 'Login successful',
      token,
      user: { userId: user.userId, username, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;