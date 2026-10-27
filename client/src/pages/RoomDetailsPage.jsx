import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import BookingModal from '../components/BookingModal';
import {
  Users,
  Star,
  CheckCircle2,
  Calendar,
  Layers,
  ShieldCheck,
  ArrowLeft,
  Clock,
  Sparkles,
} from 'lucide-react';

const RoomDetailsPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await API.get(`/rooms/${id}`);
        setRoom(res.data.room);
      } catch (err) {
        setError('Room not found or server error');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5 my-5">
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="container py-5 text-center">
        <h3>{error || 'Room not found'}</h3>
        <Link to="/rooms" className="btn btn-gold mt-3">
          Back to Rooms
        </Link>
      </div>
    );
  }

  const primaryImage =
    room.images && room.images.length > 0
      ? room.images[0]
      : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="py-5">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div className="mb-4">
          <Link
            to="/rooms"
            className="text-decoration-none text-muted d-inline-flex align-items-center gap-1 small fw-semibold"
          >
            <ArrowLeft size={16} /> Back to All Accommodations
          </Link>
        </div>

        {/* Title & Key Meta */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-warning text-dark fw-bold">{room.type}</span>
              <span className="badge bg-light text-muted border">Room #{room.roomNumber}</span>
              <span className="badge bg-light text-muted border">Floor {room.floor || 1}</span>
            </div>
            <h1 className="font-serif fw-bold display-5 text-dark mb-0">{room.title}</h1>
          </div>

          <div className="mt-3 mt-md-0 text-md-end">
            <div className="d-flex align-items-center gap-1 text-warning fs-5 fw-bold justify-content-md-end">
              <Star size={20} fill="currentColor" />
              <span>{room.rating || 4.8} / 5.0</span>
            </div>
            <span className="small text-muted">Verified Guest Reviews</span>
          </div>
        </div>

        {/* Image Showcase */}
        <div className="rounded-4 overflow-hidden shadow-sm mb-5" style={{ maxHeight: '500px' }}>
          <img
            src={primaryImage}
            alt={room.title}
            className="w-100 h-100 object-fit-cover"
            style={{ objectFit: 'cover', maxHeight: '500px' }}
          />
        </div>

        {/* Content & Booking Sticky Box */}
        <div className="row g-5">
          <div className="col-lg-8">
            <h3 className="font-serif fw-bold mb-3">Room Overview</h3>
            <p className="lead text-secondary fs-6 mb-4">{room.description}</p>

            {/* Quick Specs */}
            <div className="row g-3 p-4 bg-white rounded-4 border mb-5">
              <div className="col-sm-4 d-flex align-items-center gap-3">
                <div className="p-3 bg-light rounded-circle text-primary">
                  <Users size={24} />
                </div>
                <div>
                  <div className="small text-muted">Guest Capacity</div>
                  <div className="fw-bold">{room.capacity} Persons</div>
                </div>
              </div>

              <div className="col-sm-4 d-flex align-items-center gap-3">
                <div className="p-3 bg-light rounded-circle text-primary">
                  <Layers size={24} />
                </div>
                <div>
                  <div className="small text-muted">Room Class</div>
                  <div className="fw-bold">{room.type} Suite</div>
                </div>
              </div>

              <div className="col-sm-4 d-flex align-items-center gap-3">
                <div className="p-3 bg-light rounded-circle text-primary">
                  <Clock size={24} />
                </div>
                <div>
                  <div className="small text-muted">Check-in Time</div>
                  <div className="fw-bold">2:00 PM (Flexible)</div>
                </div>
              </div>
            </div>

            {/* Amenities Grid */}
            <h4 className="font-serif fw-bold mb-3">Included Amenities & Services</h4>
            <div className="row g-3 mb-5">
              {room.amenities.map((amenity, index) => (
                <div key={index} className="col-sm-6">
                  <div className="d-flex align-items-center gap-2 p-3 bg-white rounded-3 border">
                    <CheckCircle2 size={18} className="text-success flex-shrink-0" />
                    <span className="small fw-semibold">{amenity}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Hotel Policies */}
            <h4 className="font-serif fw-bold mb-3">Stay Policies & Guarantees</h4>
            <div className="card border-0 bg-light p-4 rounded-4 mb-4">
              <ul className="mb-0 small text-secondary">
                <li className="mb-2">
                  <strong>Free Cancellation:</strong> Up to 24 hours before your scheduled arrival date.
                </li>
                <li className="mb-2">
                  <strong>Safety Protocol:</strong> High-temperature sanitized linens and contact-free check-in available.
                </li>
                <li>
                  <strong>Special Requests:</strong> Early check-in or high floor preference can be indicated upon reservation.
                </li>
              </ul>
            </div>
          </div>

          {/* Sticky Booking Card */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 rounded-4 p-4 sticky-top" style={{ top: '100px' }}>
              <div className="d-flex justify-content-between align-items-baseline mb-3">
                <div>
                  <span className="fs-3 fw-bold text-dark">${room.pricePerNight}</span>
                  <span className="text-muted small"> / night</span>
                </div>
                <span className="badge bg-success-subtle text-success border">Instant Booking</span>
              </div>

              <p className="small text-muted mb-4">
                Best price guarantee when reserving directly through the HotelPro system.
              </p>

              <button
                className="btn btn-gold btn-lg w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 mb-3"
                onClick={() => setShowModal(true)}
              >
                <Sparkles size={18} /> Reserve This Suite
              </button>

              <div className="d-flex align-items-center justify-content-center gap-2 text-muted small">
                <ShieldCheck size={16} className="text-success" /> No reservation fees &bull; Encrypted
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        <BookingModal
          room={room}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    </div>
  );
};

export default RoomDetailsPage;
