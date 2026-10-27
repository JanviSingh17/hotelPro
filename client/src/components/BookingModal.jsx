import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Calendar, Users, CreditCard, ShieldCheck, CheckCircle2, AlertCircle, X } from 'lucide-react';

const BookingModal = ({ room, show, onClose, onSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Tomorrow as default checkIn, day after as checkOut
  const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const getDayAfterTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  };

  const [checkInDate, setCheckInDate] = useState(getTomorrowString());
  const [checkOutDate, setCheckOutDate] = useState(getDayAfterTomorrowString());
  const [totalGuests, setTotalGuests] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [specialRequests, setSpecialRequests] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    if (user) {
      setGuestName(user.name || '');
      setGuestEmail(user.email || '');
      setGuestPhone(user.phone || '');
    }
  }, [user]);

  if (!show || !room) return null;

  // Calculate nights
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const diffTime = checkOut - checkIn;
  const nights = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
  const totalPrice = nights > 0 ? nights * room.pricePerNight : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (nights <= 0) {
      setError('Check-out date must be strictly after check-in date.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await API.post('/bookings', {
        roomId: room._id,
        checkInDate,
        checkOutDate,
        totalGuests: Number(totalGuests),
        guestName,
        guestEmail,
        guestPhone,
        paymentMethod,
        specialRequests,
      });

      setConfirmedBooking(res.data.booking);
      if (onSuccess) onSuccess(res.data.booking);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to complete booking. Room might be reserved for these dates.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-dark text-white p-4 d-flex justify-content-between align-items-center">
            <div>
              <h5 className="modal-title font-serif fs-4 mb-1">
                {confirmedBooking ? 'Reservation Confirmed!' : `Reserve ${room.title}`}
              </h5>
              <div className="small text-secondary">
                Room #{room.roomNumber} &bull; ${room.pricePerNight} / night
              </div>
            </div>
            <button
              type="button"
              className="btn text-white p-0"
              onClick={onClose}
              disabled={loading}
            >
              <X size={24} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4">
            {confirmedBooking ? (
              <div className="text-center py-4">
                <div className="mb-3">
                  <CheckCircle2 size={64} className="text-success" />
                </div>
                <h4 className="fw-bold mb-2">Booking Successfully Placed!</h4>
                <p className="text-muted mb-4">
                  Confirmation # <strong>{confirmedBooking._id}</strong> has been assigned to your reservation.
                </p>

                <div className="card bg-light border-0 p-3 mx-auto text-start mb-4" style={{ maxWidth: '480px' }}>
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span className="text-muted">Room:</span>
                    <strong>{room.title} (Room {room.roomNumber})</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span className="text-muted">Dates:</span>
                    <span>
                      {new Date(checkInDate).toLocaleDateString()} to {new Date(checkOutDate).toLocaleDateString()} ({nights} nights)
                    </span>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span className="text-muted">Total Paid:</span>
                    <strong className="text-success">${totalPrice}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1">
                    <span className="text-muted">Payment:</span>
                    <span>{paymentMethod} (Instant Confirmation)</span>
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <button
                    className="btn btn-gold px-4 py-2"
                    onClick={() => {
                      onClose();
                      navigate('/my-bookings');
                    }}
                  >
                    View in My Bookings
                  </button>
                  <button className="btn btn-outline-secondary px-4 py-2" onClick={onClose}>
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
                    <AlertCircle size={20} />
                    <div>{error}</div>
                  </div>
                )}

                <div className="row g-3">
                  {/* Dates */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Check-in Date</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <Calendar size={18} className="text-muted" />
                      </span>
                      <input
                        type="date"
                        className="form-control"
                        value={checkInDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Check-out Date</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <Calendar size={18} className="text-muted" />
                      </span>
                      <input
                        type="date"
                        className="form-control"
                        value={checkOutDate}
                        min={checkInDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Guests</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <Users size={18} className="text-muted" />
                      </span>
                      <select
                        className="form-select"
                        value={totalGuests}
                        onChange={(e) => setTotalGuests(e.target.value)}
                      >
                        {Array.from({ length: room.capacity || 4 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Payment Preference</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <CreditCard size={18} className="text-muted" />
                      </span>
                      <select
                        className="form-select"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="UPI">UPI / Instant Pay</option>
                        <option value="Net Banking">Net Banking</option>
                        <option value="Cash at Check-in">Pay at Front Desk</option>
                      </select>
                    </div>
                  </div>

                  {/* Guest Info */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Guest Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Jane Doe"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Contact Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted">Special Inquiries / Requests</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="e.g. Quiet room preferred, feather pillows, late check-in..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="card bg-light border-0 p-3 rounded-3 mt-4">
                  <div className="d-flex justify-content-between mb-2 small">
                    <span className="text-muted">
                      ${room.pricePerNight} x {nights} night{nights !== 1 ? 's' : ''}
                    </span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2 small">
                    <span className="text-muted">Taxes & Hospitality Service Surcharge</span>
                    <span className="text-success">Complimentary ($0)</span>
                  </div>
                  <hr className="my-2" />
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold fs-5">Estimated Total:</span>
                    <span className="fw-bold fs-4 text-primary">${totalPrice}</span>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4 py-2"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-gold px-4 py-2 d-flex align-items-center gap-2"
                    disabled={loading || nights <= 0}
                  >
                    <ShieldCheck size={18} />
                    {loading ? 'Processing...' : `Confirm & Pay $${totalPrice}`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
