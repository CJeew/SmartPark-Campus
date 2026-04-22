import React, { useEffect, useState, useCallback } from 'react';
import NotificationItem from '../components/NotificationItem';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { dashboardService } from '../services/dashboardService';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
    setRecentNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const handleDeleteNotification = (id) => {
    setRecentNotifications(prev => prev.filter(n => n.id !== id));
  };

  const navItems = [
    {
      key: 'overview',
      label: 'Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      key: 'browse-zones',
      label: 'Browse Parking Zones',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      key: 'my-bookings',
      label: 'My Bookings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      key: 'report-issue',
      label: 'Report an Issue',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      key: 'my-tickets',
      label: 'My Tickets',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h10a2 2 0 012 2v3H5V5zm0 8a2 2 0 012-2h10a2 2 0 012 2v3H5v-3z" />
        </svg>
      ),
    },
  ];

  const sectionTitles = {
    overview: 'Dashboard Overview',
    'browse-zones': 'Browse Parking Zones',
    'my-bookings': 'My Bookings',
    'report-issue': 'Report an Issue',
    'my-tickets': 'My Tickets',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-5 shadow-lg flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          title="Toggle Sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h-2m0 0h-2m2 0V8m0 2v2M7 20h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v13a2 2 0 002 2z" />
        </svg>
        <div>
          <h1 className="text-2xl font-bold leading-tight">SmartPark Campus</h1>
          <p className="text-blue-100 text-sm">Welcome back, {user.fullName || 'User'}</p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col shadow-sm flex-shrink-0`}
        >
          <nav className="flex-1 py-6 px-3 space-y-1">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeSection === item.key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="px-4 pb-6">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-1">Logged in as</p>
              <p className="text-sm font-bold text-blue-900 truncate">{user.fullName || 'User'}</p>
              <p className="text-xs text-blue-600 truncate">{user.email || ''}</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Section Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-4">
            <h2 className="text-xl font-bold text-gray-900">{sectionTitles[activeSection]}</h2>
          </div>

          <div className="px-8 py-8">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-5 flex items-start gap-3">
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
              <div className="space-y-10">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {loading ? (
                    <LoadingSkeleton type="stat" count={4} />
                  ) : (
                    <>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-600 text-xs font-semibold uppercase tracking-wide">Total Bookings</p>
                            <p className="text-3xl font-bold text-blue-900 mt-2">{stats.totalBookings || 0}</p>
                          </div>
                          <svg className="w-11 h-11 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-600 text-xs font-semibold uppercase tracking-wide">Active Now</p>
                            <p className="text-3xl font-bold text-green-900 mt-2">{stats.activeBookingCount || 0}</p>
                          </div>
                          <svg className="w-11 h-11 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-orange-600 text-xs font-semibold uppercase tracking-wide">Open Issues</p>
                            <p className="text-3xl font-bold text-orange-900 mt-2">{stats.openTickets || 0}</p>
                          </div>
                          <svg className="w-11 h-11 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-600 text-xs font-semibold uppercase tracking-wide">Resolved</p>
                            <p className="text-3xl font-bold text-purple-900 mt-2">{stats.resolvedTickets || 0}</p>
                          </div>
                          <svg className="w-11 h-11 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Active Booking + Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Active Booking
                    </h3>
                    {loading ? (
                      <LoadingSkeleton type="card" count={1} />
                    ) : activeBooking ? (
                      <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                          <div>
                            <p className="text-gray-500 text-xs font-medium">Slot Number</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{activeBooking.slotNumber}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs font-medium">Zone</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{activeBooking.zoneName}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs font-medium">Vehicle</p>
                            <p className="text-lg font-bold text-gray-900 mt-1">{activeBooking.vehicleType}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs font-medium">Date</p>
                            <p className="text-base font-semibold text-gray-900 mt-1">{activeBooking.date}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs font-medium">Time</p>
                            <p className="text-base font-semibold text-gray-900 mt-1">{activeBooking.startTime} – {activeBooking.endTime}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs font-medium">Status</p>
                            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold mt-1">
                              {activeBooking.status}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveSection('my-bookings')}
                          className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                        >
                          View All Bookings →
                        </button>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl shadow-sm p-10 text-center border border-gray-200">
                        <div className="text-4xl mb-3">📪</div>
                        <h4 className="text-lg font-bold text-gray-900 mb-1">No Active Booking</h4>
                        <p className="text-gray-500 text-sm mb-5">You don't have any active bookings at the moment.</p>
                        <button
                          onClick={() => setActiveSection('browse-zones')}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
                        >
                          Browse Available Slots
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Notifications */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      Notifications
                    </h3>
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
                      <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-gray-500 text-sm">You're all caught up!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Tickets */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Recent Issues
                    </h3>
                    <button
                      onClick={() => setActiveSection('my-tickets')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                    >
                      View All →
                    </button>
                  </div>
                  {loading ? (
                    <LoadingSkeleton type="list" count={3} />
                  ) : recentTickets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {recentTickets.map(ticket => (
                        <div
                          key={ticket.id}
                          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-5 border border-gray-100 cursor-pointer"
                          onClick={() => window.location.href = `/tickets/${ticket.id}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-bold text-gray-900 flex-1 text-sm">{ticket.title}</h4>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ml-2 ${
                              ticket.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                              ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                              ticket.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {ticket.priority}
                            </span>
                          </div>
                          <p className="text-gray-500 text-xs mb-3">{ticket.location}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">{ticket.category}</span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                              ticket.status === 'OPEN' ? 'bg-blue-100 text-blue-800' :
                              ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>{ticket.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl p-10 text-center border border-gray-200">
                      <div className="text-4xl mb-3">📭</div>
                      <p className="text-gray-500 text-sm mb-4">No issues reported yet.</p>
                      <button
                        onClick={() => setActiveSection('report-issue')}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
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
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">
                  <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Find a Parking Spot</h3>
                  <p className="text-gray-500 mb-8">Browse all available campus parking zones and book a spot that suits your schedule.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
                    {[
                      { label: 'Zone A', desc: 'Faculty & Staff', color: 'blue' },
                      { label: 'Zone B', desc: 'Students', color: 'green' },
                      { label: 'Zone C', desc: 'Visitors', color: 'purple' },
                    ].map(zone => (
                      <div key={zone.label} className={`bg-${zone.color}-50 border border-${zone.color}-200 rounded-xl p-4`}>
                        <p className={`text-${zone.color}-700 font-bold text-lg`}>{zone.label}</p>
                        <p className={`text-${zone.color}-600 text-sm`}>{zone.desc}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => window.location.href = '/zones'}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-base"
                  >
                    View All Parking Zones →
                  </button>
                </div>
              </div>
            )}

            {/* ── MY BOOKINGS ── */}
            {activeSection === 'my-bookings' && (
              <div className="space-y-6">
                {loading ? (
                  <LoadingSkeleton type="card" count={3} />
                ) : activeBooking ? (
                  <>
                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">Active Booking</h3>
                        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">ACTIVE</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                        <div>
                          <p className="text-gray-500 text-xs font-medium">Slot Number</p>
                          <p className="text-xl font-bold text-gray-900 mt-1">{activeBooking.slotNumber}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs font-medium">Zone</p>
                          <p className="text-xl font-bold text-gray-900 mt-1">{activeBooking.zoneName}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs font-medium">Vehicle</p>
                          <p className="text-base font-bold text-gray-900 mt-1">{activeBooking.vehicleType}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs font-medium">Date</p>
                          <p className="text-base font-semibold text-gray-900 mt-1">{activeBooking.date}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs font-medium">Time</p>
                          <p className="text-base font-semibold text-gray-900 mt-1">{activeBooking.startTime} – {activeBooking.endTime}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => window.location.href = `/my-bookings/${activeBooking.id}`}
                        className="mt-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
                      >
                        View Details →
                      </button>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => window.location.href = '/my-bookings'}
                        className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
                      >
                        View Full Booking History →
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center max-w-lg">
                    <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5">
                      <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Bookings Yet</h3>
                    <p className="text-gray-500 text-sm mb-6">You haven't made any bookings yet. Find a parking spot to get started.</p>
                    <button
                      onClick={() => setActiveSection('browse-zones')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
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
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">
                  <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Report a Problem</h3>
                  <p className="text-gray-500 mb-8 text-sm">
                    Encountered an issue with a parking slot, equipment, or anything else on campus? Let us know and we'll address it promptly.
                  </p>
                  <div className="space-y-3 mb-8 text-left">
                    {[
                      { label: 'Parking Equipment', desc: 'Broken barriers, sensors, or signs' },
                      { label: 'Safety Concern', desc: 'Hazards or security issues' },
                      { label: 'Booking Issue', desc: 'Problems with a reservation' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
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
                    onClick={() => window.location.href = '/tickets/new'}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors text-base"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {recentTickets.map(ticket => (
                        <div
                          key={ticket.id}
                          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-5 border border-gray-100 cursor-pointer"
                          onClick={() => window.location.href = `/tickets/${ticket.id}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-bold text-gray-900 flex-1 text-sm">{ticket.title}</h4>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ml-2 ${
                              ticket.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                              ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                              ticket.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {ticket.priority}
                            </span>
                          </div>
                          <p className="text-gray-500 text-xs mb-3">{ticket.location}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">{ticket.category}</span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                              ticket.status === 'OPEN' ? 'bg-blue-100 text-blue-800' :
                              ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>{ticket.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => window.location.href = '/my-tickets'}
                        className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
                      >
                        View All Tickets →
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center max-w-lg">
                    <div className="bg-purple-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5">
                      <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h10a2 2 0 012 2v3H5V5zm0 8a2 2 0 012-2h10a2 2 0 012 2v3H5v-3z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Tickets Submitted</h3>
                    <p className="text-gray-500 text-sm mb-6">You haven't submitted any issue reports yet.</p>
                    <button
                      onClick={() => setActiveSection('report-issue')}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
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
    </div>
  );
};

export default Dashboard;
