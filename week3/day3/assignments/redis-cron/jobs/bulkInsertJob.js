// src/jobs/bulkInsertJob.js
const cron = require('node-cron');
const redisService = require('../services/redisService');
const bookService = require('../services/bookService');

class BulkInsertJob {
    constructor() {
        this.isProcessing = false;
    }

    start() {
        // Run every 2 minutes
        cron.schedule('*/2 * * * *', async () => {
            if (this.isProcessing) {
                console.log('Bulk insertion job already running, skipping...');
                return;
            }

            await this.processBulkInsertions();
        });
    }

    async processBulkInsertions() {
        this.isProcessing = true;
        console.log('Starting bulk insertion job...');

        try {
            // Get all user queue keys
            const queueKeys = await redisService.client.keys('bulk:books:queue:*');
            
            for (const queueKey of queueKeys) {
                const userId = queueKey.split(':')[3]; // Extract userId from key
                await this.processUserBulkInsertion(userId);
            }
        } catch (error) {
            console.error('Error in bulk insertion job:', error);
        } finally {
            this.isProcessing = false;
            console.log('Bulk insertion job completed.');
        }
    }

    async processUserBulkInsertion(userId) {
        try {
            let booksBatch;
            const allResults = {
                successCount: 0,
                failCount: 0,
                failures: [],
                successBooks: []
            };

            // Process all batches for this user
            while ((booksBatch = await redisService.getFromBulkQueue(userId))) {
                const batchResults = await this.processBatch(userId, booksBatch);
                
                allResults.successCount += batchResults.successCount;
                allResults.failCount += batchResults.failCount;
                allResults.failures.push(...batchResults.failures);
                allResults.successBooks.push(...batchResults.successBooks);
            }

            // Update status in Redis if we processed any books
            if (allResults.successCount + allResults.failCount > 0) {
                const status = {
                    userId,
                    totalBooks: allResults.successCount + allResults.failCount,
                    successCount: allResults.successCount,
                    failCount: allResults.failCount,
                    failures: allResults.failures.slice(0, 50), // Limit failures stored
                    successBooks: allResults.successBooks.slice(0, 50), // Limit successes stored
                    processedAt: new Date().toISOString(),
                    status: 'completed'
                };

                await redisService.setBulkStatus(userId, status);
                console.log(`Bulk insertion completed for user ${userId}:`, status);
            }

        } catch (error) {
            console.error(`Error processing bulk insertion for user ${userId}:`, error);
            
            // Mark as failed in status
            const errorStatus = {
                userId,
                totalBooks: 0,
                successCount: 0,
                failCount: 0,
                failures: [{ error: error.message }],
                processedAt: new Date().toISOString(),
                status: 'failed'
            };
            
            await redisService.setBulkStatus(userId, errorStatus);
        }
    }

    async processBatch(userId, books) {
        const results = {
            successCount: 0,
            failCount: 0,
            failures: [],
            successBooks: []
        };

        for (const bookData of books) {
            try {
                const book = await bookService.createBook({
                    ...bookData,
                    addedBy: userId
                });
                
                results.successCount++;
                results.successBooks.push({
                    title: book.title,
                    author: book.author,
                    isbn: book.isbn,
                    publicationYear: book.publicationYear
                });
            } catch (error) {
                results.failCount++;
                results.failures.push({
                    book: bookData,
                    error: error.message
                });
            }
        }

        return results;
    }
}

module.exports = new BulkInsertJob();