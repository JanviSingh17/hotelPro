const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Staff = require('../models/Staff');
const Payment = require('../models/Payment');

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hotelpro';
    console.log(`[Seeder] Connecting to MongoDB: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('[Seeder] Connected successfully!');

    // Clear old data
    await User.deleteMany();
    await Room.deleteMany();
    await Booking.deleteMany();
    await Staff.deleteMany();
    await Payment.deleteMany();
    console.log('[Seeder] Cleared previous Users, Rooms, Bookings, Staff, and Payments.');

    // Seed Users
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

    const guest1 = await User.create({
      name: 'James Harrison',
      email: 'guest@hotelpro.com',
      password: guestPassword,
      role: 'user',
      phone: '+1 555 014 9922',
    });

    const guest2 = await User.create({
      name: 'Sophia Martinez',
      email: 'sophia@example.com',
      password: guestPassword,
      role: 'user',
      phone: '+1 555 022 8844',
    });

    console.log(`[Seeder] Created Admin (${admin.email}) and Guests (${guest1.email}, ${guest2.email})`);

    // Seed Staff
    const staffMembers = await Staff.create([
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
      {
        name: 'Diana Rosslyn',
        email: 'diana.r@hotelpro.com',
        phone: '+1 555 332 9904',
        position: 'Operations Manager',
        department: 'Operations',
        shift: 'Flexible',
        status: 'Active',
        salary: 78000,
        assignedFloor: 3,
      },
      {
        name: 'Evan Vance',
        email: 'evan.v@hotelpro.com',
        phone: '+1 555 332 9905',
        position: 'Maintenance Engineer',
        department: 'Maintenance',
        shift: 'Night (22:00 - 06:00)',
        status: 'Active',
        salary: 50000,
        assignedFloor: 1,
      },
    ]);
    console.log(`[Seeder] Created ${staffMembers.length} Staff members.`);

    // Seed Rooms
    const roomsData = [
      {
        roomNumber: '101',
        title: 'Grand Oceanfront Deluxe King',
        type: 'Deluxe',
        pricePerNight: 240,
        capacity: 2,
        amenities: [
          'High-Speed Wi-Fi',
          'Panoramic Ocean Balcony',
          'King Bed with Egyptian Linens',
          'Rain Shower & Soaking Tub',
          'Espresso Machine',
          'Smart TV 55"',
        ],
        images: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
        ],
        description:
          'Experience tranquility in our Grand Oceanfront Deluxe King room featuring uninterrupted views of the azure coast, custom furnishings, and a marble bath retreat.',
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
        amenities: [
          'High-Speed Wi-Fi',
          'Private Garden Terrace',
          'Twin Orthopedic Beds',
          'En-suite Rainforest Shower',
          'Organic Toiletries',
          'Mini Refrigerator',
        ],
        images: [
          'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
        ],
        description:
          'Overlooking the hotel’s private botanical gardens, this sunlit room blends minimalist organic aesthetics with restorative comfort.',
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
        amenities: [
          'High-Speed Wi-Fi',
          'Separate Living Lounge',
          'Executive Work Desk',
          'Walk-in Closet',
          'Mini Bar & Wine Cellar',
          'Complimentary Breakfast',
        ],
        images: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
        ],
        description:
          'Crafted for discerning travelers and executives, this suite offers a spacious private lounge, soundproof panoramic windows, and access to the executive club.',
        floor: 2,
        isAvailable: true,
        rating: 4.95,
      },
      {
        roomNumber: '202',
        title: 'Cozy Urban Sanctuary',
        type: 'Single',
        pricePerNight: 120,
        capacity: 1,
        amenities: [
          'High-Speed Wi-Fi',
          'Ergonomic Workstation',
          'Plush Queen Bed',
          'Smart Climate Control',
          'Nespresso Bar',
        ],
        images: [
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
        ],
        description:
          'Ideal for solo explorers and business travelers seeking quiet efficiency and luxury comfort in the vibrant city center.',
        floor: 2,
        isAvailable: true,
        rating: 4.65,
      },
      {
        roomNumber: '301',
        title: 'Imperial Presidential Penthouse',
        type: 'Presidential',
        pricePerNight: 750,
        capacity: 4,
        amenities: [
          'Private Heated Infinity Pool',
          '24/7 Dedicated Butler Service',
          'Private Elevator Access',
          'Chef Gourmet Kitchen',
          'Bose Surround Sound System',
          'Chauffeur Airport Transfer',
        ],
        images: [
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
        ],
        description:
          'The pinnacle of hospitality. 2,400 sq.ft of royal grandeur atop the building with a private heated pool, master staterooms, and bespoke 24/7 butler service.',
        floor: 3,
        isAvailable: true,
        rating: 5.0,
      },
      {
        roomNumber: '302',
        title: 'Royal Horizon Deluxe Suite',
        type: 'Suite',
        pricePerNight: 420,
        capacity: 3,
        amenities: [
          'High-Speed Wi-Fi',
          'Corner Wraparound Balcony',
          'Jacuzzi Bath with City View',
          'Complimentary High Tea',
          'Smart Home Automation',
        ],
        images: [
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
        ],
        description:
          'Perched high on the third floor with a corner wraparound balcony offering golden hour panoramas over the city skyline.',
        floor: 3,
        isAvailable: true,
        rating: 4.88,
      },
    ];

    const seededRooms = await Room.create(roomsData);
    console.log(`[Seeder] Seeded ${seededRooms.length} luxury hotel rooms.`);

    // Seed sample Bookings
    const today = new Date();
    const in3Days = new Date(today);
    in3Days.setDate(today.getDate() + 3);

    const in7Days = new Date(today);
    in7Days.setDate(today.getDate() + 7);

    const in10Days = new Date(today);
    in10Days.setDate(today.getDate() + 10);

    const booking1 = await Booking.create({
      user: guest1._id,
      room: seededRooms[0]._id,
      guestName: guest1.name,
      guestEmail: guest1.email,
      guestPhone: guest1.phone,
      checkInDate: in3Days,
      checkOutDate: in7Days,
      totalGuests: 2,
      totalNights: 4,
      totalPrice: seededRooms[0].pricePerNight * 4,
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'Credit Card',
      specialRequests: 'High floor preferred, arriving late at 9 PM.',
    });

    const booking2 = await Booking.create({
      user: guest2._id,
      room: seededRooms[2]._id,
      guestName: guest2.name,
      guestEmail: guest2.email,
      guestPhone: guest2.phone,
      checkInDate: in7Days,
      checkOutDate: in10Days,
      totalGuests: 2,
      totalNights: 3,
      totalPrice: seededRooms[2].pricePerNight * 3,
      bookingStatus: 'checked-in',
      paymentStatus: 'paid',
      paymentMethod: 'UPI',
      specialRequests: 'Vegan breakfast requested each morning.',
    });

    // Seed corresponding payments
    await Payment.create([
      {
        booking: booking1._id,
        user: guest1._id,
        amount: booking1.totalPrice,
        currency: 'USD',
        gateway: 'Stripe',
        paymentMethod: 'Credit Card',
        transactionId: 'TXN_STRIPE_' + Date.now() + '_101',
        status: 'succeeded',
        cardLast4: '4242',
      },
      {
        booking: booking2._id,
        user: guest2._id,
        amount: booking2.totalPrice,
        currency: 'USD',
        gateway: 'Razorpay',
        paymentMethod: 'UPI',
        transactionId: 'TXN_RZP_' + Date.now() + '_102',
        status: 'succeeded',
        cardLast4: '0000',
      },
    ]);

    console.log('[Seeder] Seeded sample bookings and payment transactions.');
    console.log('[Seeder] Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedData();
