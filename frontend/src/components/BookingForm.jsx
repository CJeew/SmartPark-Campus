import React, { useState } from 'react';
import '../styles/BookingForm.css';

const MIN_BOOKING_MINUTES = 30;
const MAX_BOOKING_HOURS = 8;
const MAX_PURPOSE_LENGTH = 500;
const MIN_PURPOSE_LENGTH = 10;

const BookingForm = ({ selectedSlot, zones, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: 1
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear time error when either time field changes
    if ((name === 'startTime' || name === 'endTime') && errors.time) {
      setErrors(prev => ({ ...prev, time: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const now = new Date();

    if (!selectedSlot) newErrors.slot = 'Please select a parking slot';

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    // Validate start datetime is not in the past
    if (formData.startDate && formData.startTime) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      if (startDateTime <= now) {
        newErrors.startTime = 'Start time must be in the future';
      }
    }

    // Validate time range and duration
    if (formData.startTime && formData.endTime && !newErrors.startTime) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.startDate}T${formData.endTime}`);
      const diffMinutes = (endDateTime - startDateTime) / (1000 * 60);

      if (diffMinutes <= 0) {
        newErrors.time = 'End time must be after start time';
      } else if (diffMinutes < MIN_BOOKING_MINUTES) {
        newErrors.time = `Minimum booking duration is ${MIN_BOOKING_MINUTES} minutes`;
      } else if (diffMinutes > MAX_BOOKING_HOURS * 60) {
        newErrors.time = `Maximum booking duration is ${MAX_BOOKING_HOURS} hours`;
      }
    }

    const trimmedPurpose = formData.purpose.trim();
    if (!trimmedPurpose) {
      newErrors.purpose = 'Purpose is required';
    } else if (trimmedPurpose.length < MIN_PURPOSE_LENGTH) {
      newErrors.purpose = `Purpose must be at least ${MIN_PURPOSE_LENGTH} characters`;
    } else if (trimmedPurpose.length > MAX_PURPOSE_LENGTH) {
      newErrors.purpose = `Purpose cannot exceed ${MAX_PURPOSE_LENGTH} characters`;
    }

    const attendees = parseInt(formData.expectedAttendees);
    if (isNaN(attendees) || attendees < 1) {
      newErrors.expectedAttendees = 'Expected attendees must be at least 1';
    } else if (attendees > 100) {
      newErrors.expectedAttendees = 'Expected attendees cannot exceed 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.startDate}T${formData.endTime}`);

    onSubmit({
      slotId: selectedSlot.id,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      purpose: formData.purpose.trim(),
      expectedAttendees: parseInt(formData.expectedAttendees)
    });
  };

  const todayDate = new Date().toISOString().split('T')[0];

  return (
    <div className="booking-form-container">
      <h2>Book Your Parking Slot</h2>

      {errors.slot && <div className="error-banner">{errors.slot}</div>}

      <form onSubmit={handleSubmit} className="booking-form">
        {/* Slot Info */}
        <div className="form-section">
          <h3>Selected Slot Information</h3>
          {selectedSlot ? (
            <div className="slot-info-display">
              <div className="info-item">
                <label>Slot Number</label>
                <p>{selectedSlot.slotNumber}</p>
              </div>
              <div className="info-item">
                <label>Vehicle Type</label>
                <p>{selectedSlot.vehicleType}</p>
              </div>
              <div className="info-item">
                <label>Zone</label>
                <p>{selectedSlot.zone?.name || 'N/A'}</p>
              </div>
            </div>
          ) : (
            <div className="no-slot-message">
              Please select a parking slot from the 3D visualization above
            </div>
          )}
        </div>

        {/* Date & Time */}
        <div className="form-section">
          <h3>Booking Period</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date *</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={todayDate}
                className={errors.startDate ? 'error' : ''}
              />
              {errors.startDate && <span className="error-text">{errors.startDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="startTime">Start Time *</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={errors.startTime ? 'error' : ''}
              />
              {errors.startTime && <span className="error-text">{errors.startTime}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time *</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={errors.endTime ? 'error' : ''}
              />
              {errors.endTime && <span className="error-text">{errors.endTime}</span>}
            </div>
          </div>
          {errors.time && <div className="error-text" style={{ marginTop: '10px' }}>{errors.time}</div>}
        </div>

        {/* Details */}
        <div className="form-section">
          <h3>Booking Details</h3>
          
          <div className="form-group">
            <label htmlFor="purpose">Purpose of Booking * <small style={{ fontWeight: 'normal', color: '#888' }}>(min 10, max 500 chars)</small></label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="e.g., Faculty meeting, Campus event, etc."
              rows={3}
              maxLength={500}
              className={errors.purpose ? 'error' : ''}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              {errors.purpose ? <span className="error-text">{errors.purpose}</span> : <span />}
              <small style={{ color: formData.purpose.length > 480 ? '#e53e3e' : '#aaa', marginLeft: 'auto' }}>
                {formData.purpose.length}/500
              </small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="expectedAttendees">Expected Attendees *</label>
            <input
              type="number"
              id="expectedAttendees"
              name="expectedAttendees"
              value={formData.expectedAttendees}
              onChange={handleChange}
              min={1}
              max={100}
              className={errors.expectedAttendees ? 'error' : ''}
            />
            {errors.expectedAttendees && <span className="error-text">{errors.expectedAttendees}</span>}
          </div>
        </div>

        {/* Submit */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading || !selectedSlot}
            className="btn-submit"
          >
            {loading ? 'Booking...' : 'Request Booking'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
