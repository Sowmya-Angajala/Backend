const express = require('express');
const { body } = require('express-validator');
const {
  getDishes,
  getDish,
  createDish,
  updateDish,
  deleteDish
} = require('../controllers/dishController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getDishes);
router.get('/:id', getDish);

router.post('/', [
  protect,
  authorize('admin'),
  body('name').notEmpty().withMessage('Dish name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('preparationTime').isInt({ min: 1 }).withMessage('Preparation time must be at least 1 minute')
], createDish);

router.put('/:id', [
  protect,
  authorize('admin')
], updateDish);

router.delete('/:id', [
  protect,
  authorize('admin')
], deleteDish);

module.exports = router;