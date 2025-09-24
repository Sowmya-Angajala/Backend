const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', [
  protect,
  body('dishes').isArray({ min: 1 }).withMessage('At least one dish is required'),
  body('dishes.*.dish').isMongoId().withMessage('Invalid dish ID'),
  body('dishes.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('deliveryAddress.street').notEmpty().withMessage('Street address is required'),
  body('deliveryAddress.city').notEmpty().withMessage('City is required'),
  body('deliveryAddress.state').notEmpty().withMessage('State is required'),
  body('deliveryAddress.zipCode').notEmpty().withMessage('Zip code is required')
], createOrder);

router.get('/my-orders', protect, getUserOrders);
router.get('/all', [
  protect,
  authorize('admin', 'chef')
], getAllOrders);

router.put('/:id/status', [
  protect,
  authorize('chef', 'admin'),
  body('status').notEmpty().withMessage('Status is required')
], updateOrderStatus);

module.exports = router;