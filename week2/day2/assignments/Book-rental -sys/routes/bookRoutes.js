const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// POST /api/add-book
router.post('/add-book', bookController.addBook);

// PUT /api/update-book/:bookId
router.put('/update-book/:bookId', bookController.updateBook);

// DELETE /api/delete-book/:bookId
router.delete('/delete-book/:bookId', bookController.deleteBook);

// POST /api/rent-book  body: { userId, bookId }
router.post('/rent-book', bookController.rentBook);

// POST /api/return-book body: { userId, bookId }
router.post('/return-book', bookController.returnBook);

// GET /api/book-renters/:bookId
router.get('/book-renters/:bookId', bookController.getBookRenters);

module.exports = router;
