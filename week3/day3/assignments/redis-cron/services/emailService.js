// src/services/emailService.js
const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransporter({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendBulkInsertReport(userEmail, status, pdfBuffer) {
        try {
            const mailOptions = {
                from: process.env.SMTP_FROM || 'noreply@booksapi.com',
                to: userEmail,
                subject: `Bulk Books Insertion Report - ${new Date().toLocaleDateString()}`,
                html: this.generateEmailTemplate(status),
                attachments: [{
                    filename: `bulk-insert-report-${status.userId}-${Date.now()}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }]
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log(`Report email sent to ${userEmail}:`, result.messageId);
            return result;
        } catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    }

    generateEmailTemplate(status) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { background: #f4f4f4; padding: 20px; border-radius: 5px; }
                    .summary { margin: 20px 0; }
                    .success { color: green; }
                    .failure { color: red; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Bulk Books Insertion Report</h1>
                    <p>User ID: ${status.userId}</p>
                    <p>Processed: ${new Date(status.processedAt).toLocaleString()}</p>
                </div>
                
                <div class="summary">
                    <h2>Insertion Summary</h2>
                    <p><strong>Total Books Processed:</strong> ${status.totalBooks}</p>
                    <p class="success"><strong>Successfully Inserted:</strong> ${status.successCount}</p>
                    <p class="failure"><strong>Failed Insertions:</strong> ${status.failCount}</p>
                    <p><strong>Success Rate:</strong> ${((status.successCount / status.totalBooks) * 100).toFixed(2)}%</p>
                </div>
                
                <p>Detailed report is attached as PDF.</p>
                
                <footer>
                    <p>This is an automated message. Please do not reply.</p>
                </footer>
            </body>
            </html>
        `;
    }
}

module.exports = new EmailService();