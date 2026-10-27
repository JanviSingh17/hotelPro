import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import {
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Receipt,
  FileText,
  Hotel,
  ArrowRight,
  ShieldCheck,
  Users,
} from 'lucide-react';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const res = await API.get('/bookings/my-bookings');
      setBookings(res.data.bookings);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation? A refund will be initiated.')) {
      return;
    }
    setCancellingId(id);
    try {
      await API.put(`/bookings/${id}/cancel`);
      fetchMyBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel reservation');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['confirmed', 'checked-in'].includes(b.bookingStatus);
    if (activeTab === 'completed') return b.bookingStatus === 'checked-out';
    if (activeTab === 'cancelled') return b.bookingStatus === 'cancelled';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 py-1 px-2 rounded-pill">Confirmed</span>;
      case 'checked-in':
        return <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 py-1 px-2 rounded-pill">Checked In</span>;
      case 'checked-out':
        return <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 py-1 px-2 rounded-pill">Completed</span>;
      case 'cancelled':
        return <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 py-1 px-2 rounded-pill">Cancelled</span>;
      default:
        return <span className="badge bg-light text-dark py-1 px-2">{status}</span>;
    }
  };

  return (
    <div className="py-5 bg-light" style={{ minHeight: '85vh' }}>
      <div className="container py-3">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <h2 className="font-serif fw-bold text-dark mb-1">My Reservations</h2>
            <p className="text-muted small mb-0">Track and manage your upcoming and past luxury stays</p>
          </div>
          <Link to="/rooms" className="btn btn-gold d-flex align-items-center gap-2">
            <Hotel size={18} /> Book Another Stay
          </Link>
        </div>

        {/* Tab Filters */}
        <div className="d-flex gap-2 border-bottom pb-3 mb-4 flex-wrap">
          <button
            className={`btn btn-sm rounded-pill px-3 ${activeTab === 'all' ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTab('all')}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            className={`btn btn-sm rounded-pill px-3 ${activeTab === 'active' ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTab('active')}
          >
            Active & Upcoming
          </button>
          <button
            className={`btn btn-sm rounded-pill px-3 ${activeTab === 'completed' ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed Stays
          </button>
          <button
            className={`btn btn-sm rounded-pill px-3 ${activeTab === 'cancelled' ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-5 my-5">
            <div className="spinner-border text-warning" role="status"></div>
            <p className="text-muted small mt-2">Loading reservations...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBookings.length === 0 && (
          <div className="card shadow-sm border-0 rounded-4 text-center p-5 my-4">
            <div className="mb-3 text-muted">
              <Calendar size={56} className="text-secondary opacity-50" />
            </div>
            <h4 className="fw-bold mb-2 font-serif">No reservations found</h4>
            <p className="text-muted small mx-auto" style={{ maxWidth: '420px' }}>
              You don't have any bookings matching this view. Plan your next unforgettable getaway with HotelPro.
            </p>
            <div>
              <Link to="/rooms" className="btn btn-gold mt-3 px-4">
                Explore Available Rooms <ArrowRight size={18} className="ms-1" />
              </Link>
            </div>
          </div>
        )}

        {/* Bookings List */}
        {!loading && filteredBookings.length > 0 && (
          <div className="row g-4">
            {filteredBookings.map((b) => (
              <div key={b._id} className="col-12">
                <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                  <div className="row g-0">
                    <div className="col-md-4 col-lg-3 position-relative">
                      <img
                        src={
                          b.room?.images?.[0] ||
                          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={b.room?.title || 'Hotel Room'}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover', minHeight: '220px' }}
                      />
                      <div className="position-absolute top-0 start-0 m-3">
                        <span className="badge bg-dark bg-opacity-75 text-white py-1 px-2 rounded-pill small">
                          Room #{b.room?.roomNumber || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="col-md-8 col-lg-9 p-4 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                          <div>
                            <span className="badge bg-warning bg-opacity-10 text-warning text-dark fw-semibold me-2 mb-1">
                              {b.room?.type || 'Luxury'}
                            </span>
                            <h4 className="fw-bold mb-1 font-serif text-dark">{b.room?.title || 'Luxury Suite'}</h4>
                            <p className="text-muted small mb-0">Booking Ref: <code className="text-dark fw-bold">#{b._id.slice(-8).toUpperCase()}</code></p>
                          </div>
                          <div>{getStatusBadge(b.bookingStatus)}</div>
                        </div>

                        <div className="row g-3 my-2 pt-2 border-top">
                          <div className="col-6 col-sm-3">
                            <span className="text-muted small d-block">Check-In</span>
                            <span className="fw-semibold text-dark">
                              {new Date(b.checkInDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="col-6 col-sm-3">
                            <span className="text-muted small d-block">Check-Out</span>
                            <span className="fw-semibold text-dark">
                              {new Date(b.checkOutDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="col-6 col-sm-3">
                            <span className="text-muted small d-block">Duration & Guests</span>
                            <span className="fw-semibold text-dark">
                              {b.totalNights} {b.totalNights === 1 ? 'Night' : 'Nights'} • {b.totalGuests} Guests
                            </span>
                          </div>
                          <div className="col-6 col-sm-3">
                            <span className="text-muted small d-block">Total Paid</span>
                            <span className="fw-bold text-success fs-5">${b.totalPrice}</span>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex flex-wrap justify-content-between align-items-center pt-3 border-top gap-2 mt-3">
                        <div className="small text-muted d-flex align-items-center gap-2">
                          <CreditCard size={16} /> Paid via {b.paymentMethod} •{' '}
                          <span className={b.paymentStatus === 'paid' ? 'text-success fw-semibold' : 'text-danger fw-semibold'}>
                            {b.paymentStatus.toUpperCase()}
                          </span>
                        </div>

                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-outline-dark btn-sm d-flex align-items-center gap-1 rounded-pill px-3"
                            onClick={() => setSelectedVoucher(b)}
                          >
                            <Receipt size={16} /> View Voucher
                          </button>

                          {['confirmed', 'checked-in'].includes(b.bookingStatus) && (
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm rounded-pill px-3"
                              disabled={cancellingId === b._id}
                              onClick={() => handleCancelBooking(b._id)}
                            >
                              {cancellingId === b._id ? 'Cancelling...' : 'Cancel Stay'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Voucher Modal */}
        {selectedVoucher && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 1060 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 rounded-4 shadow-lg p-4">
                <div className="text-center pb-3 border-bottom">
                  <div className="d-inline-flex p-2 rounded-circle bg-warning bg-opacity-10 text-warning mb-2">
                    <Hotel size={32} />
                  </div>
                  <h4 className="fw-bold font-serif mb-1">HotelPro Official Voucher</h4>
                  <p className="small text-muted mb-0">Booking Confirmation & Check-In Pass</p>
                </div>

                <div className="py-3">
                  <div className="bg-light p-3 rounded-3 mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="small text-muted">Reservation ID</span>
                      <strong className="small">#{selectedVoucher._id.toUpperCase()}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="small text-muted">Guest Name</span>
                      <strong className="small">{selectedVoucher.guestName}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="small text-muted">Room Type & No.</span>
                      <strong className="small">
                        {selectedVoucher.room?.title} (#{selectedVoucher.room?.roomNumber})
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="small text-muted">Check-In</span>
                      <strong className="small">{new Date(selectedVoucher.checkInDate).toDateString()}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="small text-muted">Check-Out</span>
                      <strong className="small">{new Date(selectedVoucher.checkOutDate).toDateString()}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="small text-muted">Total Paid</span>
                      <strong className="small text-success">${selectedVoucher.totalPrice} USD</strong>
                    </div>
                  </div>

                  <div className="alert alert-info py-2 px-3 small d-flex align-items-center gap-2 mb-0">
                    <ShieldCheck size={20} className="flex-shrink-0" />
                    <span>Present this voucher or your valid photo ID at the front desk upon check-in.</span>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-50"
                    onClick={() => window.print()}
                  >
                    Print Voucher
                  </button>
                  <button
                    type="button"
                    className="btn btn-gold w-50"
                    onClick={() => setSelectedVoucher(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;

