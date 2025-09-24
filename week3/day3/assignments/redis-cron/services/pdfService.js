// src/services/pdfService.js
const PDFDocument = require('pdfkit');

class PDFService {
    generateBulkInsertReport(status) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument();
                const chunks = [];
                
                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);

                // Report Header
                doc.fontSize(20).text('Bulk Books Insertion Report', { align: 'center' });
                doc.moveDown();
                
                // User Information
                doc.fontSize(14).text(`User ID: ${status.userId}`);
                doc.text(`Report Generated: ${new Date().toLocaleString()}`);
                doc.text(`Processing Date: ${new Date(status.processedAt).toLocaleString()}`);
                doc.moveDown();
                
                // Summary Section
                doc.fontSize(16).text('Insertion Summary', { underline: true });
                doc.moveDown();
                
                doc.fontSize(12)
                   .text(`Total Books Processed: ${status.totalBooks}`)
                   .text(`Successfully Inserted: ${status.successCount}`)
                   .text(`Failed Insertions: ${status.failCount}`)
                   .text(`Success Rate: ${((status.successCount / status.totalBooks) * 100).toFixed(2)}%`);
                
                doc.moveDown();
                
                // Failure Details
                if (status.failures && status.failures.length > 0) {
                    doc.fontSize(14).text('Failed Books Details:', { underline: true });
                    doc.moveDown();
                    
                    status.failures.forEach((failure, index) => {
                        doc.fontSize(10)
                           .text(`${index + 1}. Book: ${failure.title || 'N/A'}`)
                           .text(`   Error: ${failure.error}`)
                           .moveDown(0.5);
                    });
                }
                
                // Success Details (first 10)
                if (status.successBooks && status.successBooks.length > 0) {
                    doc.addPage();
                    doc.fontSize(14).text('Successfully Inserted Books (Sample):', { underline: true });
                    doc.moveDown();
                    
                    status.successBooks.slice(0, 10).forEach((book, index) => {
                        doc.fontSize(10)
                           .text(`${index + 1}. ${book.title} by ${book.author}`)
                           .text(`   ISBN: ${book.isbn} | Year: ${book.publicationYear}`)
                           .moveDown(0.5);
                    });
                    
                    if (status.successBooks.length > 10) {
                        doc.text(`... and ${status.successBooks.length - 10} more books.`);
                    }
                }
                
                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = new PDFService();