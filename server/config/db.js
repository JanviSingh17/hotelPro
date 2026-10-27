const mongoose = require('mongoose');

const autoSeedIfEmpty = async () => {
  try {
    const Room = require('../models/Room');
    const count = await Room.countDocuments({});
    if (count === 0) {
      console.log('[MongoDB Auto-Seed] Database is empty. Seeding initial hotel suites, staff, and demo users...');
      const bcrypt = require('bcryptjs');
      const User = require('../models/User');
      const Staff = require('../models/Staff');
      const Booking = require('../models/Booking');
      const Payment = require('../models/Payment');

      const salt = await bcrypt.genSalt(10);
      const adminPassword = await bcrypt.hash('admin123', salt);
      const guestPassword = await bcrypt.hash('guest123', salt);

      const admin = await User.create({
        name: 'Eleanor Vance (General Manager)',
        email: 'admin@hotelpro.com',
        password: adminPassword,
        role: 'admin',
        phone: '+1 555 019 2831',
      });

      const guest = await User.create({
        name: 'James Harrison',
        email: 'guest@hotelpro.com',
        password: guestPassword,
        role: 'user',
        phone: '+1 555 014 9922',
      });

      await Staff.create([
        {
          name: 'Alexander Wright',
          email: 'alex.wright@hotelpro.com',
          phone: '+1 555 332 9901',
          position: 'Front Desk Officer',
          department: 'Front Office',
          shift: 'Morning (06:00 - 14:00)',
          status: 'Active',
          salary: 48000,
          assignedFloor: 1,
        },
        {
          name: 'Beatrice Morales',
          email: 'beatrice.m@hotelpro.com',
          phone: '+1 555 332 9902',
          position: 'Head Concierge',
          department: 'Front Office',
          shift: 'Evening (14:00 - 22:00)',
          status: 'Active',
          salary: 56000,
          assignedFloor: 1,
        },
        {
          name: 'Charles Sterling',
          email: 'charles.s@hotelpro.com',
          phone: '+1 555 332 9903',
          position: 'Executive Housekeeper',
          department: 'Housekeeping',
          shift: 'Morning (06:00 - 14:00)',
          status: 'Active',
          salary: 52000,
          assignedFloor: 2,
        },
      ]);

      const rooms = await Room.create([
        {
          roomNumber: '101',
          title: 'Grand Oceanfront Deluxe King',
          type: 'Deluxe',
          pricePerNight: 240,
          capacity: 2,
          amenities: ['High-Speed Wi-Fi', 'Panoramic Ocean Balcony', 'King Bed with Egyptian Linens', 'Rain Shower & Soaking Tub', 'Espresso Machine'],
          images: [
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
          ],
          description: 'Experience tranquility in our Grand Oceanfront Deluxe King room featuring uninterrupted views of the azure coast, custom furnishings, and a marble bath retreat.',
          floor: 1,
          isAvailable: true,
          rating: 4.9,
        },
        {
          roomNumber: '102',
          title: 'Garden View Superior Twin',
          type: 'Double',
          pricePerNight: 180,
          capacity: 2,
          amenities: ['High-Speed Wi-Fi', 'Private Garden Terrace', 'Twin Orthopedic Beds', 'En-suite Rainforest Shower'],
          images: [
            'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
          ],
          description: 'Overlooking the hotel’s private botanical gardens, this sunlit room blends minimalist organic aesthetics with restorative comfort.',
          floor: 1,
          isAvailable: true,
          rating: 4.75,
        },
        {
          roomNumber: '201',
          title: 'Executive Skyline Suite',
          type: 'Suite',
          pricePerNight: 380,
          capacity: 3,
          amenities: ['High-Speed Wi-Fi', 'Separate Living Lounge', 'Executive Work Desk', 'Walk-in Closet', 'Mini Bar'],
          images: [
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
          ],
          description: 'Crafted for discerning travelers and executives, this suite offers a spacious private lounge, soundproof panoramic windows, and access to the executive club.',
          floor: 2,
          isAvailable: true,
          rating: 4.95,
        },
        {
          roomNumber: '301',
          title: 'Imperial Presidential Penthouse',
          type: 'Presidential',
          pricePerNight: 750,
          capacity: 4,
          amenities: ['Private Heated Infinity Pool', '24/7 Dedicated Butler Service', 'Private Elevator Access', 'Chef Gourmet Kitchen'],
          images: [
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
          ],
          description: 'The pinnacle of hospitality. 2,400 sq.ft of royal grandeur atop the building with a private heated pool, master staterooms, and bespoke 24/7 butler service.',
          floor: 3,
          isAvailable: true,
          rating: 5.0,
        },
      ]);

      const booking = await Booking.create({
        user: guest._id,
        room: rooms[0]._id,
        guestName: guest.name,
        guestEmail: guest.email,
        guestPhone: guest.phone,
        checkInDate: new Date(Date.now() + 86400000 * 2),
        checkOutDate: new Date(Date.now() + 86400000 * 5),
        totalGuests: 2,
        totalNights: 3,
        totalPrice: rooms[0].pricePerNight * 3,
        bookingStatus: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'Credit Card',
        specialRequests: 'Arriving late at 8 PM.',
      });

      await Payment.create({
        booking: booking._id,
        user: guest._id,
        amount: booking.totalPrice,
        currency: 'USD',
        gateway: 'Stripe',
        paymentMethod: 'Credit Card',
        transactionId: 'TXN_' + Date.now(),
        status: 'succeeded',
        cardLast4: '4242',
      });

      console.log('[MongoDB Auto-Seed] Database populated successfully with luxury rooms & demo credentials.');
    }
  } catch (err) {
    console.error('[MongoDB Auto-Seed Error]:', err.message);
  }
};

let memoryServerInstance = null;

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hotelpro';
  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    await autoSeedIfEmpty();
  } catch (error) {
    console.warn(`[MongoDB Notice] Local/Primary MongoDB not reachable (${error.message}).`);
    try {
      console.log('[MongoDB Fallback] Starting in-memory MongoDB server for instant zero-config launch...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServerInstance = await MongoMemoryServer.create();
      const fallbackUri = memoryServerInstance.getUri();
      const conn = await mongoose.connect(fallbackUri);
      console.log(`[MongoDB Fallback] Connected to in-memory database: ${fallbackUri}`);
      await autoSeedIfEmpty();
    } catch (fallbackError) {
      console.error(`[MongoDB Error] Fallback failed: ${fallbackError.message}`);
    }
  }
};

module.exports = connectDB;
