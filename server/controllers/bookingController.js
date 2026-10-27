const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Payment = require('../models/Payment');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Logged-in User)
const createBooking = async (req, res, next) => {
  try {
    const {
      roomId,
      checkInDate,
      checkOutDate,
      totalGuests,
      guestName,
      guestEmail,
      guestPhone,
      paymentMethod,
      specialRequests,
    } = req.body;

    if (!roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide roomId, checkInDate, and checkOutDate',
      });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date values provided',
      });
    }

    if (checkIn >= checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date',
      });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    if (!room.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'This room is currently out of service or under maintenance',
      });
    }

    // Check availability collision
    const existingBooking = await Booking.findOne({
      room: roomId,
      bookingStatus: { $ne: 'cancelled' },
      checkInDate: { $lt: checkOut },
      checkOutDate: { $gt: checkIn },
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: 'Sorry! This room is already booked for the selected dates.',
      });
    }

    // Calculate nights & total price
    const diffTime = Math.abs(checkOut - checkIn);
    const totalNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const totalPrice = totalNights * room.pricePerNight;

    const booking = await Booking.create({
      user: req.user._id,
      room: room._id,
      guestName: guestName || req.user.name,
      guestEmail: guestEmail || req.user.email,
      guestPhone: guestPhone || req.user.phone || '',
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalGuests: totalGuests || 1,
      totalNights,
      totalPrice,
      paymentMethod: paymentMethod || 'Credit Card',
      paymentStatus: 'paid', // Simulated immediate confirmation
      bookingStatus: 'confirmed',
      specialRequests: specialRequests || '',
    });

    // Create corresponding payment ledger entry
    const gateway = paymentMethod === 'UPI' ? 'Razorpay' : 'Stripe';
    const txnId = 'TXN_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
    await Payment.create({
      booking: booking._id,
      user: req.user._id,
      amount: totalPrice,
      currency: 'USD',
      gateway,
      paymentMethod: paymentMethod || 'Credit Card',
      transactionId: txnId,
      status: 'succeeded',
      cardLast4: '4242',
    });

    await booking.populate('room');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('room')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Ensure user can only view their own booking unless admin
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking',
      });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Admin only)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingStatus, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (bookingStatus) booking.bookingStatus = bookingStatus;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();
    await booking.populate('room');
    await booking.populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking (Guest)
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled',
      });
    }

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    await Payment.updateMany(
      { booking: booking._id },
      { status: 'refunded' }
    );

    res.status(200).json({
      success: true,
      message: 'Booking has been cancelled and refund initiated.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
};
