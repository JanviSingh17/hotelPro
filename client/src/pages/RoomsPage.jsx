import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal';
import { Search, Filter, RefreshCw, AlertCircle } from 'lucide-react';

const RoomsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || 'All');
  const [capacity, setCapacity] = useState(searchParams.get('capacity') || '1');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '1000');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');

  // Booking Modal
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);

    try {
      let res;
      // If dates provided, use availability check endpoint
      if (checkIn && checkOut) {
        res = await API.get('/rooms/available', {
          params: {
            checkIn,
            checkOut,
            capacity: Number(capacity) || 1,
            type: type !== 'All' ? type : undefined,
          },
        });
      } else {
        res = await API.get('/rooms', {
          params: {
            type: type !== 'All' ? type : undefined,
            capacity: Number(capacity) || undefined,
            maxPrice: Number(maxPrice) || undefined,
            search: search.trim() || undefined,
          },
        });
      }
      setRooms(res.data.rooms || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [type, capacity, maxPrice]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRooms();
  };

  const handleResetFilters = () => {
    setSearch('');
    setType('All');
    setCapacity('1');
    setMaxPrice('1000');
    setCheckIn('');
    setCheckOut('');
    setSearchParams({});
    setTimeout(fetchRooms, 50);
  };

  return (
    <div className="py-5">
      <div className="container">
        {/* Page Title */}
        <div className="mb-4 text-center text-md-start">
          <span className="text-warning fw-bold text-uppercase small">Luxury Accommodations</span>
          <h1 className="font-serif fw-bold display-6 mt-1">Explore Rooms & Suites</h1>
          <p className="text-muted">
            Find the perfect retreat with customizable dates, amenities, and guest capacities.
          </p>
        </div>

        {/* Filter Card */}
        <div className="card shadow-sm border-0 rounded-4 p-4 mb-5">
          <form onSubmit={handleSearchSubmit} className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label small fw-bold text-muted">Keyword Search</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <Search size={16} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Ocean, Suite, Penthouse..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-2">
              <label className="form-label small fw-bold text-muted">Room Type</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
                <option value="Presidential">Presidential</option>
                <option value="Double">Double</option>
                <option value="Single">Single</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label small fw-bold text-muted">Min Guests</label>
              <select
                className="form-select"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              >
                <option value="1">1+ Guest</option>
                <option value="2">2+ Guests</option>
                <option value="3">3+ Guests</option>
                <option value="4">4+ Guests</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-bold text-muted d-flex justify-content-between">
                <span>Max Price / Night</span>
                <span className="text-primary fw-bold">${maxPrice}</span>
              </label>
              <input
                type="range"
                className="form-range"
                min="100"
                max="1000"
                step="25"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <div className="col-md-2 d-flex gap-2">
              <button type="submit" className="btn btn-gold w-100 py-2 fw-semibold">
                Apply
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary py-2"
                onClick={handleResetFilters}
                title="Reset filters"
              >
                <RefreshCw size={18} />
              </button>
            </div>

            {/* Optional Specific Date Availability */}
            <div className="col-12 pt-2 border-top">
              <div className="row g-3">
                <div className="col-md-6 col-lg-3">
                  <label className="form-label small fw-bold text-muted">
                    Filter by Check-in Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>
                <div className="col-md-6 col-lg-3">
                  <label className="form-label small fw-bold text-muted">
                    Filter by Check-out Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={checkOut}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
                <div className="col-lg-6 d-flex align-items-end">
                  <span className="text-muted small">
                    {checkIn && checkOut
                      ? '⚡ Checking real-time room availability for selected dates'
                      : '💡 Set dates above to verify live calendar availability'}
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Results Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="fw-semibold text-muted">
            Found <strong className="text-dark">{rooms.length}</strong> available room
            {rooms.length !== 1 ? 's' : ''}
          </span>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Room Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
            <div className="text-muted mt-2">Loading hotel suites...</div>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 border">
            <h4 className="fw-bold mb-2">No Rooms Matched Your Criteria</h4>
            <p className="text-muted mb-4">
              Try adjusting your price range, guest count, or clearing specific dates.
            </p>
            <button className="btn btn-outline-dark" onClick={handleResetFilters}>
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {rooms.map((room) => (
              <div key={room._id} className="col-lg-4 col-md-6">
                <RoomCard
                  room={room}
                  onBookNow={(r) => {
                    setSelectedRoom(r);
                    setShowModal(true);
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Booking Modal */}
        <BookingModal
          room={selectedRoom}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    </div>
  );
};

export default RoomsPage;
