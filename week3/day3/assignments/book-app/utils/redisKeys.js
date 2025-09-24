class RedisKeys {
  static getUserCacheKey(userId) {
    return `user:${userId}:books:cache`;
  }

  static getUserBulkQueueKey(userId) {
    return `user:${userId}:books:bulk:queue`;
  }

  static getAllBulkQueueKeys() {
    return 'books:bulk:queues';
  }

  static addBulkQueueToGlobalList(userId) {
    return `user:${userId}:books:bulk:queue`;
  }
}

module.exports = RedisKeys;