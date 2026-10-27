const Room = require('../models/Room');
const Booking = require('../models/Booking');

// @desc    Get all rooms with filtering & search
// @route   GET /api/rooms
// @access  Public
const getAllRooms = async (req, res, next) => {
  try {
    const { type, minPrice, maxPrice, capacity, search } = req.query;
    const filter = {};

    if (type && type !== 'All') {
      filter.type = type;
    }

    if (capacity) {
      filter.capacity = { $gte: Number(capacity) };
    }

    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { roomNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const rooms = await Room.find(filter).sort({ pricePerNight: 1 });
    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get rooms available for given dates
// @route   GET /api/rooms/available
// @access  Public
const getAvailableRooms = async (req, res, next) => {
  try {
    const { checkIn, checkOut, capacity, type } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both checkIn and checkOut dates',
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date formats provided',
      });
    }

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be strictly after check-in date',
      });
    }

    // Find conflicting bookings:
    // Any active booking where (booking.checkInDate < reqCheckOut) AND (booking.checkOutDate > reqCheckIn)
    const conflictingBookings = await Booking.find({
      bookingStatus: { $ne: 'cancelled' },
      checkInDate: { $lt: checkOutDate },
      checkOutDate: { $gt: checkInDate },
    }).select('room');

    const bookedRoomIds = conflictingBookings.map((b) => b.room);

    const roomFilter = {
      _id: { $nin: bookedRoomIds },
      isAvailable: true,
    };

    if (capacity) {
      roomFilter.capacity = { $gte: Number(capacity) };
    }

    if (type && type !== 'All') {
      roomFilter.type = type;
    }

    const availableRooms = await Room.find(roomFilter).sort({ pricePerNight: 1 });

    res.status(200).json({
      success: true,
      count: availableRooms.length,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      rooms: availableRooms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room details
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.status(200).json({ success: true, room });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new room (Admin only)
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = async (req, res, next) => {
  try {
    const { roomNumber } = req.body;
    const existing = await Room.findOne({ roomNumber });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Room number ${roomNumber} already exists`,
      });
    }

    const room = await Room.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a room (Admin only)
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a room (Admin only)
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Room deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRooms,
  getAvailableRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
