import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationItem from '../components/NotificationItem';
import LoadingSkeleton from '../components/LoadingSkeleton';
import UserSidebar from '../components/UserSidebar';
import { dashboardService } from '../services/dashboardService';

const RefreshIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const sectionTitles = {
  overview:       'Dashboard Overview',
  'browse-zones': 'Browse Parking Zones',
  'my-bookings':  'My Bookings',
  'report-issue': 'Report an Issue',
  'my-tickets':   'My Tickets',
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookingCount: 0,
    openTickets: 0,
    resolvedTickets: 0,
  });
  const [activeBooking, setActiveBooking] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, bookingData, ticketsData, notificationsData] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getActiveBooking(),
        dashboardService.getRecentTickets(3),
        dashboardService.getRecentNotifications(3),
      ]);
      setStats(statsData || {});
      setActiveBooking(bookingData);
      setRecentTickets(Array.isArray(ticketsData) ? ticketsData : []);
      setRecentNotifications(Array.isArray(notificationsData) ? notificationsData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleMarkNotificationRead = (id) => {
    setRecentNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleDeleteNotification = (id) => {
    setRecentNotifications(prev => prev.filter(n => n.id !== id));
  };

  const openTicketsCount = recentTickets.filter(t => t.status === 'OPEN').length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserSidebar
        activeSection={activeSection}
        onNavChange={(section) => {
          if (section === 'browse-zones') {
            navigate('/zones');
          } else {
            setActiveSection(section);
          }
        }}
        openTicketsCount={openTicketsCount}
      />

      <main className="flex-1 overflow-auto flex flex-col">
        {/* Top header bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{sectionTitles[activeSection]}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{today}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshIcon />
              Refresh
            </button>
            <button
              onClick={() => setActiveSection('browse-zones')}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Book a Slot
            </button>
            {/* User avatar */}
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user?.fullName?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
          </div>
        </header>

        <div className="flex-1 px-8 py-6">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-red-800 font-semibold text-sm">Error Loading Data</p>
                <p className="text-red-700 text-sm mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* ── OVERVIEW ── */}
          {activeSection === 'overview' && (
            <div className="space-y-8">
              {/* Stat cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {loading ? (
                  <LoadingSkeleton type="stat" count={4} />
                ) : (
                  <>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
                      <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Bookings</p>
                        <p className="text-3xl font-bold text-gray-800 leading-tight">{stats.totalBookings || 0}</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
                      <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Active Now</p>
                        <p className="text-3xl font-bold text-gray-800 leading-tight">{stats.activeBookingCount || 0}</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
                      <div className="w-11 h-11 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Open Issues</p>
                        <p className="text-3xl font-bold text-gray-800 leading-tight">{stats.openTickets || 0}</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
                      <div className="w-11 h-11 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Resolved</p>
                        <p className="text-3xl font-bold text-gray-800 leading-tight">{stats.resolvedTickets || 0}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Active Booking + Notifications */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-800">Active Booking</h3>
                  </div>
                  {loading ? (
                    <LoadingSkeleton type="card" count={1} />
                  ) : activeBooking ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-blue-500">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-5">
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Slot</p>
                          <p className="text-2xl font-bold text-gray-800 mt-1">{activeBooking.slotNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Zone</p>
                          <p className="text-2xl font-bold text-gray-800 mt-1">{activeBooking.zoneName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Vehicle</p>
                          <p className="text-lg font-bold text-gray-800 mt-1">{activeBooking.vehicleType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Date</p>
                          <p className="text-sm font-semibold text-gray-700 mt-1">{activeBooking.date}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Time</p>
                          <p className="text-sm font-semibold text-gray-700 mt-1">{activeBooking.startTime} – {activeBooking.endTime}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Status</p>
                          <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold mt-1">
                            {activeBooking.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveSection('my-bookings')}
                        className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View All Bookings →
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
                      <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h4 className="text-base font-semibold text-gray-800 mb-1">No Active Booking</h4>
                      <p className="text-gray-500 text-sm mb-4">You don't have any active bookings right now.</p>
                      <button
                        onClick={() => setActiveSection('browse-zones')}
                        className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Browse Available Slots
                      </button>
                    </div>
                  )}
                </div>

                {/* Notifications */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-800">Notifications</h3>
                  </div>
                  {loading ? (
                    <LoadingSkeleton type="list" count={3} />
                  ) : recentNotifications.length > 0 ? (
                    <div className="space-y-2">
                      {recentNotifications.map(n => (
                        <NotificationItem
                          key={n.id}
                          notificationId={n.id}
                          message={n.message}
                          type={n.type}
                          isRead={n.isRead}
                          createdAt={n.createdAt}
                          onMarkRead={() => handleMarkNotificationRead(n.id)}
                          onDelete={() => handleDeleteNotification(n.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                      <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-gray-500 text-sm">You're all caught up!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Issues */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-800">Recent Issues</h3>
                  <button
                    onClick={() => setActiveSection('my-tickets')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All →
                  </button>
                </div>
                {loading ? (
                  <LoadingSkeleton type="list" count={3} />
                ) : recentTickets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentTickets.map(ticket => (
                      <div
                        key={ticket.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-gray-800 flex-1 text-sm leading-snug">{ticket.title}</h4>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ml-2 ${
                            ticket.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                            ticket.priority === 'HIGH'     ? 'bg-orange-100 text-orange-700' :
                            ticket.priority === 'MEDIUM'   ? 'bg-yellow-100 text-yellow-700' :
                                                             'bg-green-100 text-green-700'
                          }`}>
                            {ticket.priority}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs mb-3">{ticket.location}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">{ticket.category}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            ticket.status === 'OPEN'        ? 'bg-blue-100 text-blue-700' :
                            ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' :
                                                              'bg-green-100 text-green-700'
                          }`}>{ticket.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
                    <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">No issues reported yet.</p>
                    <button
                      onClick={() => setActiveSection('report-issue')}
                      className="px-4 py-1.5 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Report an Issue
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── BROWSE PARKING ZONES ── */}
          {activeSection === 'browse-zones' && (
            <div className="max-w-2xl">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Find a Parking Spot</h3>
                <p className="text-gray-500 text-sm mb-7">Browse all available campus parking zones and book a spot that suits your schedule.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7 text-left">
                  {[
                    { label: 'Zone A', desc: 'Faculty & Staff',  color: 'blue' },
                    { label: 'Zone B', desc: 'Students',         color: 'green' },
                    { label: 'Zone C', desc: 'Visitors',         color: 'purple' },
                  ].map(zone => (
                    <div key={zone.label} className={`bg-${zone.color}-50 border border-${zone.color}-100 rounded-xl p-4`}>
                      <p className={`text-${zone.color}-700 font-bold text-lg`}>{zone.label}</p>
                      <p className={`text-${zone.color}-600 text-sm`}>{zone.desc}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/zones')}
                  className="w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View All Parking Zones →
                </button>
              </div>
            </div>
          )}

          {/* ── MY BOOKINGS ── */}
          {activeSection === 'my-bookings' && (
            <div className="space-y-5">
              {loading ? (
                <LoadingSkeleton type="card" count={3} />
              ) : activeBooking ? (
                <>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-blue-500">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-800">Active Booking</h3>
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-5">
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Slot</p>
                        <p className="text-xl font-bold text-gray-800 mt-1">{activeBooking.slotNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Zone</p>
                        <p className="text-xl font-bold text-gray-800 mt-1">{activeBooking.zoneName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Vehicle</p>
                        <p className="text-base font-bold text-gray-800 mt-1">{activeBooking.vehicleType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Date</p>
                        <p className="text-sm font-semibold text-gray-700 mt-1">{activeBooking.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Time</p>
                        <p className="text-sm font-semibold text-gray-700 mt-1">{activeBooking.startTime} – {activeBooking.endTime}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/my-bookings/${activeBooking.id}`)}
                      className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details →
                    </button>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => navigate('/my-bookings')}
                      className="px-4 py-1.5 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      View Full Booking History →
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center max-w-lg">
                  <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">No Bookings Yet</h3>
                  <p className="text-gray-500 text-sm mb-5">You haven't made any bookings yet. Find a parking spot to get started.</p>
                  <button
                    onClick={() => setActiveSection('browse-zones')}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Parking Zones
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── REPORT AN ISSUE ── */}
          {activeSection === 'report-issue' && (
            <div className="max-w-xl">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Report a Problem</h3>
                <p className="text-gray-500 text-sm mb-7">
                  Encountered an issue with a parking slot, equipment, or anything else on campus? Let us know and we'll address it promptly.
                </p>
                <div className="space-y-3 mb-7 text-left">
                  {[
                    { label: 'Parking Equipment', desc: 'Broken barriers, sensors, or signs' },
                    { label: 'Safety Concern',    desc: 'Hazards or security issues' },
                    { label: 'Booking Issue',     desc: 'Problems with a reservation' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-lg px-4 py-3">
                      <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/tickets/new')}
                  className="w-full px-4 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Submit a Report →
                </button>
              </div>
            </div>
          )}

          {/* ── MY TICKETS ── */}
          {activeSection === 'my-tickets' && (
            <div className="space-y-5">
              {loading ? (
                <LoadingSkeleton type="list" count={3} />
              ) : recentTickets.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentTickets.map(ticket => (
                      <div
                        key={ticket.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-gray-800 flex-1 text-sm leading-snug">{ticket.title}</h4>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ml-2 ${
                            ticket.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                            ticket.priority === 'HIGH'     ? 'bg-orange-100 text-orange-700' :
                            ticket.priority === 'MEDIUM'   ? 'bg-yellow-100 text-yellow-700' :
                                                             'bg-green-100 text-green-700'
                          }`}>
                            {ticket.priority}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs mb-3">{ticket.location}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">{ticket.category}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            ticket.status === 'OPEN'        ? 'bg-blue-100 text-blue-700' :
                            ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' :
                                                              'bg-green-100 text-green-700'
                          }`}>{ticket.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => navigate('/my-tickets')}
                      className="px-4 py-1.5 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      View All Tickets →
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center max-w-lg">
                  <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h10a2 2 0 012 2v3H5V5zm0 8a2 2 0 012-2h10a2 2 0 012 2v3H5v-3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">No Tickets Submitted</h3>
                  <p className="text-gray-500 text-sm mb-5">You haven't submitted any issue reports yet.</p>
                  <button
                    onClick={() => setActiveSection('report-issue')}
                    className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Report an Issue
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
