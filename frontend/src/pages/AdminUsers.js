import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/adminService';
import AdminSidebar from '../components/AdminSidebar';

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// ─── Confirm modal ────────────────────────────────────────────────────────────
const ConfirmModal = ({ user, onConfirm, onCancel, loading }) => {
  const deactivating = user?.isActive !== false;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
          deactivating ? 'bg-red-100' : 'bg-green-100'
        }`}>
          {deactivating ? (
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <h3 className="text-center text-base font-semibold text-gray-800 mb-1">
          {deactivating ? 'Deactivate User?' : 'Activate User?'}
        </h3>
        <p className="text-center text-sm text-gray-500 mb-6">
          {deactivating
            ? <>Are you sure you want to deactivate <strong>{user?.fullName}</strong>? They won't be able to log in.</>
            : <>Re-activate <strong>{user?.fullName}</strong>? They'll be able to log in again.</>}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 ${
              deactivating
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {loading ? 'Saving…' : deactivating ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Nav item (shared style) ──────────────────────────────────────────────────
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
  dashboard: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  users:     <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  zone:      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  bookings:  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  logout:    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  search:    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  refresh:   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
};

// ─── Main component ───────────────────────────────────────────────────────────
const AdminUsers = () => {
  const [users,         setUsers]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');
  const [search,        setSearch]        = useState('');
  const [typeFilter,    setTypeFilter]    = useState('all');
  const [statusFilter,  setStatusFilter]  = useState('all');
  const [confirmUser,   setConfirmUser]   = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast,         setToast]         = useState(null);
  const [stats,         setStats]         = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadUsers = useCallback(() => {
    setLoading(true);
    setError('');
    Promise.all([
      adminService.getAllUsers(),
      adminService.getStats(),
    ])
      .then(([usersData, statsData]) => {
        setUsers(usersData);
        setStats(statsData);
      })
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleToggle = async () => {
    if (!confirmUser) return;
    setActionLoading(true);
    try {
      const updated = await adminService.toggleUserStatus(confirmUser.id);
      setUsers((prev) => prev.map((u) => u.id === updated.id ? updated : u));
      showToast(
        updated.isActive
          ? `${updated.fullName} has been activated`
          : `${updated.fullName} has been deactivated`
      );
      setConfirmUser(null);
    } catch (e) {
      showToast(e.message || 'Failed to update user', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      u.fullName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.universityId?.toLowerCase().includes(q) ||
      u.faculty?.toLowerCase().includes(q) ||
      u.phoneNumber?.toLowerCase().includes(q);
    const matchType   = typeFilter   === 'all' || u.userType    === typeFilter;
    const matchStatus = statusFilter === 'all' ||
      (statusFilter === 'active'   &&  u.isActive) ||
      (statusFilter === 'inactive' && !u.isActive);
    return matchSearch && matchType && matchStatus;
  });

  const activeCount   = users.filter((u) =>  u.isActive).length;
  const inactiveCount = users.filter((u) => !u.isActive).length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar pendingBookings={stats?.pendingBookings ?? 0} />

      {/* ── Main ── */}
      <main className="flex-1 overflow-auto">

        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Users</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {loading ? 'Loading…' : `${users.length} registered · ${activeCount} active · ${inactiveCount} inactive`}
            </p>
          </div>
          <button
            onClick={loadUsers}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {Icons.refresh} Refresh
          </button>
        </header>

        <div className="px-8 py-6 space-y-5">

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          )}

          {/* Summary pills */}
          {!loading && (
            <div className="flex gap-3 flex-wrap">
              {[
                { label: 'Total',    value: users.length,  color: 'bg-gray-100 text-gray-700' },
                { label: 'Active',   value: activeCount,   color: 'bg-green-100 text-green-700' },
                { label: 'Inactive', value: inactiveCount, color: 'bg-red-100 text-red-700' },
                { label: 'Students', value: users.filter((u) => u.userType === 'STUDENT').length, color: 'bg-blue-100 text-blue-700' },
                { label: 'Staff',    value: users.filter((u) => u.userType === 'STAFF').length,   color: 'bg-indigo-100 text-indigo-700' },
              ].map((p) => (
                <span key={p.label} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${p.color}`}>
                  {p.label}: {p.value}
                </span>
              ))}
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">{Icons.search}</span>
              <input
                type="text"
                placeholder="Search by name, email, ID, faculty…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="all">All types</option>
                <option value="STUDENT">Student</option>
                <option value="STAFF">Staff</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              {(search || typeFilter !== 'all' || statusFilter !== 'all') && (
                <button
                  onClick={() => { setSearch(''); setTypeFilter('all'); setStatusFilter('all'); }}
                  className="text-sm text-blue-500 hover:text-blue-700 px-2"
                >
                  Clear
                </button>
              )}
            </div>

            <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">
              {filtered.length} of {users.length}
            </span>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-40" />
                      <Skeleton className="h-3 w-56" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-400 text-sm">No users match your filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                      <th className="px-6 py-3">User</th>
                      <th className="px-6 py-3">University ID</th>
                      <th className="px-6 py-3">Faculty</th>
                      <th className="px-6 py-3">Phone</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((user) => {
                      const active = user.isActive !== false;
                      return (
                        <tr key={user.id} className={`transition-colors ${active ? 'hover:bg-gray-50/70' : 'bg-red-50/30 hover:bg-red-50/50'}`}>
                          {/* User */}
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                                active
                                  ? 'bg-gradient-to-br from-indigo-400 to-purple-500'
                                  : 'bg-gray-300'
                              }`}>
                                {user.fullName?.charAt(0)?.toUpperCase() ?? '?'}
                              </div>
                              <div>
                                <p className={`font-medium ${active ? 'text-gray-800' : 'text-gray-400 line-through'}`}>
                                  {user.fullName}
                                </p>
                                <p className="text-xs text-gray-400">{user.email}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-3.5 font-mono text-xs text-gray-600">{user.universityId}</td>
                          <td className="px-6 py-3.5 text-gray-600">{user.faculty}</td>
                          <td className="px-6 py-3.5 text-gray-500 text-xs">{user.phoneNumber}</td>

                          {/* Type */}
                          <td className="px-6 py-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              user.userType === 'STAFF'
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}>
                              {user.userType}
                            </span>
                          </td>

                          {/* Role */}
                          <td className="px-6 py-3.5">
                            <div className="flex flex-wrap gap-1">
                              {user.roles?.map((role) => (
                                <span key={role} className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  role === 'ADMIN'   ? 'bg-red-50 text-red-700' :
                                  role === 'WARDEN'  ? 'bg-orange-50 text-orange-700' :
                                                       'bg-gray-100 text-gray-600'
                                }`}>
                                  {role}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              active
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-600'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-red-400'}`} />
                              {active ? 'Active' : 'Inactive'}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="px-6 py-3.5 text-right">
                            {user.roles?.includes('ADMIN') ? (
                              <span className="text-xs text-gray-300 italic">Protected</span>
                            ) : (
                              <button
                                onClick={() => setConfirmUser(user)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                  active
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
                                    : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-100'
                                }`}
                              >
                                {active ? 'Deactivate' : 'Activate'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* ── Confirm modal ── */}
      {confirmUser && (
        <ConfirmModal
          user={confirmUser}
          loading={actionLoading}
          onConfirm={handleToggle}
          onCancel={() => !actionLoading && setConfirmUser(null)}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'
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

export default AdminUsers;
