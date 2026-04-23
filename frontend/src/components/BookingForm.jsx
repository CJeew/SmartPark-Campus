import React, { useState } from 'react';
import '../styles/BookingForm.css';

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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.purpose) newErrors.purpose = 'Purpose is required';
    if (!selectedSlot) newErrors.slot = 'Please select a parking slot';

    if (formData.startTime && formData.endTime) {
      const [startHour, startMin] = formData.startTime.split(':').map(Number);
      const [endHour, endMin] = formData.endTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      if (startMinutes >= endMinutes) {
        newErrors.time = 'End time must be after start time';
      }
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
      purpose: formData.purpose,
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
            <label htmlFor="purpose">Purpose of Booking *</label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="e.g., Faculty meeting, Campus event, etc."
              rows={3}
              className={errors.purpose ? 'error' : ''}
            />
            {errors.purpose && <span className="error-text">{errors.purpose}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="expectedAttendees">Expected Attendees</label>
            <input
              type="number"
              id="expectedAttendees"
              name="expectedAttendees"
              value={formData.expectedAttendees}
              onChange={handleChange}
              min={1}
              max={100}
            />
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
