const { Booking } = require('../models');

/**
 * @desc Create a new booking
 * @route POST /api/bookings
 */
exports.createBooking = async (req, res) => {
  try {
    const { user_id, garage_id, start_time, end_time, total_price, status } = req.body;

    if (!user_id || !garage_id || !start_time || !end_time) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const booking = await Booking.create({
      user_id,
      garage_id,
      start_time,
      end_time,
      total_price: total_price || 0,
      status: status || 'pending',
    });

    res.status(201).json({
      success: true,
      message: '✅ Booking created successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get all bookings
 * @route GET /api/bookings
 */
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get booking by ID
 * @route GET /api/bookings/:id
 */
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Update booking
 * @route PUT /api/bookings/:id
 */
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    await booking.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Delete booking
 * @route DELETE /api/bookings/:id
 */
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    await booking.destroy();

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
