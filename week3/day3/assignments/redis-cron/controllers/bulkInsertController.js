// src/controllers/bulkInsertController.js
const redisService = require('../services/redisService');
const Book = require('../models/Book');

class BulkInsertController {
    // Submit bulk books for processing
    async submitBulkBooks(req, res) {
        try {
            const { userId, books } = req.body;
            
            if (!userId || !books || !Array.isArray(books)) {
                return res.status(400).json({
                    error: 'userId and books array are required'
                });
            }

            // Validate books structure
            const validationErrors = this.validateBooks(books);
            if (validationErrors.length > 0) {
                return res.status(400).json({
                    error: 'Invalid book data',
                    details: validationErrors
                });
            }

            // Check if user already has pending bulk operations
            const existingStatus = await redisService.getBulkStatus(userId);
            if (existingStatus && existingStatus.status === 'processing') {
                return res.status(409).json({
                    error: 'User has pending bulk operations',
                    existingStatus: {
                        queueSize: existingStatus.queueSize,
                        startedAt: existingStatus.startedAt
                    }
                });
            }

            // Add to Redis queue in batches (max 100 books per batch)
            const batchSize = 100;
            const batches = [];
            
            for (let i = 0; i < books.length; i += batchSize) {
                const batch = books.slice(i, i + batchSize);
                batches.push(batch);
            }

            let totalQueued = 0;
            for (const batch of batches) {
                await redisService.addToBulkQueue(userId, batch);
                totalQueued += batch.length;
            }

            // Set initial processing status
            await redisService.setBulkStatus(userId, {
                userId,
                totalBooks: totalQueued,
                successCount: 0,
                failCount: 0,
                batches: batches.length,
                status: 'queued',
                queueSize: batches.length,
                submittedAt: new Date().toISOString(),
                startedAt: null,
                completedAt: null
            });

            res.json({
                message: 'Bulk books submitted for processing',
                userId,
                totalBooks: totalQueued,
                batches: batches.length,
                queueSize: batches.length,
                estimatedProcessing: 'Within 2-5 minutes',
                statusEndpoint: `/api/bulk/status/${userId}`
            });

        } catch (error) {
            console.error('Error submitting bulk books:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get bulk insertion status
    async getBulkStatus(req, res) {
        try {
            const { userId } = req.params;
            const status = await redisService.getBulkStatus(userId);
            
            if (!status) {
                return res.status(404).json({ 
                    error: 'No bulk insertion status found for user',
                    suggestion: 'The operation may have completed or expired'
                });
            }

            // Add progress percentage
            const progress = status.totalBooks > 0 
                ? Math.round(((status.successCount + status.failCount) / status.totalBooks) * 100)
                : 0;

            res.json({
                ...status,
                progress,
                estimatedTimeRemaining: this.calculateETC(status)
            });
        } catch (error) {
            console.error('Error fetching bulk status:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Direct bulk insert (for small batches, bypassing queue)
    async directBulkInsert(req, res) {
        try {
            const { userId, books } = req.body;
            
            if (!userId || !books || !Array.isArray(books)) {
                return res.status(400).json({
                    error: 'userId and books array are required'
                });
            }

            if (books.length > 50) {
                return res.status(400).json({
                    error: 'Direct bulk insert limited to 50 books. Use bulk endpoint for larger batches'
                });
            }

            const validationErrors = this.validateBooks(books);
            if (validationErrors.length > 0) {
                return res.status(400).json({
                    error: 'Invalid book data',
                    details: validationErrors
                });
            }

            // Add user ID to each book
            const booksWithUser = books.map(book => ({
                ...book,
                addedBy: userId
            }));

            const result = await Book.bulkInsert(booksWithUser);
            
            if (result.success) {
                res.json({
                    message: 'Books inserted successfully',
                    insertedCount: result.insertedCount,
                    books: result.books
                });
            } else {
                res.status(207).json({ // 207 Multi-Status
                    message: 'Partial success',
                    insertedCount: result.insertedCount,
                    errorCount: result.errorCount,
                    errors: result.errors
                });
            }

        } catch (error) {
            console.error('Error in direct bulk insert:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Cancel bulk operation
    async cancelBulkOperation(req, res) {
        try {
            const { userId } = req.params;
            
            const status = await redisService.getBulkStatus(userId);
            if (!status) {
                return res.status(404).json({ error: 'No active bulk operation found' });
            }

            if (status.status === 'completed' || status.status === 'failed') {
                return res.status(400).json({ error: 'Cannot cancel completed operation' });
            }

            // Cleanup user data
            await redisService.cleanupUserData(userId);
            
            res.json({ 
                message: 'Bulk operation cancelled successfully',
                cancelledAt: new Date().toISOString()
            });

        } catch (error) {
            console.error('Error cancelling bulk operation:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    validateBooks(books) {
        const errors = [];
        
        if (books.length > 1000) {
            errors.push(`Maximum 1000 books allowed per bulk operation. Received: ${books.length}`);
        }

        books.forEach((book, index) => {
            if (!book.title || book.title.trim().length === 0) {
                errors.push(`Book ${index + 1}: title is required`);
            }
            
            if (!book.author || book.author.trim().length === 0) {
                errors.push(`Book ${index + 1}: author is required`);
            }
            
            if (book.publicationYear) {
                const currentYear = new Date().getFullYear();
                if (book.publicationYear < 1000 || book.publicationYear > currentYear) {
                    errors.push(`Book ${index + 1}: publication year must be between 1000 and ${currentYear}`);
                }
            }
            
            if (book.isbn && !/^[0-9]{10}$|^[0-9]{13}$/.test(book.isbn)) {
                errors.push(`Book ${index + 1}: ISBN must be 10 or 13 digits`);
            }
        });

        return errors;
    }

    calculateETC(status) {
        if (!status.startedAt || status.status === 'completed') return null;
        
        const started = new Date(status.startedAt);
        const now = new Date();
        const elapsed = now - started;
        const processed = status.successCount + status.failCount;
        
        if (processed === 0) return 'Calculating...';
        
        const rate = processed / (elapsed / 1000); // books per second
        const remaining = status.totalBooks - processed;
        const etcSeconds = remaining / rate;
        
        return etcSeconds > 60 
            ? `${Math.ceil(etcSeconds / 60)} minutes`
            : `${Math.ceil(etcSeconds)} seconds`;
    }
}

module.exports = new BulkInsertController();