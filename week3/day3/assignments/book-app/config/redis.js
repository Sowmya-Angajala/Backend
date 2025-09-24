// config/redis.js
const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = null;
    this.connect();
  }

  connect() {
    this.client = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379
      },
      password: process.env.REDIS_PASSWORD || undefined
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    this.client.on('connect', () => {
      console.log('Connected to Redis');
    });

    this.client.connect();
  }

  async get(key) {
    try {
      return await this.client.get(key);
    } catch (err) {
      console.error('Redis GET error:', err);
      return null;
    }
  }

  async set(key, value, expiration = 3600) {
    try {
      await this.client.set(key, value, { EX: expiration });
    } catch (err) {
      console.error('Redis SET error:', err);
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
    } catch (err) {
      console.error('Redis DEL error:', err);
    }
  }

  async hSet(key, field, value) {
    try {
      await this.client.hSet(key, field, value);
    } catch (err) {
      console.error('Redis HSET error:', err);
    }
  }

  async hGetAll(key) {
    try {
      return await this.client.hGetAll(key);
    } catch (err) {
      console.error('Redis HGETALL error:', err);
      return null;
    }
  }

  async lPush(key, value) {
    try {
      await this.client.lPush(key, value);
    } catch (err) {
      console.error('Redis LPUSH error:', err);
    }
  }

  async rPop(key) {
    try {
      return await this.client.rPop(key);
    } catch (err) {
      console.error('Redis RPOP error:', err);
      return null;
    }
  }

  async lRange(key, start, stop) {
    try {
      return await this.client.lRange(key, start, stop);
    } catch (err) {
      console.error('Redis LRANGE error:', err);
      return [];
    }
  }

  async lRem(key, count, value) {
    try {
      await this.client.lRem(key, count, value);
    } catch (err) {
      console.error('Redis LREM error:', err);
    }
  }
}

module.exports = new RedisClient();