import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal';
import {
  Calendar,
  Users,
  Search,
  Sparkles,
  Wifi,
  Coffee,
  Waves,
  Utensils,
  ShieldCheck,
  Clock,
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomType, setRoomType] = useState('All');
  const [guests, setGuests] = useState('1');

  // Booking modal
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await API.get('/rooms');
        setFeaturedRooms(res.data.rooms.slice(0, 3));
      } catch (err) {
        console.error('Failed to load featured rooms', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (checkIn) query.append('checkIn', checkIn);
    if (checkOut) query.append('checkOut', checkOut);
    if (roomType !== 'All') query.append('type', roomType);
    if (guests) query.append('capacity', guests);
    navigate(`/rooms?${query.toString()}`);
  };

  const handleBookNow = (room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  return (
    <div>
      {/* Hero Header */}
      <section className="hero-wrapper text-center">
        <div className="container py-4">
          <div className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3 d-inline-flex align-items-center gap-1">
            <Sparkles size={16} /> Welcome to World-Class Hospitality
          </div>
          <h1 className="font-serif display-4 fw-bold mb-3 text-white">
            Experience Elegance, Redefined.
          </h1>
          <p className="lead text-light mb-4 mx-auto" style={{ maxWidth: '680px' }}>
            Immerse yourself in unparalleled luxury, personalized concierge services, and scenic vistas. Effortlessly book your perfect stay today.
          </p>
        </div>
      </section>

      {/* Floating Booking Search Bar */}
      <div className="container">
        <div className="search-floating-box">
          <form onSubmit={handleSearchSubmit} className="row g-3 align-items-end">
            <div className="col-lg-3 col-md-6">
              <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                <Calendar size={15} /> Check-in Date
              </label>
              <input
                type="date"
                className="form-control form-control-lg fs-6"
                value={checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>

            <div className="col-lg-3 col-md-6">
              <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                <Calendar size={15} /> Check-out Date
              </label>
              <input
                type="date"
                className="form-control form-control-lg fs-6"
                value={checkOut}
                min={checkIn || new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>

            <div className="col-lg-2 col-md-6">
              <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                <Users size={15} /> Guests
              </label>
              <select
                className="form-select form-select-lg fs-6"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              >
                <option value="1">1 Adult</option>
                <option value="2">2 Adults</option>
                <option value="3">3 Adults</option>
                <option value="4">4+ Adults</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-6">
              <label className="form-label small fw-bold text-muted">Room Category</label>
              <select
                className="form-select form-select-lg fs-6"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
                <option value="Presidential">Presidential</option>
                <option value="Double">Double</option>
                <option value="Single">Single</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-12">
              <button
                type="submit"
                className="btn btn-gold btn-lg w-100 d-flex align-items-center justify-content-center gap-2 fs-6 fw-bold"
              >
                <Search size={18} /> Find Rooms
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Featured Suites Section */}
      <section className="py-5 my-3">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="text-warning fw-bold text-uppercase small letter-spacing">
                Curated Selections
              </span>
              <h2 className="font-serif fw-bold display-6 text-dark mt-1">Featured Rooms & Suites</h2>
            </div>
            <button
              onClick={() => navigate('/rooms')}
              className="btn btn-outline-dark mt-3 mt-md-0 fw-semibold"
            >
              View All Accommodations &rarr;
            </button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status"></div>
            </div>
          ) : (
            <div className="row g-4">
              {featuredRooms.map((room) => (
                <div key={room._id} className="col-lg-4 col-md-6">
                  <RoomCard room={room} onBookNow={handleBookNow} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Hotel Amenities & Highlights */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-warning fw-bold text-uppercase small">Premium Facilities</span>
            <h2 className="font-serif fw-bold display-6 mt-1">Crafted for Pure Indulgence</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Every element of HotelPro is engineered to deliver seamless relaxation and elite hospitality.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 rounded-4 bg-light h-100 border">
                <div className="text-warning mb-3">
                  <Waves size={36} />
                </div>
                <h5 className="fw-bold mb-2">Infinity Ocean Pool</h5>
                <p className="text-muted small mb-0">
                  Heated year-round saltwater infinity pool with uninterrupted views of the sunset and private cabanas.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-4 bg-light h-100 border">
                <div className="text-warning mb-3">
                  <Utensils size={36} />
                </div>
                <h5 className="fw-bold mb-2">Michelin Star Dining</h5>
                <p className="text-muted small mb-0">
                  Three in-house dining pavilions led by renowned culinary masters, pairing farm-to-table cuisine with vintage wines.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-4 bg-light h-100 border">
                <div className="text-warning mb-3">
                  <Clock size={36} />
                </div>
                <h5 className="fw-bold mb-2">24/7 Digital Concierge</h5>
                <p className="text-muted small mb-0">
                  Instant bookings, room service requests, and customized itinerary planning at your fingertips.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        room={selectedRoom}
        show={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
    </div>
  );
};

export default HomePage;
