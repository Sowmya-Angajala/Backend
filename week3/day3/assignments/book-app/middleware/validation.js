const { body, validationResult } = require('express-validator');

const validateBook = [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('isbn').optional().isISBN().withMessage('Valid ISBN required'),
  body('publicationYear').optional().isInt({ min: 1000, max: new Date().getFullYear() }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateBulkBooks = [
  body().isArray().withMessage('Expected an array of books'),
  body('*.title').notEmpty().withMessage('Each book must have a title'),
  body('*.author').notEmpty().withMessage('Each book must have an author'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateBook, validateBulkBooks };