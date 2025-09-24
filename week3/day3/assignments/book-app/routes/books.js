const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { validateBook, validateBulkBooks } = require('../middleware/validation');
const BookModel = require('../models/Book');
const redisClient = require('../config/redis');
const RedisKeys = require('../utils/redisKeys');

// GET /books - List all books with Redis caching
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const cacheKey = RedisKeys.getUserCacheKey(userId);

    // Try to get from cache first
    const cachedBooks = await redisClient.get(cacheKey);
    if (cachedBooks) {
      console.log('Serving from cache for user:', userId);
      return res.json({
        source: 'cache',
        books: JSON.parse(cachedBooks)
      });
    }

    // Get from database
    const books = BookModel.getAllBooks(userId);
    console.log('Serving from database for user:', userId);

    // Cache the result for 5 minutes
    await redisClient.set(cacheKey, JSON.stringify(books), 300);

    res.json({
      source: 'database',
      books
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /books - Add a new book
router.post('/', authenticateToken, validateBook, async (req, res) => {
  try {
    const userId = req.user.userId;
    const newBook = BookModel.addBook(userId, req.body);

    // Invalidate cache
    const cacheKey = RedisKeys.getUserCacheKey(userId);
    await redisClient.del(cacheKey);

    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /books/:id - Update a book
router.put('/:id', authenticateToken, validateBook, async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookId = req.params.id;
    
    const updatedBook = BookModel.updateBook(userId, bookId, req.body);
    
    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Invalidate cache
    const cacheKey = RedisKeys.getUserCacheKey(userId);
    await redisClient.del(cacheKey);

    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /books/:id - Delete a book
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookId = req.params.id;
    
    const deleted = BookModel.deleteBook(userId, bookId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Invalidate cache
    const cacheKey = RedisKeys.getUserCacheKey(userId);
    await redisClient.del(cacheKey);

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /books/bulk - Bulk books insertion via Redis queue
router.post('/bulk', authenticateToken, validateBulkBooks, async (req, res) => {
  try {
    const userId = req.user.userId;
    const books = req.body;
    const bulkQueueKey = RedisKeys.getUserBulkQueueKey(userId);

    // Add books to Redis queue with timestamp
    const bulkJob = {
      userId,
      books,
      timestamp: new Date().toISOString(),
      jobId: require('uuid').v4()
    };

    await redisClient.lPush(bulkQueueKey, JSON.stringify(bulkJob));

    // Add queue to global list for cron job to discover
    await redisClient.sAdd('books:bulk:queues', bulkQueueKey);

    console.log(`Added bulk job ${bulkJob.jobId} to queue for user ${userId}`);

    res.json({ 
      message: 'Books will be added later', 
      jobId: bulkJob.jobId,
      queueLength: await redisClient.lLen(bulkQueueKey)
    });
  } catch (error) {
    console.error('Error queueing bulk books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /books/bulk/status - Check bulk job status
router.get('/bulk/status', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const bulkQueueKey = RedisKeys.getUserBulkQueueKey(userId);
    
    const queueLength = await redisClient.lLen(bulkQueueKey);
    
    res.json({
      userId,
      pendingJobs: queueLength,
      queueKey: bulkQueueKey
    });
  } catch (error) {
    console.error('Error checking bulk status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;