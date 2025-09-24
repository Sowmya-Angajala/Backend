const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dishes: [{
    dish: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dish',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'],
    default: 'Order Received'
  },
  assignedChef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  specialInstructions: String,
  estimatedDeliveryTime: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);