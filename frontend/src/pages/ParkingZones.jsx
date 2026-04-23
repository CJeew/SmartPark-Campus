import React, { useCallback, useState, useEffect } from 'react';
import { parkingZoneService } from '../services/parkingZoneService';
import bookingService from '../services/bookingService';
import SlotSelector3D from '../components/parking/SlotSelector3D';
import BookingForm from '../components/BookingForm';
import BookingList from '../components/BookingList';
import { useToast } from '../context/ToastContext';
import '../styles/ParkingZones.css';

const ParkingZones = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { showToast } = useToast();

  const loadZones = useCallback(async () => {
    try {
      setLoading(true);
      const data = await parkingZoneService.getAll(0, 100);
      setZones(data.content || []);
    } catch (error) {
      console.error('Failed to load zones:', error);
      showToast('Failed to load parking zones', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadZones();
  }, [loadZones]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      setBookingLoading(true);
      await bookingService.createBooking(
        bookingData.slotId,
        bookingData.startTime,
        bookingData.endTime,
        bookingData.purpose,
        bookingData.expectedAttendees
      );
      
      showToast('Booking request submitted successfully! Waiting for admin approval.', 'success');
      
      // Reset form
      setSelectedSlot(null);
      
      // Refresh booking list
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error.error || error.message || 'Failed to create booking';
      showToast(errorMessage, 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="parking-zones-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading parking zones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="parking-zones-page">
      <div className="page-header">
        <div className="header-content">
          <h1>🅿️ Smart Parking</h1>
          <p>Book your parking slot using our interactive 3D selector</p>
        </div>
      </div>

      <div className="page-container">
        {/* Main booking section */}
        <div className="booking-section">
          <div className="section-card">
            {zones.length > 0 ? (
              <>
                <SlotSelector3D zones={zones} onSlotSelect={handleSlotSelect} />
                <BookingForm
                  selectedSlot={selectedSlot}
                  zones={zones}
                  onSubmit={handleBookingSubmit}
                  loading={bookingLoading}
                />
              </>
            ) : (
              <div className="no-zones-message">
                <p>No parking zones available at the moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Booking history section */}
        <div className="history-section">
          <div className="section-card">
            <BookingList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="page-footer">
        <div className="legend">
          <h4>Slot Status Legend</h4>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color available"></div>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <div className="legend-color occupied"></div>
              <span>Occupied</span>
            </div>
            <div className="legend-item">
              <div className="legend-color selected"></div>
              <span>Selected</span>
            </div>
          </div>
        </div>

        <div className="booking-info">
          <h4>Booking Workflow</h4>
          <ol>
            <li><strong>Select Slot:</strong> Use the 3D visualization to choose an available parking slot</li>
            <li><strong>Provide Details:</strong> Enter your booking dates, times, and purpose</li>
            <li><strong>Submit Request:</strong> Your booking request will be pending admin approval</li>
            <li><strong>Confirmation:</strong> Admin will approve or reject your request</li>
            <li><strong>Use Slot:</strong> Once approved, you can use the slot during the booked time</li>
            <li><strong>Cancellation:</strong> You can cancel an approved booking if needed</li>
          </ol>
        </div>

        <div className="booking-rules">
          <h4>Booking Rules</h4>
          <ul>
            <li>Bookings cannot overlap with existing bookings on the same slot</li>
            <li>Future bookings only - cannot book for past dates</li>
            <li>Select appropriate vehicle type for the slot</li>
            <li>Approved bookings can be cancelled with proper notice</li>
            <li>Rejected bookings can be reboooked with modifications</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ParkingZones;
