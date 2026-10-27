# HotelPro - Complete Hotel Booking & Management Solution

> Built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js)

HotelPro is a comprehensive, production-ready Hotel Management & Booking Solution designed to streamline hotel operations with a secure, scalable backend and an elegant, responsive guest and administrator interface.

---

## 🌟 Key Highlights & Capabilities

### 🛎️ Guest Experience
- **Interactive Room Catalog**: Browse suites and rooms with high-resolution imagery, detailed specifications, capacity, and luxury amenities.
- **Dynamic Search & Filtering**: Filter by check-in / check-out dates (with automated date collision prevention), room category (Presidential, Suite, Deluxe, Double, Single), price slider, and guest count.
- **Seamless Booking Flow**: Modal with night calculations, tax computation, guest info auto-fill, and multi-gateway payment options (Credit Card, UPI, Net Banking, Pay at Desk).
- **Reservation Management**: Guests can view active and past stays, view and print official check-in vouchers, or cancel reservations with automated refund tracking.

### 🛡️ Administrative Executive Suite
- **Interactive Analytics Dashboard**:
  - Live KPI cards: Total Revenue, Occupancy Rate %, Active Bookings, and Total Inventory.
  - Revenue & Occupancy trend charts and room distribution breakdowns.
- **Room Inventory Management**: Add new rooms, update pricing and descriptions, toggle maintenance mode, and delete listings.
- **Reservations Ledger**: Complete booking registry with search, filtering, and guest check-in/check-out workflow actions.
- **Staff Roster Management**: Organize hotel staff across departments (Front Office, Housekeeping, Operations, Maintenance, Security), assign shifts, floors, and track employment status.
- **Guest Profiles Directory**: Directory of registered guests and reservation histories.

---

## 📁 Project Architecture

```
hotelpro/
├── package.json               # Root scripts for concurrently running client & server
├── README.md
├── server/                    # Node.js + Express REST API
│   ├── config/
│   │   └── db.js              # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── adminController.js # Analytics, staff, and guest management
│   │   ├── authController.js  # JWT auth, register, login, profile
│   │   ├── bookingController.js # Reservations, date collision check, cancellations
│   │   └── roomController.js  # Room catalog, search & date availability filter
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification and admin role protection
│   │   └── errorMiddleware.js # Express 404 and global error handlers
│   ├── models/
│   │   ├── Booking.js         # Booking schema with date ranges & payment details
│   │   ├── Payment.js         # Payment transactions (Stripe/Razorpay simulated)
│   │   ├── Room.js            # Room inventory schema with amenities & images
│   │   ├── Staff.js           # Staff roster schema (department, shift, status)
│   │   └── User.js            # User accounts with bcrypt hashing & roles
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── roomRoutes.js
│   ├── seeder/
│   │   └── seed.js            # Database seeder with sample rooms, staff, & bookings
│   ├── .env                   # Environment configuration
│   ├── .env.example
│   ├── package.json
│   └── server.js              # Express app bootstrap
│
└── client/                    # React (Vite) Single Page Application
    ├── index.html             # Bootstrap 5 and Google Fonts integration
    ├── vite.config.js         # Vite configuration with API proxy to port 5000
    ├── package.json
    └── src/
        ├── components/
        │   ├── BookingModal.jsx   # Interactive date-picker & payment checkout
        │   ├── Footer.jsx         # Footer with newsletter and hotel information
        │   ├── Navbar.jsx         # Navigation bar with role-aware actions
        │   ├── ProtectedRoute.jsx # Role-based route guard
        │   └── RoomCard.jsx       # Card component for accommodations
        ├── context/
        │   └── AuthContext.jsx    # Authentication & session provider
        ├── pages/
        │   ├── AdminDashboardPage.jsx # Full management & analytics dashboard
        │   ├── HomePage.jsx       # Landing page with hero, search, & featured suites
        │   ├── LoginPage.jsx      # Sign-in page with quick-demo buttons
        │   ├── MyBookingsPage.jsx # Guest reservations & printable vouchers
        │   ├── RegisterPage.jsx   # Guest registration
        │   ├── RoomDetailsPage.jsx# Single room view with gallery & amenities
        │   └── RoomsPage.jsx      # Search catalog with price and date filters
        ├── services/
        │   └── api.js             # Axios instance with JWT interceptors
        ├── App.jsx                # Route definitions
        ├── index.css              # Custom luxury CSS styling & color tokens
        └── main.jsx               # React entry point
```

---

## 🛠️ System Requirements & Technologies

- **Node.js**: `v16.0.0` or higher
- **npm**: `v8.0.0` or higher
- **Database**: MongoDB (Local instance at `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)
- **Frontend**: React 18, Vite, Bootstrap 5, Lucide React, Axios, React Router v6
- **Backend**: Express 4, Mongoose 8, JSON Web Token (JWT), Bcrypt.js, CORS, Dotenv

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
Run the command below from the project root:
```bash
npm run install:all
```
*(Or install manually in each folder: `cd server && npm install` and `cd client && npm install`)*

### 2. Configure Environment Variables
Verify or edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/hotelpro
JWT_SECRET=hotelpro_super_secret_jwt_key_2026_experience
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 3. Seed Database with Initial Data
Populate the database with luxury rooms, sample staff, bookings, and demo users:
```bash
npm run seed
```

### 4. Start the Application
Run server and client concurrently:

**In Terminal 1 (Backend API):**
```bash
npm run server
# Runs on http://localhost:5000
```

**In Terminal 2 (React Frontend):**
```bash
npm run client
# Runs on http://localhost:5173
```

---

## 🔑 Demo Login Credentials

The login page provides **Quick Sign-In** demo buttons for instant access:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Hotel Admin** | `admin@hotelpro.com` | `admin123` | Full access to Management Portal, Inventory, Staff, and Bookings Ledger |
| **Guest User** | `guest@hotelpro.com` | `guest123` | Room reservations, booking history, voucher generation |

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new guest account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated user profile |

### Rooms (`/api/rooms`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/rooms` | Public | List rooms with filters (price, type, capacity, search) |
| `GET` | `/api/rooms/available` | Public | Check room availability for date range |
| `GET` | `/api/rooms/:id` | Public | Retrieve single room details |
| `POST` | `/api/rooms` | Admin | Create a new room |
| `PUT` | `/api/rooms/:id` | Admin | Update room details & availability |
| `DELETE` | `/api/rooms/:id` | Admin | Delete room from inventory |

### Bookings (`/api/bookings`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Private | Reserve room with collision detection |
| `GET` | `/api/bookings/my-bookings` | Private | Get current user's reservations |
| `GET` | `/api/bookings/:id` | Private | Get single booking details |
| `PUT` | `/api/bookings/:id/cancel` | Private | Cancel reservation & issue refund |
| `GET` | `/api/bookings` | Admin | Retrieve all bookings across hotel |
| `PUT` | `/api/bookings/:id/status` | Admin | Update booking status & payment status |

### Admin Operations (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Admin | Revenue KPIs, occupancy %, monthly analytics |
| `GET` | `/api/admin/staff` | Admin | Staff roster list |
| `POST` | `/api/admin/staff` | Admin | Add staff member |
| `PUT` | `/api/admin/staff/:id` | Admin | Update staff member |
| `DELETE` | `/api/admin/staff/:id` | Admin | Remove staff member |
| `GET` | `/api/admin/guests` | Admin | Registered guests with booking frequency |
| `GET` | `/api/admin/payments` | Admin | Transaction history across gateways |

