import React, { useEffect, useState, useCallback } from 'react';
import StatCard from '../components/StatCard';
import BookingCard from '../components/BookingCard';
import TicketCard from '../components/TicketCard';
import NotificationItem from '../components/NotificationItem';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { dashboardService } from '../services/dashboardService';

const Dashboard = () => {
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
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleMarkNotificationRead = (notificationId) => {
    setRecentNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleDeleteNotification = (notificationId) => {
    setRecentNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-12 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h-2m0 0h-2m2 0V8m0 2v2M7 20h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v13a2 2 0 002 2z" />
            </svg>
            <div>
              <h1 className="text-4xl font-bold">Welcome back, {user.fullName || 'User'}</h1>
              <p className="text-blue-100 mt-1 text-lg">Parking activity overview</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 rounded-lg p-6 flex items-start gap-4">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-red-800 font-semibold">Error Loading Data</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {loading ? (
            <LoadingSkeleton type="stat" count={4} />
          ) : (
            <>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">Total Bookings</p>
                    <p className="text-3xl font-bold text-blue-900 mt-3">{stats.totalBookings || 0}</p>
                  </div>
                  <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-semibold uppercase tracking-wide">Active Now</p>
                    <p className="text-3xl font-bold text-green-900 mt-3">{stats.activeBookingCount || 0}</p>
                  </div>
                  <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-semibold uppercase tracking-wide">Open Issues</p>
                    <p className="text-3xl font-bold text-orange-900 mt-3">{stats.openTickets || 0}</p>
                  </div>
                  <svg className="w-12 h-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-semibold uppercase tracking-wide">Resolved</p>
                    <p className="text-3xl font-bold text-purple-900 mt-3">{stats.resolvedTickets || 0}</p>
                  </div>
                  <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main Section - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Active Booking - Larger Column */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              My Active Booking
            </h2>
            {loading ? (
              <LoadingSkeleton type="card" count={1} />
            ) : activeBooking ? (
              <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-500">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Slot Number</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{activeBooking.slotNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Zone</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{activeBooking.zoneName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Vehicle</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{activeBooking.vehicleType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Date</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{activeBooking.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Time</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{activeBooking.startTime} - {activeBooking.endTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Status</p>
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mt-1">
                      {activeBooking.status}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => window.location.href = `/my-bookings/${activeBooking.id}`}
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  View Details →
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
                <div className="text-5xl mb-4">📪</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Booking</h3>
                <p className="text-gray-600 mb-6">You don't have any active bookings at the moment.</p>
                <button
                  onClick={() => window.location.href = '/zones'}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Browse Available Slots
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/zones'}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Parking Zones
              </button>
              <button
                onClick={() => window.location.href = '/my-bookings'}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                My Bookings
              </button>
              <button
                onClick={() => window.location.href = '/tickets/new'}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0v2m0-2H10m4 0h2m-4 0v-2m0 2v2" />
                </svg>
                Report an Issue
              </button>
              <button
                onClick={() => window.location.href = '/my-tickets'}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h10a2 2 0 012 2v3H5V5zm0 8a2 2 0 012-2h10a2 2 0 012 2v3H5v-3zm0 8a2 2 0 012-2h10a2 2 0 012 2v3H5v-3z" />
                </svg>
                My Tickets
              </button>
            </div>
          </div>
        </div>

        {/* Recent Issues Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Issues
            </h2>
            <a href="/my-tickets" className="text-blue-600 font-semibold hover:text-blue-700 text-sm">
              View All →
            </a>
          </div>

          {loading ? (
            <LoadingSkeleton type="list" count={3} />
          ) : recentTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentTickets.map(ticket => (
                <div key={ticket.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 cursor-pointer"
                  onClick={() => window.location.href = `/tickets/${ticket.id}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-gray-900 flex-1">{ticket.title}</h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ml-2 ${
                      ticket.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                      ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                      ticket.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{ticket.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{ticket.category}</span>
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
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Issues Reported</h3>
              <p className="text-gray-600 mb-6">You haven't submitted any incident reports yet.</p>
              <button
                onClick={() => window.location.href = '/tickets/new'}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Report an Issue
              </button>
            </div>
          )}
        </div>

        {/* Notifications Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Notifications
            </h2>
            <a href="/notifications" className="text-blue-600 font-semibold hover:text-blue-700 text-sm">
              View All →
            </a>
          </div>

          {loading ? (
            <LoadingSkeleton type="list" count={3} />
          ) : recentNotifications.length > 0 ? (
            <div className="space-y-3">
              {recentNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notificationId={notification.id}
                  message={notification.message}
                  type={notification.type}
                  isRead={notification.isRead}
                  createdAt={notification.createdAt}
                  onMarkRead={() => handleMarkNotificationRead(notification.id)}
                  onDelete={() => handleDeleteNotification(notification.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-600">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
