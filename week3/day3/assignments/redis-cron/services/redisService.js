// src/services/redisService.js
const redis = require('redis');
const { promisify } = require('util');

class RedisService {
    constructor() {
        this.client = redis.createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        });
        
        this.client.on('error', (err) => {
            console.error('Redis Client Error:', err);
        });
        
        this.connect();
    }

    async connect() {
        await this.client.connect();
    }

    // Key generation helpers
    getUserBulkQueueKey(userId) {
        return `bulk:books:queue:${userId}`;
    }

    getUserStatusKey(userId) {
        return `bulk:books:status:${userId}`;
    }

    getAllStatusKeys() {
        return 'bulk:books:status:*';
    }

    // Bulk insertion queue operations
    async addToBulkQueue(userId, books) {
        const key = this.getUserBulkQueueKey(userId);
        await this.client.rPush(key, JSON.stringify(books));
        return await this.client.lLen(key);
    }

    async getFromBulkQueue(userId) {
        const key = this.getUserBulkQueueKey(userId);
        const data = await this.client.lPop(key);
        return data ? JSON.parse(data) : null;
    }

    // Status tracking operations
    async setBulkStatus(userId, status) {
        const key = this.getUserStatusKey(userId);
        await this.client.setEx(key, 86400, JSON.stringify({ // 24h expiry
            ...status,
            userId,
            updatedAt: new Date().toISOString()
        }));
    }

    async getBulkStatus(userId) {
        const key = this.getUserStatusKey(userId);
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
    }

    async getAllBulkStatuses() {
        const keys = await this.client.keys(this.getAllStatusKeys());
        const statuses = [];
        
        for (const key of keys) {
            const data = await this.client.get(key);
            if (data) {
                statuses.push(JSON.parse(data));
            }
        }
        
        return statuses;
    }

    async deleteBulkStatus(userId) {
        const key = this.getUserStatusKey(userId);
        await this.client.del(key);
    }

    async cleanupUserData(userId) {
        const queueKey = this.getUserBulkQueueKey(userId);
        const statusKey = this.getUserStatusKey(userId);
        
        await this.client.del(queueKey);
        await this.client.del(statusKey);
    }
}

module.exports = new RedisService();