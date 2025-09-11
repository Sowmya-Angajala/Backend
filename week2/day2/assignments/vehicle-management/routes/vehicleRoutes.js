const express = require('express');
const router = express.Router();
const controller = require('../controllers/vehicleController');

// Vehicle CRUD
router.post('/', controller.createVehicle);
router.get('/', controller.getAllVehicles);
router.put('/:id', controller.updateVehicle);
router.delete('/:id', controller.deleteVehicle);

// Trip Operations
router.post('/:id/trips', controller.addTrip);
router.put('/trips/:tripId', controller.updateTrip);
router.delete('/trips/:tripId', controller.deleteTrip);

// Advanced Queries
router.get('/query/long-trips', controller.tripsLongerThan200);
router.get('/query/cities', controller.tripsFromCities);
router.get('/query/start-after', controller.tripsAfterDate);
router.get('/query/car-truck', controller.carOrTruckVehicles);

module.exports = router;
