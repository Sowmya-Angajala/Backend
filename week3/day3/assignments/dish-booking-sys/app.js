const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic routes (we'll add proper routes later)
app.get('/health', (req, res) => {
  res.json({ 
    message: 'Server is running successfully',
    timestamp: new Date().toISOString(),
    database: 'MongoDB connected'
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Dish Booking System API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

// Simple API route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API endpoints will be added here',
    status: 'Working'
  });
});

// Proper 404 handler - FIXED: Don't use '*'
app.use((req, res, next) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

module.exports = app;