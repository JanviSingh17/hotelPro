import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
  Percent,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Shield,
  Briefcase,
  AlertCircle,
  ChevronRight,
  Eye,
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [staff, setStaff] = useState([]);
  const [guests, setGuests] = useState([]);

  // Modals state
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomFormData, setRoomFormData] = useState({
    roomNumber: '',
    title: '',
    type: 'Deluxe',
    pricePerNight: '',
    capacity: 2,
    floor: 1,
    amenities: 'High-Speed Wi-Fi, Air Conditioning, Flat-screen TV, Mini Bar',
    images: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    description: '',
    isAvailable: true,
  });

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffFormData, setStaffFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: 'Front Desk Officer',
    department: 'Front Office',
    shift: 'Morning (06:00 - 14:00)',
    salary: 45000,
    assignedFloor: 1,
  });

  // Filters
  const [bookingFilter, setBookingFilter] = useState('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [roomSearch, setRoomSearch] = useState('');
  const [staffDepartmentFilter, setStaffDepartmentFilter] = useState('all');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, roomsRes, bookingsRes, staffRes, guestsRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/rooms'),
        API.get('/bookings'),
        API.get('/admin/staff'),
        API.get('/admin/guests'),
      ]);

      setStatsData(statsRes.data);
      setRooms(roomsRes.data.rooms || []);
      setBookings(bookingsRes.data.bookings || []);
      setStaff(staffRes.data.staff || []);
      setGuests(guestsRes.data.guests || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Room Handlers
  const handleOpenRoomModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setRoomFormData({
        roomNumber: room.roomNumber,
        title: room.title,
        type: room.type,
        pricePerNight: room.pricePerNight,
        capacity: room.capacity,
        floor: room.floor,
        amenities: room.amenities.join(', '),
        images: room.images.join(', '),
        description: room.description,
        isAvailable: room.isAvailable,
      });
    } else {
      setEditingRoom(null);
      setRoomFormData({
        roomNumber: '',
        title: '',
        type: 'Deluxe',
        pricePerNight: '',
        capacity: 2,
        floor: 1,
        amenities: 'High-Speed Wi-Fi, Air Conditioning, Flat-screen TV, Mini Bar',
        images: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
        description: '',
        isAvailable: true,
      });
    }
    setShowRoomModal(true);
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...roomFormData,
        pricePerNight: Number(roomFormData.pricePerNight),
        capacity: Number(roomFormData.capacity),
        floor: Number(roomFormData.floor),
        amenities: roomFormData.amenities.split(',').map((a) => a.trim()).filter(Boolean),
        images: roomFormData.images.split(',').map((img) => img.trim()).filter(Boolean),
      };

      if (editingRoom) {
        await API.put(`/rooms/${editingRoom._id}`, payload);
      } else {
        await API.post('/rooms', payload);
      }

      setShowRoomModal(false);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save room');
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await API.delete(`/rooms/${id}`);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete room');
    }
  };

  const handleToggleRoomStatus = async (room) => {
    try {
      await API.put(`/rooms/${room._id}`, { isAvailable: !room.isAvailable });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update room availability');
    }
  };

  // Booking Handlers
  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await API.put(`/bookings/${bookingId}/status`, { bookingStatus: status });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  // Staff Handlers
  const handleSaveStaff = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/staff', staffFormData);
      setShowStaffModal(false);
      setStaffFormData({
        name: '',
        email: '',
        phone: '',
        position: 'Front Desk Officer',
        department: 'Front Office',
        shift: 'Morning (06:00 - 14:00)',
        salary: 45000,
        assignedFloor: 1,
      });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add staff');
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;
    try {
      await API.delete(`/admin/staff/${id}`);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete staff member');
    }
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = bookingFilter === 'all' || b.bookingStatus === bookingFilter;
    const matchesSearch =
      !bookingSearch ||
      b.guestName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.guestEmail.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.room?.roomNumber?.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Filtered Rooms
  const filteredRooms = rooms.filter(
    (r) =>
      !roomSearch ||
      r.title.toLowerCase().includes(roomSearch.toLowerCase()) ||
      r.roomNumber.toLowerCase().includes(roomSearch.toLowerCase()) ||
      r.type.toLowerCase().includes(roomSearch.toLowerCase())
  );

  // Filtered Staff
  const filteredStaff = staff.filter(
    (s) => staffDepartmentFilter === 'all' || s.department === staffDepartmentFilter
  );

  return (
    <div className="py-4 bg-light" style={{ minHeight: '90vh' }}>
      <div className="container-fluid px-lg-5">
        {/* Top Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom gap-3">
          <div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-warning text-dark fw-bold px-2 py-1">HotelPro Operations Portal</span>
              <span className="text-muted small">• Admin Access</span>
            </div>
            <h2 className="font-serif fw-bold text-dark mt-1 mb-0">Management Executive Suite</h2>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
              onClick={fetchDashboardData}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Sync
            </button>
            <span className="badge bg-dark text-white p-2 small">
              Logged in as: {user?.name || 'Administrator'}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <ul className="nav nav-pills mb-4 gap-2 flex-wrap bg-white p-2 rounded-4 shadow-sm">
          <li className="nav-item">
            <button
              className={`nav-link rounded-pill d-flex align-items-center gap-2 ${
                activeTab === 'overview' ? 'active bg-dark text-white' : 'text-muted'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard size={18} /> Overview & Analytics
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link rounded-pill d-flex align-items-center gap-2 ${
                activeTab === 'rooms' ? 'active bg-dark text-white' : 'text-muted'
              }`}
              onClick={() => setActiveTab('rooms')}
            >
              <BedDouble size={18} /> Room Inventory ({rooms.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link rounded-pill d-flex align-items-center gap-2 ${
                activeTab === 'bookings' ? 'active bg-dark text-white' : 'text-muted'
              }`}
              onClick={() => setActiveTab('bookings')}
            >
              <CalendarCheck size={18} /> Reservations Ledger ({bookings.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link rounded-pill d-flex align-items-center gap-2 ${
                activeTab === 'staff' ? 'active bg-dark text-white' : 'text-muted'
              }`}
              onClick={() => setActiveTab('staff')}
            >
              <Briefcase size={18} /> Hotel Staff Roster ({staff.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link rounded-pill d-flex align-items-center gap-2 ${
                activeTab === 'guests' ? 'active bg-dark text-white' : 'text-muted'
              }`}
              onClick={() => setActiveTab('guests')}
            >
              <Users size={18} /> Guest Directory ({guests.length})
            </button>
          </li>
        </ul>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div>
            {/* KPI Cards Row */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-6 col-xl-3">
                <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small fw-semibold">TOTAL REVENUE</span>
                    <div className="p-2 bg-success bg-opacity-10 text-success rounded-3">
                      <DollarSign size={20} />
                    </div>
                  </div>
                  <h3 className="fw-bold mb-1 text-dark">
                    ${statsData?.stats?.totalRevenue?.toLocaleString() || '0'}
                  </h3>
                  <span className="text-success small fw-semibold">
                    <TrendingUp size={14} className="me-1 inline" /> Paid & settled
                  </span>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-xl-3">
                <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small fw-semibold">HOTEL OCCUPANCY</span>
                    <div className="p-2 bg-warning bg-opacity-10 text-warning text-dark rounded-3">
                      <Percent size={20} />
                    </div>
                  </div>
                  <h3 className="fw-bold mb-1 text-dark">{statsData?.stats?.occupancyRate || 0}%</h3>
                  <div className="progress mt-2" style={{ height: '6px' }}>
                    <div
                      className="progress-bar bg-warning"
                      style={{ width: `${statsData?.stats?.occupancyRate || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-muted small mt-2 d-block">
                    {statsData?.stats?.activeBookingsCount || 0} active of {statsData?.stats?.totalRooms || 0} rooms
                  </span>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-xl-3">
                <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small fw-semibold">TOTAL RESERVATIONS</span>
                    <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3">
                      <CalendarCheck size={20} />
                    </div>
                  </div>
                  <h3 className="fw-bold mb-1 text-dark">{statsData?.stats?.totalBookings || 0}</h3>
                  <span className="text-muted small">Confirmed & Active</span>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-xl-3">
                <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small fw-semibold">ON-DUTY STAFF & GUESTS</span>
                    <div className="p-2 bg-info bg-opacity-10 text-info rounded-3">
                      <Users size={20} />
                    </div>
                  </div>
                  <h3 className="fw-bold mb-1 text-dark">
                    {statsData?.stats?.totalStaff || 0} <span className="text-muted fs-6 fw-normal">Staff</span> / {statsData?.stats?.totalUsers || 0} <span className="text-muted fs-6 fw-normal">Guests</span>
                  </h3>
                  <span className="text-muted small">Across all active departments</span>
                </div>
              </div>
            </div>

            {/* Visual Analytics Charts Section */}
            <div className="row g-4 mb-4">
              {/* Monthly Revenue Performance Chart */}
              <div className="col-12 col-lg-8">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h5 className="fw-bold mb-0 font-serif">Revenue & Occupancy Velocity</h5>
                      <p className="text-muted small mb-0">Past 6 months booking performance (USD)</p>
                    </div>
                    <span className="badge bg-light text-dark border">HotelPro Analytics</span>
                  </div>

                  {/* High Quality SVG Trend Visualizer */}
                  <div className="py-2">
                    <div className="d-flex align-items-end justify-content-between gap-2" style={{ height: '200px' }}>
                      {(statsData?.monthlyAnalytics || [
                        { month: 'May', revenue: 3200, occupancy: 65 },
                        { month: 'Jun', revenue: 4100, occupancy: 74 },
                        { month: 'Jul', revenue: 5800, occupancy: 88 },
                        { month: 'Aug', revenue: 5100, occupancy: 82 },
                        { month: 'Sep', revenue: 3900, occupancy: 70 },
                        { month: 'Oct', revenue: 4800, occupancy: 79 },
                      ]).map((item, idx) => {
                        const maxRev = 6000;
                        const heightPct = Math.min(100, Math.max(15, Math.round((item.revenue / maxRev) * 100)));
                        return (
                          <div key={idx} className="d-flex flex-column align-items-center flex-grow-1 h-100 justify-content-end">
                            <span className="small text-muted fw-bold mb-1">${(item.revenue / 1000).toFixed(1)}k</span>
                            <div
                              className="w-100 rounded-3 position-relative"
                              style={{
                                height: `${heightPct}%`,
                                background: idx === 5 ? 'linear-gradient(180deg, #c59b27 0%, #0f172a 100%)' : '#e2e8f0',
                                transition: 'height 0.4s ease',
                              }}
                              title={`Revenue: $${item.revenue} | Occupancy: ${item.occupancy}%`}
                            >
                              <div
                                className="position-absolute top-0 start-50 translate-middle-x badge bg-dark text-warning p-1"
                                style={{ fontSize: '10px' }}
                              >
                                {item.occupancy}%
                              </div>
                            </div>
                            <span className="small text-secondary fw-semibold mt-2">{item.month}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="d-flex justify-content-center gap-4 mt-3 pt-3 border-top small text-muted">
                    <span className="d-flex align-items-center gap-1">
                      <span className="rounded-circle d-inline-block" style={{ width: '10px', height: '10px', backgroundColor: '#c59b27' }}></span> Current Month Trajectory
                    </span>
                    <span className="d-flex align-items-center gap-1">
                      <span className="rounded-circle d-inline-block" style={{ width: '10px', height: '10px', backgroundColor: '#e2e8f0' }}></span> Historical Performance
                    </span>
                  </div>
                </div>
              </div>

              {/* Room Distribution Breakdown */}
              <div className="col-12 col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                  <h5 className="fw-bold mb-1 font-serif">Room Distribution</h5>
                  <p className="text-muted small mb-3">Inventory segmented by tier</p>

                  <div className="d-flex flex-column gap-3 my-auto">
                    {[
                      { type: 'Presidential', color: '#c59b27', count: rooms.filter((r) => r.type === 'Presidential').length },
                      { type: 'Suite', color: '#0f172a', count: rooms.filter((r) => r.type === 'Suite').length },
                      { type: 'Deluxe', color: '#2563eb', count: rooms.filter((r) => r.type === 'Deluxe').length },
                      { type: 'Double', color: '#10b981', count: rooms.filter((r) => r.type === 'Double').length },
                      { type: 'Single', color: '#64748b', count: rooms.filter((r) => r.type === 'Single').length },
                    ].map((t) => {
                      const total = rooms.length || 1;
                      const pct = Math.round((t.count / total) * 100);
                      return (
                        <div key={t.type}>
                          <div className="d-flex justify-content-between small fw-semibold mb-1">
                            <span>{t.type}</span>
                            <span>{t.count} rooms ({pct}%)</span>
                          </div>
                          <div className="progress" style={{ height: '8px' }}>
                            <div
                              className="progress-bar rounded-pill"
                              style={{ width: `${pct}%`, backgroundColor: t.color }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings Feed */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0 font-serif">Recent Guest Activity</h5>
                <button
                  className="btn btn-outline-dark btn-sm rounded-pill px-3"
                  onClick={() => setActiveTab('bookings')}
                >
                  View All Bookings <ChevronRight size={14} className="ms-1 inline" />
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small">
                    <tr>
                      <th>Booking Ref</th>
                      <th>Guest Details</th>
                      <th>Room</th>
                      <th>Dates</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(statsData?.recentBookings || bookings.slice(0, 5)).map((b) => (
                      <tr key={b._id}>
                        <td className="fw-bold small">#{b._id.slice(-6).toUpperCase()}</td>
                        <td>
                          <div className="fw-semibold text-dark">{b.guestName}</div>
                          <div className="text-muted small">{b.guestEmail}</div>
                        </td>
                        <td>
                          <div className="fw-semibold">Room #{b.room?.roomNumber}</div>
                          <div className="text-muted small">{b.room?.title}</div>
                        </td>
                        <td className="small">
                          {new Date(b.checkInDate).toLocaleDateString()} &rarr; {new Date(b.checkOutDate).toLocaleDateString()}
                        </td>
                        <td className="fw-bold text-success">${b.totalPrice}</td>
                        <td>
                          <span className={`badge ${
                            b.bookingStatus === 'confirmed' ? 'bg-success' :
                            b.bookingStatus === 'checked-in' ? 'bg-primary' :
                            b.bookingStatus === 'checked-out' ? 'bg-secondary' : 'bg-danger'
                          } bg-opacity-10 text-${
                            b.bookingStatus === 'confirmed' ? 'success' :
                            b.bookingStatus === 'checked-in' ? 'primary' :
                            b.bookingStatus === 'checked-out' ? 'secondary' : 'danger'
                          } border py-1 px-2 rounded-pill small`}>
                            {b.bookingStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ROOM INVENTORY */}
        {activeTab === 'rooms' && (
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
              <div>
                <h4 className="fw-bold mb-1 font-serif">Hotel Room Inventory</h4>
                <p className="text-muted small mb-0">Manage rooms, pricing, amenities, and operational availability</p>
              </div>

              <div className="d-flex gap-2">
                <div className="input-group" style={{ maxWidth: '280px' }}>
                  <span className="input-group-text bg-light border-end-0">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control bg-light border-start-0"
                    placeholder="Search rooms..."
                    value={roomSearch}
                    onChange={(e) => setRoomSearch(e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-gold d-flex align-items-center gap-1 rounded-pill px-3"
                  onClick={() => handleOpenRoomModal()}
                >
                  <Plus size={18} /> Add Room
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light small">
                  <tr>
                    <th>Room</th>
                    <th>Type</th>
                    <th>Floor</th>
                    <th>Rate / Night</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.map((r) => (
                    <tr key={r._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={r.images[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=200&q=80'}
                            alt={r.title}
                            className="rounded-3"
                            style={{ width: '56px', height: '42px', objectFit: 'cover' }}
                          />
                          <div>
                            <div className="fw-bold text-dark">
                              #{r.roomNumber} - {r.title}
                            </div>
                            <div className="text-muted small">{r.amenities.slice(0, 3).join(', ')}...</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-dark text-white rounded-pill px-2 py-1 small">{r.type}</span>
                      </td>
                      <td>Floor {r.floor}</td>
                      <td className="fw-bold text-dark">${r.pricePerNight}</td>
                      <td>{r.capacity} Guests</td>
                      <td>
                        <button
                          className={`btn btn-sm py-0 px-2 rounded-pill ${
                            r.isAvailable ? 'btn-outline-success' : 'btn-outline-danger'
                          }`}
                          onClick={() => handleToggleRoomStatus(r)}
                        >
                          {r.isAvailable ? 'Available' : 'Maintenance'}
                        </button>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-secondary"
                            title="Edit Room"
                            onClick={() => handleOpenRoomModal(r)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            title="Delete Room"
                            onClick={() => handleDeleteRoom(r._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: RESERVATIONS LEDGER */}
        {activeTab === 'bookings' && (
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
              <div>
                <h4 className="fw-bold mb-1 font-serif">All Reservations Ledger</h4>
                <p className="text-muted small mb-0">Monitor check-ins, guest arrivals, departures, and cancellations</p>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <select
                  className="form-select form-select-sm"
                  style={{ width: '160px' }}
                  value={bookingFilter}
                  onChange={(e) => setBookingFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="checked-in">Checked In</option>
                  <option value="checked-out">Checked Out</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <div className="input-group input-group-sm" style={{ maxWidth: '240px' }}>
                  <span className="input-group-text bg-light border-end-0">
                    <Search size={14} />
                  </span>
                  <input
                    type="text"
                    className="form-control bg-light border-start-0"
                    placeholder="Search guest or room..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light small">
                  <tr>
                    <th>Ref ID</th>
                    <th>Guest Information</th>
                    <th>Room</th>
                    <th>Dates & Duration</th>
                    <th>Total & Payment</th>
                    <th>Status</th>
                    <th className="text-end">Manage Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b._id}>
                      <td className="fw-bold small">#{b._id.slice(-6).toUpperCase()}</td>
                      <td>
                        <div className="fw-semibold text-dark">{b.guestName}</div>
                        <div className="text-muted small">{b.guestEmail} • {b.guestPhone || 'No phone'}</div>
                      </td>
                      <td>
                        <div className="fw-semibold">Room #{b.room?.roomNumber}</div>
                        <div className="text-muted small">{b.room?.type}</div>
                      </td>
                      <td className="small">
                        <div>
                          <strong>In:</strong> {new Date(b.checkInDate).toLocaleDateString()}
                        </div>
                        <div>
                          <strong>Out:</strong> {new Date(b.checkOutDate).toLocaleDateString()}
                        </div>
                        <span className="badge bg-light text-muted border mt-1">
                          {b.totalNights} nights • {b.totalGuests} guests
                        </span>
                      </td>
                      <td>
                        <div className="fw-bold text-success">${b.totalPrice}</div>
                        <div className="text-muted small">{b.paymentMethod} • {b.paymentStatus}</div>
                      </td>
                      <td>
                        <span className={`badge ${
                          b.bookingStatus === 'confirmed' ? 'bg-success' :
                          b.bookingStatus === 'checked-in' ? 'bg-primary' :
                          b.bookingStatus === 'checked-out' ? 'bg-secondary' : 'bg-danger'
                        } py-1 px-2 rounded-pill small`}>
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="dropdown">
                          <button
                            className="btn btn-outline-dark btn-sm dropdown-toggle rounded-pill"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            Update
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end shadow-sm small">
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleUpdateBookingStatus(b._id, 'confirmed')}
                              >
                                Mark as Confirmed
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-primary"
                                onClick={() => handleUpdateBookingStatus(b._id, 'checked-in')}
                              >
                                Mark as Checked In
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-secondary"
                                onClick={() => handleUpdateBookingStatus(b._id, 'checked-out')}
                              >
                                Mark as Checked Out
                              </button>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleUpdateBookingStatus(b._id, 'cancelled')}
                              >
                                Cancel Reservation
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: STAFF ROSTER */}
        {activeTab === 'staff' && (
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
              <div>
                <h4 className="fw-bold mb-1 font-serif">Hotel Staff Roster</h4>
                <p className="text-muted small mb-0">Departmental assignments, shift schedules, and staff roster</p>
              </div>

              <div className="d-flex gap-2">
                <select
                  className="form-select form-select-sm"
                  style={{ width: '180px' }}
                  value={staffDepartmentFilter}
                  onChange={(e) => setStaffDepartmentFilter(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  <option value="Front Office">Front Office</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Operations">Operations</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Security">Security</option>
                </select>

                <button
                  className="btn btn-gold d-flex align-items-center gap-1 rounded-pill px-3"
                  onClick={() => setShowStaffModal(true)}
                >
                  <Plus size={18} /> Add Staff Member
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light small">
                  <tr>
                    <th>Staff Name & Email</th>
                    <th>Position</th>
                    <th>Department</th>
                    <th>Assigned Shift</th>
                    <th>Assigned Floor</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((s) => (
                    <tr key={s._id}>
                      <td>
                        <div className="fw-bold text-dark">{s.name}</div>
                        <div className="text-muted small">{s.email} • {s.phone}</div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">{s.position}</span>
                      </td>
                      <td>{s.department}</td>
                      <td className="small">{s.shift}</td>
                      <td>Floor {s.assignedFloor}</td>
                      <td>
                        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-2 py-1">
                          {s.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-outline-danger btn-sm rounded-pill"
                          onClick={() => handleDeleteStaff(s._id)}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: GUEST DIRECTORY */}
        {activeTab === 'guests' && (
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="mb-4">
              <h4 className="fw-bold mb-1 font-serif">Registered Guests & Loyalty Profiles</h4>
              <p className="text-muted small mb-0">Direct guest accounts, contact history, and reservation frequencies</p>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light small">
                  <tr>
                    <th>Guest Name</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>Account Role</th>
                    <th>Total Bookings</th>
                    <th>Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((g) => (
                    <tr key={g._id}>
                      <td className="fw-bold text-dark">{g.name}</td>
                      <td>{g.email}</td>
                      <td>{g.phone || 'N/A'}</td>
                      <td>
                        <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 rounded-pill px-2 py-1">
                          {g.role}
                        </span>
                      </td>
                      <td className="fw-bold text-primary">{g.totalBookings || 0} stays</td>
                      <td className="small text-muted">{new Date(g.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT ROOM */}
        {showRoomModal && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 1060 }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                <div className="modal-header bg-dark text-white p-4">
                  <h5 className="modal-title font-serif fw-bold">
                    {editingRoom ? 'Edit Room #' + editingRoom.roomNumber : 'Add New Room to Inventory'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowRoomModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleSaveRoom} className="p-4">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Room Number</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={roomFormData.roomNumber}
                        onChange={(e) => setRoomFormData({ ...roomFormData, roomNumber: e.target.value })}
                        placeholder="e.g. 401"
                      />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label small fw-semibold">Room Title</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={roomFormData.title}
                        onChange={(e) => setRoomFormData({ ...roomFormData, title: e.target.value })}
                        placeholder="e.g. Grand Sunset Suite"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Room Tier / Type</label>
                      <select
                        className="form-select"
                        value={roomFormData.type}
                        onChange={(e) => setRoomFormData({ ...roomFormData, type: e.target.value })}
                      >
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Suite">Suite</option>
                        <option value="Presidential">Presidential</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Price Per Night ($)</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        min="1"
                        value={roomFormData.pricePerNight}
                        onChange={(e) => setRoomFormData({ ...roomFormData, pricePerNight: e.target.value })}
                        placeholder="250"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Guest Capacity</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        min="1"
                        value={roomFormData.capacity}
                        onChange={(e) => setRoomFormData({ ...roomFormData, capacity: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Floor Level</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        min="1"
                        value={roomFormData.floor}
                        onChange={(e) => setRoomFormData({ ...roomFormData, floor: e.target.value })}
                      />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label small fw-semibold">Image URL (Separate with comma)</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={roomFormData.images}
                        onChange={(e) => setRoomFormData({ ...roomFormData, images: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Amenities (Comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={roomFormData.amenities}
                        onChange={(e) => setRoomFormData({ ...roomFormData, amenities: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        required
                        value={roomFormData.description}
                        onChange={(e) => setRoomFormData({ ...roomFormData, description: e.target.value })}
                        placeholder="Comprehensive details on room amenities, view, and furnishings..."
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={roomFormData.isAvailable}
                          onChange={(e) => setRoomFormData({ ...roomFormData, isAvailable: e.target.checked })}
                          id="availSwitch"
                        />
                        <label className="form-check-label small fw-semibold" htmlFor="availSwitch">
                          Room is Available for Guest Booking (Uncheck for Maintenance)
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowRoomModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-gold px-4">
                      {editingRoom ? 'Save Changes' : 'Create Room'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD STAFF */}
        {showStaffModal && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 1060 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                <div className="modal-header bg-dark text-white p-4">
                  <h5 className="modal-title font-serif fw-bold">Add Staff Member</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowStaffModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleSaveStaff} className="p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Staff Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={staffFormData.name}
                        onChange={(e) => setStaffFormData({ ...staffFormData, name: e.target.value })}
                        placeholder="e.g. Victoria Cole"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        required
                        value={staffFormData.email}
                        onChange={(e) => setStaffFormData({ ...staffFormData, email: e.target.value })}
                        placeholder="v.cole@hotelpro.com"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Contact Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        required
                        value={staffFormData.phone}
                        onChange={(e) => setStaffFormData({ ...staffFormData, phone: e.target.value })}
                        placeholder="+1 555 443 1122"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Department</label>
                      <select
                        className="form-select"
                        value={staffFormData.department}
                        onChange={(e) => setStaffFormData({ ...staffFormData, department: e.target.value })}
                      >
                        <option value="Front Office">Front Office</option>
                        <option value="Housekeeping">Housekeeping</option>
                        <option value="Operations">Operations</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Security">Security</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Position</label>
                      <select
                        className="form-select"
                        value={staffFormData.position}
                        onChange={(e) => setStaffFormData({ ...staffFormData, position: e.target.value })}
                      >
                        <option value="Front Desk Officer">Front Desk Officer</option>
                        <option value="Head Concierge">Head Concierge</option>
                        <option value="Executive Housekeeper">Executive Housekeeper</option>
                        <option value="Operations Manager">Operations Manager</option>
                        <option value="Maintenance Engineer">Maintenance Engineer</option>
                        <option value="Security Lead">Security Lead</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Shift Schedule</label>
                      <select
                        className="form-select"
                        value={staffFormData.shift}
                        onChange={(e) => setStaffFormData({ ...staffFormData, shift: e.target.value })}
                      >
                        <option value="Morning (06:00 - 14:00)">Morning (06:00 - 14:00)</option>
                        <option value="Evening (14:00 - 22:00)">Evening (14:00 - 22:00)</option>
                        <option value="Night (22:00 - 06:00)">Night (22:00 - 06:00)</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Assigned Floor</label>
                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        value={staffFormData.assignedFloor}
                        onChange={(e) => setStaffFormData({ ...staffFormData, assignedFloor: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowStaffModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-gold px-4">
                      Add to Roster
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;

