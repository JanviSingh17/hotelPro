const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Room title is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Room type is required'],
      enum: ['Single', 'Double', 'Deluxe', 'Suite', 'Presidential'],
      default: 'Deluxe',
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [0, 'Price cannot be negative'],
    },
    capacity: {
      type: Number,
      required: [true, 'Guest capacity is required'],
      min: [1, 'Capacity must be at least 1 person'],
      default: 2,
    },
    amenities: {
      type: [String],
      default: ['High-Speed Wi-Fi', 'Air Conditioning', 'Flat-screen TV'],
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
      ],
    },
    description: {
      type: String,
      required: [true, 'Room description is required'],
    },
    floor: {
      type: Number,
      default: 1,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching rooms efficiently
roomSchema.index({ type: 1, pricePerNight: 1, capacity: 1 });

module.exports = mongoose.model('Room', roomSchema);
