const Order = require('../models/Order');
const Dish = require('../models/Dish');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { dishes, deliveryAddress, specialInstructions } = req.body;

    // Calculate total amount and validate dishes
    let totalAmount = 0;
    const orderDishes = [];

    for (const item of dishes) {
      const dish = await Dish.findById(item.dish);
      if (!dish || !dish.isAvailable) {
        return res.status(400).json({ message: `Dish ${item.dish} not available` });
      }

      totalAmount += dish.price * item.quantity;
      orderDishes.push({
        dish: dish._id,
        quantity: item.quantity,
        price: dish.price
      });
    }

    // Assign random chef
    const chefs = await User.find({ role: 'chef', isActive: true });
    const randomChef = chefs[Math.floor(Math.random() * chefs.length)];

    const order = await Order.create({
      user: req.user.id,
      dishes: orderDishes,
      totalAmount,
      deliveryAddress,
      specialInstructions,
      assignedChef: randomChef?._id || null
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('dishes.dish')
      .populate('assignedChef', 'name email');

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('dishes.dish')
      .populate('assignedChef', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (Admin/Chef)
exports.getAllOrders = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'chef') {
      query.assignedChef = req.user.id;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('dishes.dish')
      .populate('assignedChef', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (Chef only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user.role === 'chef' && order.assignedChef.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('dishes.dish')
      .populate('assignedChef', 'name email');

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};