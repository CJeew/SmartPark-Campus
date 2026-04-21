import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';

// ─── Skeleton loader ──────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon, bgColor, textColor, loading, onClick, subtitle }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4 transition-all duration-150 ${
      onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
    }`}
  >
    <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${bgColor}`}>
      <span className={textColor}>{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{title}</p>
      {loading ? (
        <Skeleton className="h-8 w-16 mt-1" />
      ) : (
        <p className="text-3xl font-bold text-gray-800 leading-tight">{value ?? '—'}</p>
      )}
      {subtitle && !loading && (
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      )}
    </div>
  </div>
);

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    PENDING:   'bg-yellow-100 text-yellow-700',
    APPROVED:  'bg-green-100 text-green-700',
    REJECTED:  'bg-red-100 text-red-700',
    CANCELLED: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};

// ─── Nav item ─────────────────────────────────────────────────────────────────
const NavItem = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active
        ? 'bg-blue-600 text-white shadow-sm'
        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
    }`}
  >
    <span className="w-5 h-5 flex-shrink-0">{icon}</span>
    <span className="flex-1 text-left">{label}</span>
    {badge != null && badge > 0 && (
      <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
        {badge}
      </span>
    )}
  </button>
);

// ─── SVG icons ────────────────────────────────────────────────────────────────
const Icons = {
  dashboard: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  users: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  zone: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  bookings: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  logout: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  search: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  refresh: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
};

// ─── Main component ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const admin = adminService.getAdmin();

  const [stats, setStats]               = useState(null);
  const [users, setUsers]               = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [error, setError]               = useState('');
  const [userSearch, setUserSearch]     = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast]               = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = useCallback(() => {
    setLoadingStats(true);
    setLoadingUsers(true);
    setLoadingBookings(true);
    setError('');

    adminService.getStats()
      .then(setStats)
      .catch(() => setError('Failed to load statistics'))
      .finally(() => setLoadingStats(false));

    adminService.getAllUsers()
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoadingUsers(false));

    adminService.getBookings(null, null, null)
      .then((data) => setRecentBookings(Array.isArray(data) ? data.slice(0, 8) : []))
      .catch(() => {})
      .finally(() => setLoadingBookings(false));
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleQuickAction = async (bookingId, action) => {
    setActionLoading(bookingId + action);
    try {
      await adminService.updateBookingStatus(bookingId, action, null);
      showToast(`Booking ${action.toLowerCase()} successfully`);
      const updated = recentBookings.map((b) =>
        b.id === bookingId ? { ...b, status: action } : b
      );
      setRecentBookings(updated);
      setStats((prev) => prev ? {
        ...prev,
        pendingBookings: Math.max(0, (prev.pendingBookings || 0) - 1),
      } : prev);
    } catch {
      showToast('Failed to update booking', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    adminService.logout();
    navigate('/admin/login');
  };

  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    const matchSearch =
      !q ||
      u.fullName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.universityId?.toLowerCase().includes(q) ||
      u.faculty?.toLowerCase().includes(q);
    const matchType =
      userTypeFilter === 'all' || u.userType === userTypeFilter;
    return matchSearch && matchType;
  });

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const approvedCount = Array.isArray(recentBookings)
    ? recentBookings.filter((b) => b.status === 'APPROVED').length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar ── */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-700/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-sm font-bold">S</div>
            <div>
              <h1 className="text-base font-bold leading-tight">SmartPark</h1>
              <p className="text-gray-400 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <NavItem icon={Icons.dashboard} label="Dashboard" active />
          <NavItem icon={Icons.users}     label="Users"         onClick={() => navigate('/admin/users')} />
          <NavItem icon={Icons.zone}      label="Parking Zones" onClick={() => {}} />
          <NavItem
            icon={Icons.bookings}
            label="Bookings"
            onClick={() => navigate('/admin/bookings')}
            badge={loadingStats ? null : stats?.pendingBookings}
          />
        </nav>

        {/* Admin profile */}
        <div className="px-3 py-4 border-t border-gray-700/60">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
              {admin?.fullName?.charAt(0)?.toUpperCase() ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{admin?.fullName ?? 'Admin'}</p>
              <p className="text-xs text-gray-400 truncate">{admin?.email ?? ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
          >
            {Icons.logout}
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-auto">

        {/* Top header bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-xs text-gray-400 mt-0.5">{today}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {Icons.refresh}
              Refresh
            </button>
            <button
              onClick={() => navigate('/admin/bookings')}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Manage Bookings
            </button>
          </div>
        </header>

        <div className="px-8 py-6 space-y-6">

          {/* Error banner */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard
              title="Total Users"
              value={stats?.totalUsers}
              loading={loadingStats}
              bgColor="bg-blue-50"
              textColor="text-blue-600"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
            <StatCard
              title="Active Users"
              value={stats?.activeUsers}
              loading={loadingStats}
              bgColor="bg-emerald-50"
              textColor="text-emerald-600"
              subtitle={stats ? `${Math.round((stats.activeUsers / stats.totalUsers) * 100) || 0}% of total` : null}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              title="Vehicles"
              value={stats?.totalVehicles}
              loading={loadingStats}
              bgColor="bg-purple-50"
              textColor="text-purple-600"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              }
            />
            <StatCard
              title="Total Bookings"
              value={stats?.totalBookings}
              loading={loadingStats}
              bgColor="bg-sky-50"
              textColor="text-sky-600"
              onClick={() => navigate('/admin/bookings')}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
            />
            <StatCard
              title="Pending"
              value={stats?.pendingBookings}
              loading={loadingStats}
              bgColor="bg-amber-50"
              textColor="text-amber-600"
              subtitle="Awaiting review"
              onClick={() => navigate('/admin/bookings')}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              title="Approved"
              value={loadingBookings ? null : approvedCount}
              loading={loadingBookings}
              bgColor="bg-green-50"
              textColor="text-green-600"
              subtitle="In recent list"
              onClick={() => navigate('/admin/bookings')}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M5 13l4 4L19 7" />
                </svg>
              }
            />
          </div>

          {/* ── Quick actions ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: 'Review Pending Bookings',
                desc: stats?.pendingBookings
                  ? `${stats.pendingBookings} booking${stats.pendingBookings > 1 ? 's' : ''} need attention`
                  : 'No pending bookings',
                color: 'border-amber-200 bg-amber-50 hover:bg-amber-100',
                textColor: 'text-amber-700',
                btnColor: 'bg-amber-500 hover:bg-amber-600',
                action: () => navigate('/admin/bookings'),
              },
              {
                label: 'User Directory',
                desc: `${users.length} registered users`,
                color: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
                textColor: 'text-blue-700',
                btnColor: 'bg-blue-500 hover:bg-blue-600',
                action: () => document.getElementById('users-section')?.scrollIntoView({ behavior: 'smooth' }),
              },
              {
                label: 'All Bookings',
                desc: 'View and filter all booking records',
                color: 'border-purple-200 bg-purple-50 hover:bg-purple-100',
                textColor: 'text-purple-700',
                btnColor: 'bg-purple-500 hover:bg-purple-600',
                action: () => navigate('/admin/bookings'),
              },
            ].map((item) => (
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

          {/* ── Recent bookings ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-800">Recent Bookings</h3>
                <p className="text-xs text-gray-400 mt-0.5">Latest 8 booking requests</p>
              </div>
              <button
                onClick={() => navigate('/admin/bookings')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all →
              </button>
            </div>

            {loadingBookings ? (
              <div className="p-6 space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-40" />
                      <Skeleton className="h-3 w-56" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                ))}
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="p-10 text-center text-gray-400 text-sm">No bookings found.</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="px-6 py-3 flex items-center gap-4 hover:bg-gray-50/60 transition-colors">
                    {/* Avatar */}
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {booking.userFullName?.charAt(0)?.toUpperCase() ?? '?'}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {booking.userFullName}
                        <span className="text-gray-400 font-normal ml-2 text-xs">#{booking.userUniversityId}</span>
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        Slot <span className="font-medium text-gray-600">{booking.slotNumber}</span>
                        {' · '}{booking.zoneName}
                        {' · '}{booking.vehicleType}
                      </p>
                    </div>

                    {/* Status */}
                    <StatusBadge status={booking.status} />

                    {/* Quick actions for PENDING */}
                    {booking.status === 'PENDING' && (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          disabled={!!actionLoading}
                          onClick={() => handleQuickAction(booking.id, 'APPROVED')}
                          className="px-2.5 py-1 text-xs font-medium bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors disabled:opacity-50"
                        >
                          {actionLoading === booking.id + 'APPROVED' ? '…' : 'Approve'}
                        </button>
                        <button
                          disabled={!!actionLoading}
                          onClick={() => handleQuickAction(booking.id, 'REJECTED')}
                          className="px-2.5 py-1 text-xs font-medium bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors disabled:opacity-50"
                        >
                          {actionLoading === booking.id + 'REJECTED' ? '…' : 'Reject'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Users table ── */}
          <div id="users-section" className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-800">Registered Users</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {loadingUsers ? 'Loading…' : `${filteredUsers.length} of ${users.length} users`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Type filter */}
                  <select
                    value={userTypeFilter}
                    onChange={(e) => setUserTypeFilter(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="all">All types</option>
                    <option value="STUDENT">Student</option>
                    <option value="STAFF">Staff</option>
                  </select>
                  {/* Search */}
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">{Icons.search}</span>
                    <input
                      type="text"
                      placeholder="Search users…"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 w-44"
                    />
                  </div>
                </div>
              </div>
            </div>

            {loadingUsers ? (
              <div className="p-6 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-36" />
                      <Skeleton className="h-3 w-52" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-gray-400 text-sm">No users match your search.</p>
                {userSearch && (
                  <button
                    onClick={() => { setUserSearch(''); setUserTypeFilter('all'); }}
                    className="mt-2 text-xs text-blue-500 hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-3">User</th>
                      <th className="px-6 py-3">University ID</th>
                      <th className="px-6 py-3">Faculty</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {user.fullName?.charAt(0)?.toUpperCase() ?? '?'}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{user.fullName}</p>
                              <p className="text-xs text-gray-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-gray-600 font-mono text-xs">{user.universityId}</td>
                        <td className="px-6 py-3 text-gray-600">{user.faculty}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.userType === 'STAFF'
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}>
                            {user.userType}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex flex-wrap gap-1">
                            {user.roles?.map((role) => (
                              <span
                                key={role}
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  role === 'ADMIN'
                                    ? 'bg-red-50 text-red-700'
                                    : role === 'WARDEN'
                                    ? 'bg-orange-50 text-orange-700'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.isActive !== false
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.isActive !== false ? 'bg-green-500' : 'bg-gray-400'}`} />
                            {user.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>{/* /px-8 py-6 */}
      </main>

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 transition-all ${
          toast.type === 'error'
            ? 'bg-red-600 text-white'
            : 'bg-gray-900 text-white'
        }`}>
          {toast.type === 'error' ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
