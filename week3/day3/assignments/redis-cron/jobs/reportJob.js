// src/jobs/reportJob.js
const cron = require('node-cron');
const redisService = require('../services/redisService');
const pdfService = require('../services/pdfService');
const emailService = require('../services/emailService');

class ReportJob {
    constructor() {
        this.isProcessing = false;
    }

    start() {
        // Run every 5 minutes
        cron.schedule('*/5 * * * *', async () => {
            if (this.isProcessing) {
                console.log('Report job already running, skipping...');
                return;
            }

            await this.processReports();
        });
    }

    async processReports() {
        this.isProcessing = true;
        console.log('Starting report generation job...');

        try {
            const statuses = await redisService.getAllBulkStatuses();
            console.log(`Found ${statuses.length} users with bulk insertion status`);

            for (const status of statuses) {
                await this.processUserReport(status);
            }
        } catch (error) {
            console.error('Error in report job:', error);
        } finally {
            this.isProcessing = false;
            console.log('Report generation job completed.');
        }
    }

    async processUserReport(status) {
        try {
            // Generate PDF report
            const pdfBuffer = await pdfService.generateBulkInsertReport(status);
            
            // Get user email (in real scenario, fetch from user service/database)
            const userEmail = await this.getUserEmail(status.userId);
            
            if (userEmail) {
                // Send email with report
                await emailService.sendBulkInsertReport(userEmail, status, pdfBuffer);
                
                // Delete status from Redis after successful email
                await redisService.deleteBulkStatus(status.userId);
                console.log(`Report sent and status deleted for user ${status.userId}`);
            } else {
                console.warn(`No email found for user ${status.userId}, keeping status for retry`);
            }
        } catch (error) {
            console.error(`Error processing report for user ${status.userId}:`, error);
            
            // Optional: Implement retry logic with max retry count
            await this.handleReportError(status, error);
        }
    }

    async getUserEmail(userId) {
        // In a real application, you would fetch this from your user database
        // For demo purposes, using a mock implementation
        return `user${userId}@example.com`;
    }

    async handleReportError(status, error) {
        // Implement retry logic or error tracking
        // For now, just log the error - the status will be retried in next run
        console.error(`Report generation failed for user ${status.userId}:`, error);
    }
}

module.exports = new ReportJob();