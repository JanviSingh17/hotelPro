import React from 'react';
import { Users, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoomCard = ({ room, onBookNow }) => {
  const defaultImage =
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';

  const roomImage = room.images && room.images.length > 0 ? room.images[0] : defaultImage;

  return (
    <div className="card room-card h-100">
      <div className="room-image-wrap">
        <img src={roomImage} alt={room.title} loading="lazy" />
        <span className="room-badge">{room.type}</span>
        <div className="room-price-tag">
          ${room.pricePerNight} <span className="small text-muted fw-normal">/ night</span>
        </div>
      </div>

      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="badge bg-light text-secondary border">Room #{room.roomNumber}</span>
          <div className="d-flex align-items-center gap-1 text-warning small fw-bold">
            <Star size={15} fill="currentColor" />
            <span>{room.rating || 4.8}</span>
          </div>
        </div>

        <h5 className="card-title fw-bold text-dark mb-2">{room.title}</h5>
        <p className="card-text text-secondary small flex-grow-1 mb-3">
          {room.description.length > 100
            ? `${room.description.substring(0, 100)}...`
            : room.description}
        </p>

        <div className="d-flex align-items-center gap-3 text-secondary small mb-3 border-top pt-3">
          <div className="d-flex align-items-center gap-1">
            <Users size={16} className="text-muted" /> Up to {room.capacity} Guests
          </div>
          <div className="d-flex align-items-center gap-1">
            <CheckCircle2 size={16} className="text-success" /> Free Cancellation
          </div>
        </div>

        <div className="d-flex gap-2 mt-auto">
          <Link to={`/rooms/${room._id}`} className="btn btn-outline-dark btn-sm w-50 py-2">
            Details
          </Link>
          <button
            onClick={() => onBookNow(room)}
            className="btn btn-gold btn-sm w-50 py-2 d-flex align-items-center justify-content-center gap-1"
          >
            Book Now <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
