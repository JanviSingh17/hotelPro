import React from 'react';
import { Hotel, Mail, Phone, MapPin, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-5">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Hotel size={24} className="text-warning" />
              <span className="brand-logo fs-4 text-white">Hotel<span>Pro</span></span>
            </div>
            <p className="text-secondary small mb-3">
              HotelPro provides next-generation hospitality booking and real-time operational management. Built with resilience, scalability, and modern web standards.
            </p>
            <div className="d-flex align-items-center gap-2 text-warning small">
              <Award size={18} /> Full Stack MERN Capstone Program
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3">Quick Navigation</h6>
            <ul className="list-unstyled small text-secondary">
              <li className="mb-2"><a href="/" className="text-decoration-none text-secondary">Home</a></li>
              <li className="mb-2"><a href="/rooms" className="text-decoration-none text-secondary">Explore Rooms</a></li>
              <li className="mb-2"><a href="/my-bookings" className="text-decoration-none text-secondary">My Reservations</a></li>
              <li className="mb-2"><a href="/admin" className="text-decoration-none text-secondary">Staff Portal</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Room Collections</h6>
            <ul className="list-unstyled small text-secondary">
              <li className="mb-2">Imperial Presidential Penthouse</li>
              <li className="mb-2">Grand Oceanfront Deluxe King</li>
              <li className="mb-2">Executive Skyline Suite</li>
              <li className="mb-2">Serene Courtyard Garden Double</li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Guest Concierge</h6>
            <div className="d-flex align-items-center gap-2 text-secondary small mb-2">
              <MapPin size={16} className="text-warning" /> 742 Coastal Boulevard, Bayview
            </div>
            <div className="d-flex align-items-center gap-2 text-secondary small mb-2">
              <Phone size={16} className="text-warning" /> +1 (800) 468-3577
            </div>
            <div className="d-flex align-items-center gap-2 text-secondary small">
              <Mail size={16} className="text-warning" /> concierge@hotelpro.com
            </div>
          </div>
        </div>

        <div className="border-top border-secondary pt-4 text-center text-secondary small">
          © {new Date().getFullYear()} HotelPro. Designed for Experiential Learning (SmartBridge & NASSCOM FutureSkills Prime).
        </div>
      </div>
    </footer>
  );
};

export default Footer;
