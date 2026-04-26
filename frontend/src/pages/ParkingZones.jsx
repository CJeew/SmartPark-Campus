import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { parkingZoneService } from '../services/parkingZoneService';
import bookingService from '../services/bookingService';
import SlotSelector3D from '../components/parking/SlotSelector3D';
import BookingForm from '../components/BookingForm';
import BookingList from '../components/BookingList';
import UserSidebar from '../components/UserSidebar';
import { useToast } from '../context/ToastContext';

const RefreshIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const ParkingZones = () => {
  const navigate = useNavigate();
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { showToast } = useToast();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const loadZones = useCallback(async () => {
    try {
      setLoading(true);
      const data = await parkingZoneService.getAll({ page: 0, size: 100 });
      setZones((data.content || []).filter(z => z.status !== 'OUT_OF_SERVICE'));
    } catch (error) {
      showToast('Failed to load parking zones', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadZones();
  }, [loadZones]);

  const handleSlotSelect = (slot) => setSelectedSlot(slot);

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
      setSelectedSlot(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      const errorMessage = error.error || error.message || 'Failed to create booking';
      showToast(errorMessage, 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleNavChange = (section) => {
    if (section === 'browse-zones') return;
    navigate('/dashboard', { state: { section } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserSidebar
        activeSection="browse-zones"
        onNavChange={handleNavChange}
        openTicketsCount={0}
      />

      <main className="flex-1 overflow-auto flex flex-col">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Browse Parking Zones</h2>
            <p className="text-xs text-gray-400 mt-0.5">{today}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadZones}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshIcon />
              Refresh
            </button>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user?.fullName?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
          </div>
        </header>

        <div className="flex-1 px-8 py-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <p className="text-sm text-gray-500">Loading parking zones...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Slot selector + booking form */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">Select a Parking Slot</h3>
                </div>

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
                  <div className="py-12 text-center">
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No parking zones available at the moment.</p>
                  </div>
                )}
              </div>

              {/* Booking history */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">My Booking History</h3>
                </div>
                <BookingList refreshTrigger={refreshTrigger} />
              </div>

              {/* Info cards row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Legend */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h4 className="text-sm font-semibold text-gray-800 mb-4">Slot Status Legend</h4>
                  <div className="space-y-2.5">
                    {[
                      { color: 'bg-green-500', label: 'Available' },
                      { color: 'bg-red-500',   label: 'Occupied' },
                      { color: 'bg-blue-500',  label: 'Selected' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full flex-shrink-0 ${item.color}`} />
                        <span className="text-sm text-gray-600">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking workflow */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h4 className="text-sm font-semibold text-gray-800 mb-4">Booking Workflow</h4>
                  <ol className="space-y-2">
                    {[
                      { step: '1', text: 'Select an available slot from the 3D view' },
                      { step: '2', text: 'Fill in dates, times, and purpose' },
                      { step: '3', text: 'Submit — awaits admin approval' },
                      { step: '4', text: 'Approved? Use your slot during booked hours' },
                    ].map(item => (
                      <li key={item.step} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {item.step}
                        </span>
                        <span className="text-xs text-gray-600 leading-relaxed">{item.text}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Rules */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h4 className="text-sm font-semibold text-gray-800 mb-4">Booking Rules</h4>
                  <ul className="space-y-2">
                    {[
                      'No overlapping bookings on the same slot',
                      'Future dates only — no past bookings',
                      'Use the correct vehicle type for the slot',
                      'Approved bookings can be cancelled',
                      'Rejected bookings can be re-submitted',
                    ].map((rule, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <svg className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-gray-600 leading-relaxed">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ParkingZones;
