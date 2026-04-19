import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import BookingCard from '../components/BookingCard';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Toast from '../components/Toast';

const AdminBookings = () => {
  const navigate = useNavigate();
  const admin = adminService.getAdmin();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const [modal, setModal] = useState({ open: false, action: null, booking: null });
  const [actionLoading, setActionLoading] = useState(false);

  const availableZones = [...new Set(bookings.map((b) => b.zoneName))].sort();

  const fetchBookings = useCallback(() => {
    setLoading(true);
    adminService
      .getBookings(statusFilter, zoneFilter, dateFilter)
      .then(setBookings)
      .catch(() => setToast({ message: 'Failed to load bookings', type: 'error' }))
      .finally(() => setLoading(false));
  }, [statusFilter, zoneFilter, dateFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const displayed = bookings.filter((b) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      b.userFullName?.toLowerCase().includes(q) ||
      b.userEmail?.toLowerCase().includes(q) ||
      b.slotNumber?.toLowerCase().includes(q) ||
      b.userUniversityId?.toLowerCase().includes(q)
    );
  });

  const openApprove = (booking) => setModal({ open: true, action: 'APPROVED', booking });
  const openReject  = (booking) => setModal({ open: true, action: 'REJECTED', booking });
  const closeModal  = () => setModal({ open: false, action: null, booking: null });

  const handleConfirm = async (reason) => {
    setActionLoading(true);
    try {
      await adminService.updateBookingStatus(modal.booking.id, modal.action, reason);
      setToast({
        message: modal.action === 'APPROVED' ? 'Booking approved successfully' : 'Booking rejected',
        type: modal.action === 'APPROVED' ? 'success' : 'error',
      });
      closeModal();
      fetchBookings();
    } catch {
      setToast({ message: 'Action failed. Please try again.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    adminService.logout();
    navigate('/admin/login');
  };

  const pendingCount = bookings.filter((b) => b.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold">SmartPark</h1>
          <p className="text-gray-400 text-xs mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <div
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded-md text-sm cursor-pointer transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </div>

          <div
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded-md text-sm cursor-pointer transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Users
          </div>

          <div
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded-md text-sm cursor-pointer transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Parking Zones
          </div>

          <div className="flex items-center gap-3 px-3 py-2 bg-gray-700 rounded-md text-sm font-medium cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Bookings
            {pendingCount > 0 && (
              <span className="ml-auto bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">
              {admin?.fullName?.charAt(0) ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{admin?.fullName ?? 'Admin'}</p>
              <p className="text-xs text-gray-400 truncate">{admin?.email ?? ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-sm text-gray-400 hover:text-white flex items-center gap-2 px-3 py-2 hover:bg-gray-700 rounded-md transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Booking Requests</h2>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? 'Loading...' : `${displayed.length} booking${displayed.length !== 1 ? 's' : ''} shown`}
            {pendingCount > 0 && !loading && (
              <span className="ml-2 text-yellow-600 font-medium">· {pendingCount} pending review</span>
            )}
          </p>
        </div>

        {/* Search */}
        <div className="mb-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name, email, slot number, or university ID..."
          />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <FilterBar
            status={statusFilter}
            onStatusChange={(v) => setStatusFilter(v)}
            zone={zoneFilter}
            onZoneChange={(v) => setZoneFilter(v)}
            dateRange={dateFilter}
            onDateRangeChange={(v) => setDateFilter(v)}
            zones={availableZones}
          />
        </div>

        {/* Booking list */}
        {loading ? (
          <LoadingSkeleton rows={5} />
        ) : displayed.length === 0 ? (
          <EmptyState
            title="No booking requests found"
            message="Try adjusting your filters or search query."
          />
        ) : (
          <div className="space-y-3">
            {displayed.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onApprove={openApprove}
                onReject={openReject}
              />
            ))}
          </div>
        )}
      </main>

      {/* Confirm modal */}
      <ConfirmModal
        isOpen={modal.open}
        action={modal.action}
        bookingUser={modal.booking?.userFullName}
        onConfirm={handleConfirm}
        onCancel={closeModal}
      />
    </div>
  );
};

export default AdminBookings;
