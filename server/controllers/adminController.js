const Room = require('../models/Room');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Staff = require('../models/Staff');
const Payment = require('../models/Payment');

// @desc    Get dashboard metrics & occupancy & chart analytics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const totalRooms = await Room.countDocuments({});
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBookings = await Booking.countDocuments({});
    const totalStaff = await Staff.countDocuments({});

    const activeBookingsCount = await Booking.countDocuments({
      bookingStatus: { $in: ['confirmed', 'checked-in'] },
    });

    const revenueResult = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const occupancyRate = totalRooms > 0 
      ? Math.min(100, Math.round((activeBookingsCount / totalRooms) * 100)) 
      : 0;

    const recentBookings = await Booking.find()
      .populate('room', 'roomNumber title pricePerNight')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(6);

    // Chart Data: Room distribution by type
    const roomsByType = await Room.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    // Chart Data: Booking status breakdown
    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$bookingStatus', count: { $sum: 1 } } },
    ]);

    // Trend chart (Past 6 months or synthetic trend based on real revenue)
    const monthlyAnalytics = [
      { month: 'May', revenue: Math.round(totalRevenue * 0.12), bookings: Math.max(1, Math.round(totalBookings * 0.12)), occupancy: 65 },
      { month: 'Jun', revenue: Math.round(totalRevenue * 0.15), bookings: Math.max(2, Math.round(totalBookings * 0.16)), occupancy: 74 },
      { month: 'Jul', revenue: Math.round(totalRevenue * 0.22), bookings: Math.max(3, Math.round(totalBookings * 0.24)), occupancy: 88 },
      { month: 'Aug', revenue: Math.round(totalRevenue * 0.19), bookings: Math.max(2, Math.round(totalBookings * 0.20)), occupancy: 82 },
      { month: 'Sep', revenue: Math.round(totalRevenue * 0.14), bookings: Math.max(2, Math.round(totalBookings * 0.13)), occupancy: 70 },
      { month: 'Oct', revenue: Math.round(totalRevenue * 0.18), bookings: Math.max(3, Math.round(totalBookings * 0.15)), occupancy: Math.max(50, occupancyRate) },
    ];

    res.status(200).json({
      success: true,
      stats: {
        totalRooms,
        totalUsers,
        totalBookings,
        totalStaff,
        activeBookingsCount,
        totalRevenue,
        occupancyRate,
      },
      roomsByType,
      bookingsByStatus,
      monthlyAnalytics,
      recentBookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all staff members
// @route   GET /api/admin/staff
// @access  Private/Admin
const getAllStaff = async (req, res, next) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: staff.length, staff });
  } catch (error) {
    next(error);
  }
};

// @desc    Add staff member
// @route   POST /api/admin/staff
// @access  Private/Admin
const addStaff = async (req, res, next) => {
  try {
    const { name, email, phone, position, department, shift, salary, assignedFloor } = req.body;
    const existing = await Staff.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Staff member with this email already exists' });
    }

    const member = await Staff.create({
      name,
      email,
      phone,
      position,
      department,
      shift,
      salary: Number(salary) || 45000,
      assignedFloor: Number(assignedFloor) || 1,
    });

    res.status(201).json({ success: true, message: 'Staff member created successfully', member });
  } catch (error) {
    next(error);
  }
};

// @desc    Update staff member
// @route   PUT /api/admin/staff/:id
// @access  Private/Admin
const updateStaff = async (req, res, next) => {
  try {
    const member = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }
    res.status(200).json({ success: true, message: 'Staff member updated successfully', member });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete staff member
// @route   DELETE /api/admin/staff/:id
// @access  Private/Admin
const deleteStaff = async (req, res, next) => {
  try {
    const member = await Staff.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }
    res.status(200).json({ success: true, message: 'Staff member removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered guests/users
// @route   GET /api/admin/guests
// @access  Private/Admin
const getAllGuests = async (req, res, next) => {
  try {
    const guests = await User.find({ role: { $in: ['user', 'guest'] } }).select('-password').sort({ createdAt: -1 });
    
    // Attach booking count to each guest
    const guestsWithCount = await Promise.all(
      guests.map(async (g) => {
        const bookingsCount = await Booking.countDocuments({ user: g._id });
        return {
          ...g.toObject(),
          totalBookings: bookingsCount,
        };
      })
    );

    res.status(200).json({ success: true, count: guestsWithCount.length, guests: guestsWithCount });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments
// @route   GET /api/admin/payments
// @access  Private/Admin
const getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email')
      .populate('booking')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: payments.length, payments });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllStaff,
  addStaff,
  updateStaff,
  deleteStaff,
  getAllGuests,
  getAllPayments,
};
