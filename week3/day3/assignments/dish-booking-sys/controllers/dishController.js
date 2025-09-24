const Dish = require('../models/Dish');
const { validationResult } = require('express-validator');

// Get all dishes
exports.getDishes = async (req, res) => {
  try {
    const dishes = await Dish.find({ isAvailable: true })
      .populate('createdBy', 'name email');
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single dish
exports.getDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id).populate('createdBy', 'name email');
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    res.json(dish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create dish (Admin only)
exports.createDish = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const dish = await Dish.create({
      ...req.body,
      createdBy: req.user.id
    });

    const populatedDish = await Dish.findById(dish._id).populate('createdBy', 'name email');
    res.status(201).json(populatedDish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update dish (Admin only)
exports.updateDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    const updatedDish = await Dish.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.json(updatedDish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete dish (Admin only)
exports.deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    await Dish.findByIdAndDelete(req.params.id);
    res.json({ message: 'Dish removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};