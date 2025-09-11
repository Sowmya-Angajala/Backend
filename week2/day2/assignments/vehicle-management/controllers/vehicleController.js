const Vehicle = require('../models/vehicleModel');

// --------- Vehicle CRUD ---------
exports.createVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
};

exports.getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find();
    res.json({ success: true, data: vehicles });
  } catch (err) {
    next(err);
  }
};

exports.updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    res.json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
};

exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    res.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// --------- Trip Operations ---------
exports.addTrip = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });

    vehicle.trips.push(req.body);
    await vehicle.save();
    res.status(201).json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
};

exports.updateTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const vehicle = await Vehicle.findOne({ 'trips._id': tripId });
    if (!vehicle) return res.status(404).json({ success: false, message: 'Trip not found' });

    const trip = vehicle.trips.id(tripId);
    Object.assign(trip, req.body);
    await vehicle.save();
    res.json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
};

exports.deleteTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const vehicle = await Vehicle.findOne({ 'trips._id': tripId });
    if (!vehicle) return res.status(404).json({ success: false, message: 'Trip not found' });

    vehicle.trips.id(tripId).remove();
    await vehicle.save();
    res.json({ success: true, message: 'Trip deleted successfully', data: vehicle });
  } catch (err) {
    next(err);
  }
};

// --------- Advanced Queries ---------
exports.tripsLongerThan200 = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ 'trips.distance': { $gt: 200 } });
    res.json({ success: true, data: vehicles });
  } catch (err) {
    next(err);
  }
};

exports.tripsFromCities = async (req, res, next) => {
  try {
    const cities = ['Delhi', 'Mumbai', 'Bangalore'];
    const vehicles = await Vehicle.find({ 'trips.startLocation': { $in: cities } });
    res.json({ success: true, data: vehicles });
  } catch (err) {
    next(err);
  }
};

exports.tripsAfterDate = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ 'trips.startTime': { $gte: new Date('2024-01-01') } });
    res.json({ success: true, data: vehicles });
  } catch (err) {
    next(err);
  }
};

exports.carOrTruckVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ type: { $in: ['car', 'truck'] } });
    res.json({ success: true, data: vehicles });
  } catch (err) {
    next(err);
  }
};
