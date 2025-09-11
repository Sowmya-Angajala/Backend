const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  startLocation: { type: String, required: true },
  endLocation: { type: String, required: true },
  distance: { type: Number, required: true, min: [1, 'Distance must be greater than 0'] },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true }
});

const vehicleSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ['car', 'truck', 'bike'] },
  model: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  trips: [tripSchema]
});

// Optional instance method
vehicleSchema.methods.totalDistance = function () {
  return this.trips.reduce((total, trip) => total + trip.distance, 0);
};

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle;
