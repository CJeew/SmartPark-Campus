import React, { useCallback, useEffect, useState } from 'react';
import bookingService from '../services/bookingService';
import '../styles/BookingList.css';

const BookingList = ({ refreshTrigger }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (filter === 'all') {
        data = await bookingService.getUserBookings();
      } else {
        data = await bookingService.getUserBookingsByStatus(filter);
      }
      
      setBookings(data || []);
    } catch (err) {
      console.error('Failed to load bookings:', err);
      setError('Failed to load your bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings, refreshTrigger]);

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'PENDING': 'status-pending',
      'APPROVED': 'status-approved',
      'REJECTED': 'status-rejected',
      'CANCELLED': 'status-cancelled'
    };
    return statusClasses[status] || '';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'PENDING': '⏳',
      'APPROVED': '✅',
      'REJECTED': '❌',
      'CANCELLED': '🚫'
    };
    return icons[status] || '•';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="booking-list-container">
        <div className="loading-spinner">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="booking-list-container">
      <div className="booking-list-header">
        <h2>My Bookings</h2>
        <div className="filter-buttons">
          {['all', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(status => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">📦</p>
          <p>No bookings found</p>
          <p className="empty-hint">Start by creating a new booking from the parking zones</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <div className="booking-title">
                  <h4>{booking.slotNumber}</h4>
                  <span className="zone-badge">{booking.zoneName}</span>
                </div>
                <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                  {getStatusIcon(booking.status)} {booking.status}
                </span>
              </div>

              <div className="booking-details">
                <div className="detail-row">
                  <span className="label">Vehicle Type:</span>
                  <span className="value">{booking.vehicleType}</span>
                </div>

                <div className="detail-row">
                  <span className="label">Start:</span>
                  <span className="value">{formatDate(booking.startTime)}</span>
                </div>

                <div className="detail-row">
                  <span className="label">End:</span>
                  <span className="value">{formatDate(booking.endTime)}</span>
                </div>

                <div className="detail-row">
                  <span className="label">Booked on:</span>
                  <span className="value">{formatDate(booking.createdAt)}</span>
                </div>

                {booking.purpose && (
                  <div className="detail-row">
                    <span className="label">Purpose:</span>
                    <span className="value reason">{booking.purpose}</span>
                  </div>
                )}

                {booking.reason && (
                  <div className="detail-row">
                    <span className="label">Reason:</span>
                    <span className="value reason">{booking.reason}</span>
                  </div>
                )}

                {booking.status === 'APPROVED' && (
                  <div className="detail-row">
                    <span className="label">Status:</span>
                    <span className="value approved-text">✓ Ready to use</span>
                  </div>
                )}
              </div>

              {booking.status === 'PENDING' && (
                <div className="booking-actions">
                  <p className="pending-note">⏳ Waiting for admin approval</p>
                </div>
              )}

              {booking.status === 'REJECTED' && (
                <div className="booking-actions reject-action">
                  <p className="reject-note">Request was rejected</p>
                  {booking.reason && <p className="reject-reason">{booking.reason}</p>}
                </div>
              )}

              {booking.status === 'APPROVED' && (
                <div className="booking-actions approve-action">
                  <p className="approve-note">✓ Your booking is confirmed</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingList;
