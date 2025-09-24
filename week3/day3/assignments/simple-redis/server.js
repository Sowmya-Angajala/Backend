const express = require('express');
const redis = require('redis');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Create Redis client
const redisClient = redis.createClient({
  socket: {
    host: 'localhost',
    port: 6379
  }
});

// Handle Redis connection errors
redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Connect to Redis
(async () => {
  await redisClient.connect();
  console.log('Connected to Redis successfully');
})();

// In-memory "database" simulation
let items = [
  { id: 1, name: 'Item 1', description: 'First item' },
  { id: 2, name: 'Item 2', description: 'Second item' },
  { id: 3, name: 'Item 3', description: 'Third item' }
];

// Cache key constants
const CACHE_KEYS = {
  ALL_ITEMS: 'items:all'
};

// Cache TTL (1 minute)
const CACHE_TTL = 60;

// Helper function to log cache events
function logCacheEvent(event, key) {
  console.log(`[CACHE] ${event}: ${key} - ${new Date().toISOString()}`);
}

// Helper function to invalidate cache
async function invalidateCache() {
  try {
    const deleted = await redisClient.del(CACHE_KEYS.ALL_ITEMS);
    if (deleted) {
      logCacheEvent('INVALIDATED', CACHE_KEYS.ALL_ITEMS);
    }
  } catch (error) {
    console.error('Error invalidating cache:', error);
  }
}

// GET /items - Fetch all items with caching
app.get('/items', async (req, res) => {
  try {
    // Try to get data from Redis cache first
    const cachedData = await redisClient.get(CACHE_KEYS.ALL_ITEMS);
    
    if (cachedData) {
      // Cache hit - return data from Redis
      logCacheEvent('HIT', CACHE_KEYS.ALL_ITEMS);
      return res.json({
        source: 'cache',
        data: JSON.parse(cachedData)
      });
    }
    
    // Cache miss - fetch from "database"
    logCacheEvent('MISS', CACHE_KEYS.ALL_ITEMS);
    
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Cache the data in Redis with TTL
    await redisClient.setEx(
      CACHE_KEYS.ALL_ITEMS, 
      CACHE_TTL, 
      JSON.stringify(items)
    );
    
    logCacheEvent('SET', CACHE_KEYS.ALL_ITEMS);
    
    res.json({
      source: 'database',
      data: items
    });
    
  } catch (error) {
    console.error('Error in GET /items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /items - Add a new item
app.post('/items', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    // Create new item
    const newItem = {
      id: items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1,
      name,
      description: description || ''
    };
    
    // Add to "database"
    items.push(newItem);
    
    // Invalidate cache
    await invalidateCache();
    
    logCacheEvent('INVALIDATED AFTER POST', CACHE_KEYS.ALL_ITEMS);
    
    res.status(201).json({
      message: 'Item created successfully',
      data: newItem
    });
    
  } catch (error) {
    console.error('Error in POST /items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /items/:id - Update an item by ID
app.put('/items/:id', async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const { name, description } = req.body;
    
    // Find item index
    const itemIndex = items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Update item
    items[itemIndex] = {
      ...items[itemIndex],
      name: name || items[itemIndex].name,
      description: description !== undefined ? description : items[itemIndex].description
    };
    
    // Invalidate cache
    await invalidateCache();
    
    logCacheEvent('INVALIDATED AFTER PUT', CACHE_KEYS.ALL_ITEMS);
    
    res.json({
      message: 'Item updated successfully',
      data: items[itemIndex]
    });
    
  } catch (error) {
    console.error('Error in PUT /items/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /items/:id - Delete an item by ID
app.delete('/items/:id', async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    
    // Find item index
    const itemIndex = items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Remove item
    const deletedItem = items.splice(itemIndex, 1)[0];
    
    // Invalidate cache
    await invalidateCache();
    
    logCacheEvent('INVALIDATED AFTER DELETE', CACHE_KEYS.ALL_ITEMS);
    
    res.json({
      message: 'Item deleted successfully',
      data: deletedItem
    });
    
  } catch (error) {
    console.error('Error in DELETE /items/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /cache-info - Utility endpoint to check cache status
app.get('/cache-info', async (req, res) => {
  try {
    const ttl = await redisClient.ttl(CACHE_KEYS.ALL_ITEMS);
    const exists = await redisClient.exists(CACHE_KEYS.ALL_ITEMS);
    
    res.json({
      cacheKey: CACHE_KEYS.ALL_ITEMS,
      exists: exists === 1,
      ttl: ttl > 0 ? ttl : -1, // -1 means no TTL, -2 means key doesn't exist
      ttlMinutes: ttl > 0 ? (ttl / 60).toFixed(2) : 0
    });
  } catch (error) {
    console.error('Error in GET /cache-info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /reset - Utility endpoint to reset data and cache (for testing)
app.get('/reset', async (req, res) => {
  try {
    // Reset items
    items = [
      { id: 1, name: 'Item 1', description: 'First item' },
      { id: 2, name: 'Item 2', description: 'Second item' },
      { id: 3, name: 'Item 3', description: 'Third item' }
    ];
    
    // Clear cache
    await invalidateCache();
    
    res.json({ message: 'Data and cache reset successfully' });
  } catch (error) {
    console.error('Error in GET /reset:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Make sure Redis is running on localhost:6379`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await redisClient.quit();
  process.exit(0);
});