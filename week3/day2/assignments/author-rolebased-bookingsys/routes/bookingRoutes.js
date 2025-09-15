
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const bookingController = require('../controllers/bookingController');

router.post('/bookings', authenticate, authorize(['user']), bookingController.createBooking);
router.get('/bookings', authenticate, bookingController.getBookings);
router.put('/bookings/:id', authenticate, authorize(['user']), bookingController.updateBooking);
router.delete('/bookings/:id', authenticate, authorize(['user']), bookingController.cancelBooking);

router.patch('/bookings/:id/approve', authenticate, authorize(['admin']), bookingController.approveBooking);
router.patch('/bookings/:id/reject', authenticate, authorize(['admin']), bookingController.rejectBooking);
router.delete('/bookings/:id', authenticate, authorize(['admin']), bookingController.deleteBookingAdmin);

module.exports = router;
