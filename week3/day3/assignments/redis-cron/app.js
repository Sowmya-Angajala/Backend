// src/app.js
const express = require('express');
const bulkInsertController = require('./controllers/bulkInsertController');
const bulkInsertJob = require('./jobs/bulkInsertJob');
const reportJob = require('./jobs/reportJob');

const app = express();

app.use(express.json());

// Routes
app.post('/api/bulk/books', bulkInsertController.submitBulkBooks);
app.get('/api/bulk/status/:userId', bulkInsertController.getBulkStatus);

// Start cron jobs when server starts
bulkInsertJob.start();
reportJob.start();

console.log('Bulk Insertion Job started - runs every 2 minutes');
console.log('Report Generation Job started - runs every 5 minutes');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Books Management API running on port ${PORT}`);
});

module.exports = app;