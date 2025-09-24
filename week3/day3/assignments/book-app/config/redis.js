const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.connect();
  }

  connect() {
    try {
      this.client = redis.createClient({
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || 6379,
          connectTimeout: 5000,
          reconnectStrategy: (retries) => {
            console.log(`Redis reconnecting attempt ${retries}`);
            return Math.min(retries * 100, 3000);
          }
        },
        password: process.env.REDIS_PASSWORD || undefined
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err.message);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('Connected to Redis');
        this.isConnected = true;
      });

      this.client.on('disconnect', () => {
        console.log('Disconnected from Redis');
        this.isConnected = false;
      });

      this.client.connect().catch(err => {
        console.error('Failed to connect to Redis:', err.message);
        this.isConnected = false;
      });

    } catch (error) {
      console.error('Redis initialization error:', error.message);
      this.isConnected = false;
    }
  }

  async get(key) {
    if (!this.isConnected) {
      console.warn('Redis not connected - get operation skipped');
      return null;
    }
    try {
      return await this.client.get(key);
    } catch (err) {
      console.error('Redis GET error:', err.message);
      return null;
    }
  }

  async set(key, value, expiration = 3600) {
    if (!this.isConnected) {
      console.warn('Redis not connected - set operation skipped');
      return;
    }
    try {
      await this.client.set(key, value, { EX: expiration });
    } catch (err) {
      console.error('Redis SET error:', err.message);
    }
  }

  async del(key) {
    if (!this.isConnected) {
      console.warn('Redis not connected - del operation skipped');
      return;
    }
    try {
      await this.client.del(key);
    } catch (err) {
      console.error('Redis DEL error:', err.message);
    }
  }

  async lPush(key, value) {
    if (!this.isConnected) {
      console.warn('Redis not connected - lPush operation skipped');
      return;
    }
    try {
      await this.client.lPush(key, value);
    } catch (err) {
      console.error('Redis LPUSH error:', err.message);
    }
  }

  async lRange(key, start, stop) {
    if (!this.isConnected) {
      console.warn('Redis not connected - lRange operation skipped');
      return [];
    }
    try {
      return await this.client.lRange(key, start, stop);
    } catch (err) {
      console.error('Redis LRANGE error:', err.message);
      return [];
    }
  }

  async lRem(key, count, value) {
    if (!this.isConnected) {
      console.warn('Redis not connected - lRem operation skipped');
      return;
    }
    try {
      await this.client.lRem(key, count, value);
    } catch (err) {
      console.error('Redis LREM error:', err.message);
    }
  }

  async sAdd(key, value) {
    if (!this.isConnected) {
      console.warn('Redis not connected - sAdd operation skipped');
      return;
    }
    try {
      await this.client.sAdd(key, value);
    } catch (err) {
      console.error('Redis SADD error:', err.message);
    }
  }

  async sMembers(key) {
    if (!this.isConnected) {
      console.warn('Redis not connected - sMembers operation skipped');
      return [];
    }
    try {
      return await this.client.sMembers(key);
    } catch (err) {
      console.error('Redis SMEMBERS error:', err.message);
      return [];
    }
  }

  async sRem(key, value) {
    if (!this.isConnected) {
      console.warn('Redis not connected - sRem operation skipped');
      return;
    }
    try {
      await this.client.sRem(key, value);
    } catch (err) {
      console.error('Redis SREM error:', err.message);
    }
  }

  async lLen(key) {
    if (!this.isConnected) {
      console.warn('Redis not connected - lLen operation skipped');
      return 0;
    }
    try {
      return await this.client.lLen(key);
    } catch (err) {
      console.error('Redis LLEN error:', err.message);
      return 0;
    }
  }

  // Add missing method for set operations
  async sAddGlobal(key, value) {
    return this.sAdd(key, value);
  }

  async sMembersGlobal(key) {
    return this.sMembers(key);
  }

  async sRemGlobal(key, value) {
    return this.sRem(key, value);
  }
}

module.exports = new RedisClient();