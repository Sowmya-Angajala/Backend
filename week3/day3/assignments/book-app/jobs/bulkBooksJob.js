const { CronJob } = require('cron');
const redisClient = require('../config/redis');
const BookModel = require('../models/Book');

class BulkBooksJob {
  constructor() {
    this.isProcessing = false;
    this.init();
  }

  init() {
    // Run every 2 minutes
    this.job = new CronJob('*/2 * * * *', () => {
      this.processBulkBooks();
    });
    
    this.job.start();
    console.log('Bulk books cron job started (runs every 2 minutes)');
  }

  async processBulkBooks() {
    if (this.isProcessing) {
      console.log('Bulk processing already in progress, skipping...');
      return;
    }

    this.isProcessing = true;
    console.log('Starting bulk books processing...');

    try {
      // Get all bulk queue keys from Redis set
      const queueKeys = await redisClient.sMembers('books:bulk:queues');
      
      for (const queueKey of queueKeys) {
        await this.processUserQueue(queueKey);
      }

      console.log('Bulk books processing completed');
    } catch (error) {
      console.error('Error in bulk books processing:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  async processUserQueue(queueKey) {
    try {
      // Get all jobs from the queue
      const jobs = await redisClient.lRange(queueKey, 0, -1);
      
      if (jobs.length === 0) {
        // Remove empty queue from global list
        await redisClient.sRem('books:bulk:queues', queueKey);
        return;
      }

      console.log(`Processing ${jobs.length} jobs from queue: ${queueKey}`);

      // Process each job
      for (const jobStr of jobs) {
        const job = JSON.parse(jobStr);
        await this.processSingleJob(job, queueKey);
      }

    } catch (error) {
      console.error(`Error processing queue ${queueKey}:`, error);
    }
  }

  async processSingleJob(job, queueKey) {
    try {
      console.log(`Processing job ${job.jobId} for user ${job.userId}`);
      
      // Insert books into database
      const insertedBooks = BookModel.addBulkBooks(job.userId, job.books);
      
      // Invalidate user's cache
      const cacheKey = `user:${job.userId}:books:cache`;
      await redisClient.del(cacheKey);

      // Remove the processed job from queue
      await redisClient.lRem(queueKey, 1, JSON.stringify(job));

      console.log(`Successfully processed job ${job.jobId}: inserted ${insertedBooks.length} books`);

    } catch (error) {
      console.error(`Error processing job ${job.jobId}:`, error);
      // You might want to implement retry logic or move to dead letter queue
    }
  }
}

module.exports = new BulkBooksJob();