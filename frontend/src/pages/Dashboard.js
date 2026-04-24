import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationItem from '../components/NotificationItem';
import LoadingSkeleton from '../components/LoadingSkeleton';
import UserSidebar from '../components/UserSidebar';
import StatusBadge from '../components/StatusBadge';
import { dashboardService } from '../services/dashboardService';
import { bookingService } from '../services/bookingService';

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
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(location.state?.section || 'overview');
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

  const [userBookings, setUserBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState(null);
  const [bookingStatusFilter, setBookingStatusFilter] = useState('ALL');
  const [cancelModal, setCancelModal] = useState({ open: false, booking: null });
  const [cancelLoading, setCancelLoading] = useState(false);

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

  const fetchUserBookings = useCallback(async () => {
    setBookingsLoading(true);
    setBookingsError(null);
    try {
      const data = await bookingService.getUserBookings();
      setUserBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setBookingsError('Failed to load bookings.');
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeSection === 'my-bookings') {
      fetchUserBookings();
    }
  }, [activeSection, fetchUserBookings]);

  const handleCancelBooking = async () => {
    if (!cancelModal.booking) return;
    const id = cancelModal.booking.id ?? cancelModal.booking.bookingId;
    setCancelLoading(true);
    try {
      await bookingService.cancelBooking(id);
      setUserBookings(prev =>
        prev.map(b => (b.id ?? b.bookingId) === id ? { ...b, status: 'CANCELLED' } : b)
      );
      setCancelModal({ open: false, booking: null });
    } catch (err) {
      setBookingsError('Failed to cancel booking. Please try again.');
      setCancelModal({ open: false, booking: null });
    } finally {
      setCancelLoading(false);
    }
  };

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
            <div className="space-y-6">

              {/* Welcome banner */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                    {user?.fullName?.charAt(0)?.toUpperCase() ?? 'U'}
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">Welcome back,</p>
                    <h3 className="text-white text-xl font-bold leading-tight">{user?.fullName ?? 'User'}</h3>
                    <p className="text-blue-200 text-xs mt-0.5">{today}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/zones')}
                  className="px-5 py-2 bg-white text-blue-700 text-sm font-semibold rounded-lg hover:bg-blue-50 transition-colors flex-shrink-0"
                >
                  + Book a Slot
                </button>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? (
                  <LoadingSkeleton type="stat" count={4} />
                ) : (
                  <>
                    <div
                      onClick={() => setActiveSection('my-bookings')}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                    >
                      <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Bookings</p>
                        <p className="text-3xl font-bold text-gray-800 leading-tight">{stats.totalBookings || 0}</p>
                        <p className="text-xs text-gray-400 mt-0.5">All time</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
                      <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Active Now</p>
                        <p className="text-3xl font-bold text-gray-800 leading-tight">{stats.activeBookingCount || 0}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Currently parked</p>
                      </div>
                    </div>
                    <div
                      onClick={() => setActiveSection('my-tickets')}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                    >
                      <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Open Issues</p>
                        <p className="text-3xl font-bold text-gray-800 leading-tight">{stats.openTickets || 0}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Awaiting review</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
                      <div className="w-11 h-11 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Resolved</p>
                        <p className="text-3xl font-bold text-gray-800 leading-tight">{stats.resolvedTickets || 0}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Issues closed</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Quick action shortcuts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    label: 'Browse Parking Zones',
                    desc: 'Find and book an available slot',
                    color: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
                    textColor: 'text-blue-700',
                    btnColor: 'bg-blue-500 hover:bg-blue-600',
                    action: () => navigate('/zones'),
                  },
                  {
                    label: 'My Bookings',
                    desc: `${stats.totalBookings || 0} total booking${stats.totalBookings !== 1 ? 's' : ''} made`,
                    color: 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100',
                    textColor: 'text-emerald-700',
                    btnColor: 'bg-emerald-500 hover:bg-emerald-600',
                    action: () => setActiveSection('my-bookings'),
                  },
                  {
                    label: 'Report an Issue',
                    desc: 'Parking problem? Let us know',
                    color: 'border-amber-200 bg-amber-50 hover:bg-amber-100',
                    textColor: 'text-amber-700',
                    btnColor: 'bg-amber-500 hover:bg-amber-600',
                    action: () => setActiveSection('report-issue'),
                  },
                ].map(item => (
                  <div
                    key={item.label}
                    onClick={item.action}
                    className={`border rounded-xl p-4 cursor-pointer transition-colors ${item.color}`}
                  >
                    <p className={`text-sm font-semibold ${item.textColor}`}>{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5 mb-3">{item.desc}</p>
                    <button className={`text-xs text-white px-3 py-1 rounded-md font-medium transition-colors ${item.btnColor}`}>
                      Go →
                    </button>
                  </div>
                ))}
              </div>

              {/* Active Booking + Notifications */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Active booking panel */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-800">Active Booking</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Your current parking session</p>
                    </div>
                    <button
                      onClick={() => setActiveSection('my-bookings')}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View all →
                    </button>
                  </div>

                  {loading ? (
                    <div className="p-6 space-y-3">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="animate-pulse bg-gray-200 rounded-full w-9 h-9" />
                          <div className="flex-1 space-y-1.5">
                            <div className="animate-pulse bg-gray-200 rounded h-3.5 w-40" />
                            <div className="animate-pulse bg-gray-200 rounded h-3 w-56" />
                          </div>
                          <div className="animate-pulse bg-gray-200 rounded-full h-6 w-20" />
                        </div>
                      ))}
                    </div>
                  ) : activeBooking ? (
                    <div className="px-6 py-4 flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {activeBooking.slotNumber}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">
                          {activeBooking.zoneName}
                          <span className="text-gray-400 font-normal ml-2 text-xs">· {activeBooking.vehicleType}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {activeBooking.date} · {activeBooking.startTime} – {activeBooking.endTime}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex-shrink-0">
                        {activeBooking.status}
                      </span>
                    </div>
                  ) : (
                    <div className="px-6 py-10 text-center">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm font-medium">No Active Booking</p>
                      <p className="text-gray-400 text-xs mt-1 mb-4">You don't have any active bookings right now.</p>
                      <button
                        onClick={() => navigate('/zones')}
                        className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Browse Available Slots
                      </button>
                    </div>
                  )}
                </div>

                {/* Notifications panel */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-base font-semibold text-gray-800">Notifications</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Recent alerts</p>
                  </div>
                  {loading ? (
                    <div className="p-4 space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-14" />
                      ))}
                    </div>
                  ) : recentNotifications.length > 0 ? (
                    <div className="divide-y divide-gray-50">
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
                    <div className="px-6 py-10 text-center">
                      <svg className="w-9 h-9 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-gray-400 text-sm">You're all caught up!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Issues panel */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">Recent Issues</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Your latest submitted tickets</p>
                  </div>
                  <button
                    onClick={() => setActiveSection('my-tickets')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all →
                  </button>
                </div>

                {loading ? (
                  <div className="p-6 space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="animate-pulse bg-gray-200 rounded-full w-9 h-9" />
                        <div className="flex-1 space-y-1.5">
                          <div className="animate-pulse bg-gray-200 rounded h-3.5 w-40" />
                          <div className="animate-pulse bg-gray-200 rounded h-3 w-56" />
                        </div>
                        <div className="animate-pulse bg-gray-200 rounded-full h-6 w-20" />
                      </div>
                    ))}
                  </div>
                ) : recentTickets.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {recentTickets.map(ticket => (
                      <div
                        key={ticket.id}
                        className="px-6 py-3 flex items-center gap-4 hover:bg-gray-50/60 transition-colors cursor-pointer"
                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                          ticket.priority === 'CRITICAL' ? 'bg-gradient-to-br from-red-400 to-red-600' :
                          ticket.priority === 'HIGH'     ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                          ticket.priority === 'MEDIUM'   ? 'bg-gradient-to-br from-yellow-400 to-amber-500' :
                                                           'bg-gradient-to-br from-green-400 to-green-600'
                        }`}>
                          {ticket.priority?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{ticket.title}</p>
                          <p className="text-xs text-gray-400 truncate">
                            {ticket.category}
                            {ticket.location ? ` · ${ticket.location}` : ''}
                          </p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          ticket.status === 'OPEN'        ? 'bg-blue-100 text-blue-700' :
                          ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-green-100 text-green-700'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-10 text-center">
                    <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">No Issues Reported</p>
                    <p className="text-gray-400 text-xs mt-1 mb-4">Everything looks good on your end.</p>
                    <button
                      onClick={() => setActiveSection('report-issue')}
                      className="px-4 py-1.5 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
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
              {/* Filter tabs + refresh */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                  {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(s => (
                    <button
                      key={s}
                      onClick={() => setBookingStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                        bookingStatusFilter === s
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
                <button
                  onClick={fetchUserBookings}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshIcon />
                  Refresh
                </button>
              </div>

              {bookingsError && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 text-sm text-red-700">
                  {bookingsError}
                </div>
              )}

              {bookingsLoading ? (
                <LoadingSkeleton type="card" count={4} />
              ) : (() => {
                const filtered = bookingStatusFilter === 'ALL'
                  ? userBookings
                  : userBookings.filter(b => b.status === bookingStatusFilter);

                if (filtered.length === 0) {
                  return (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center max-w-lg">
                      <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {bookingStatusFilter === 'ALL' ? 'No Bookings Yet' : `No ${bookingStatusFilter.charAt(0) + bookingStatusFilter.slice(1).toLowerCase()} Bookings`}
                      </h3>
                      <p className="text-gray-500 text-sm mb-5">
                        {bookingStatusFilter === 'ALL'
                          ? "You haven't made any bookings yet."
                          : `You have no bookings with status "${bookingStatusFilter.toLowerCase()}".`}
                      </p>
                      {bookingStatusFilter === 'ALL' && (
                        <button
                          onClick={() => navigate('/zones')}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Browse Parking Zones
                        </button>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((booking, idx) => {
                      const id = booking.id ?? booking.bookingId ?? idx;
                      const vehicle = booking.vehicleType === 'THREE_WHEELER' ? '3-Wheeler' : booking.vehicleType;
                      return (
                        <div
                          key={id}
                          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                        >
                          {/* Header row */}
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="text-base font-bold text-gray-800">
                                Slot {booking.slotNumber}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">{booking.zoneName}</p>
                            </div>
                            <StatusBadge status={booking.status} size="sm" />
                          </div>

                          {/* Details grid */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
                              <p className="text-sm font-semibold text-gray-700 mt-0.5">{booking.date}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wide">Vehicle</p>
                              <p className="text-sm font-semibold text-gray-700 mt-0.5">{vehicle}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-xs text-gray-400 uppercase tracking-wide">Time</p>
                              <p className="text-sm font-semibold text-gray-700 mt-0.5">
                                {booking.startTime} – {booking.endTime}
                              </p>
                            </div>
                          </div>

                          {/* Rejection reason */}
                          {booking.rejectionReason && (
                            <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">
                              <p className="text-xs text-red-600 font-medium">Rejection Reason</p>
                              <p className="text-xs text-red-500 mt-0.5">{booking.rejectionReason}</p>
                            </div>
                          )}

                          {/* Cancel button — only for cancellable statuses */}
                          {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                            <button
                              onClick={() => setCancelModal({ open: true, booking })}
                              className="w-full mt-1 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
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

      {/* Cancel confirmation modal */}
      {cancelModal.open && cancelModal.booking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => !cancelLoading && setCancelModal({ open: false, booking: null })} />
          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">Cancel Booking</h3>
                <p className="text-xs text-gray-500">
                  Slot {cancelModal.booking.slotNumber} · {cancelModal.booking.zoneName}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setCancelModal({ open: false, booking: null })}
                disabled={cancelLoading}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={cancelLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelLoading ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
