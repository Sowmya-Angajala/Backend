
const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, user: req.user.id });
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = req.user.role === 'admin' 
      ? await Booking.find().populate('user', 'username email') 
      : await Booking.find({ user: req.user.id });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking || booking.status !== 'pending') return res.status(403).json({ error: 'Cannot update this booking' });

    Object.assign(booking, req.body);
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking || booking.status !== 'pending') return res.status(403).json({ error: 'Cannot cancel this booking' });

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin-only actions
exports.approveBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  booking.status = 'approved';
  await booking.save();
  res.json(booking);
};

exports.rejectBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  booking.status = 'rejected';
  await booking.save();
  res.json(booking);
};

exports.deleteBookingAdmin = async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  res.json({ message: 'Booking deleted' });
};
