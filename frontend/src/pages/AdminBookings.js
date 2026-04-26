import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/adminService';
import AdminSidebar from '../components/AdminSidebar';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import BookingCard from '../components/BookingCard';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Toast from '../components/Toast';

const RefreshIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const StatCard = ({ icon, label, count, bgColor, subtext }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
    <div className={`w-11 h-11 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold text-gray-800 leading-tight">{count}</p>
      {subtext && <p className="text-xs text-gray-400 mt-0.5">{subtext}</p>}
    </div>
  </div>
);

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const [modal, setModal] = useState({ open: false, action: null, booking: null });
  const [actionLoading, setActionLoading] = useState(false);

  const admin = adminService.getAdmin?.() ?? null;
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
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
      const bookingId = modal.booking?.id ?? modal.booking?.bookingId;
      if (!bookingId) throw new Error('Invalid booking id');
      await adminService.updateBookingStatus(bookingId, modal.action, reason);
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

  const pendingCount  = bookings.filter((b) => b.status === 'PENDING').length;
  const approvedCount = bookings.filter((b) => b.status === 'APPROVED').length;
  const rejectedCount = bookings.filter((b) => b.status === 'REJECTED').length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar pendingBookings={pendingCount} />

      <main className="flex-1 overflow-auto flex flex-col">
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        {/* ── Sticky top header ── */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Booking Requests</h2>
            <p className="text-xs text-gray-400 mt-0.5">{today}</p>
          </div>
          <div className="flex items-center gap-3">
            {!loading && pendingCount > 0 && (
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                {pendingCount} pending review
              </span>
            )}
            <button
              onClick={fetchBookings}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshIcon />
              Refresh
            </button>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {admin?.fullName?.charAt(0)?.toUpperCase() ?? 'A'}
            </div>
          </div>
        </header>

        <div className="flex-1 px-8 py-6 space-y-6">

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
                  <div className="animate-pulse bg-gray-200 rounded-lg w-11 h-11 flex-shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="animate-pulse bg-gray-200 rounded h-3 w-24" />
                    <div className="animate-pulse bg-gray-200 rounded h-7 w-10" />
                    <div className="animate-pulse bg-gray-200 rounded h-2.5 w-16" />
                  </div>
                </div>
              ))
            ) : (
              <>
                <StatCard
                  bgColor="bg-blue-50"
                  label="Total Bookings"
                  count={bookings.length}
                  subtext="All requests"
                  icon={
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  }
                />
                <StatCard
                  bgColor="bg-amber-50"
                  label="Pending Review"
                  count={pendingCount}
                  subtext="Awaiting action"
                  icon={
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
                <StatCard
                  bgColor="bg-emerald-50"
                  label="Approved"
                  count={approvedCount}
                  subtext="Confirmed bookings"
                  icon={
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
                <StatCard
                  bgColor="bg-red-50"
                  label="Rejected"
                  count={rejectedCount}
                  subtext="Declined requests"
                  icon={
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
              </>
            )}
          </div>

          {/* ── Search & filter panel ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-800">Filter &amp; Search</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {loading
                    ? 'Loading…'
                    : `${displayed.length} of ${bookings.length} booking${bookings.length !== 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 space-y-3">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search by name, email, slot number, or university ID…"
              />
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
          </div>

          {/* ── Booking list panel ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-800">Requests</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {loading ? 'Loading…' : `${displayed.length} result${displayed.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <div className="p-6">
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
                      key={booking.id ?? booking.bookingId}
                      booking={booking}
                      onApprove={openApprove}
                      onReject={openReject}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <ConfirmModal
        isOpen={modal.open}
        action={modal.action}
        bookingUser={modal.booking?.userFullName}
        loading={actionLoading}
        onConfirm={handleConfirm}
        onCancel={closeModal}
      />
    </div>
  );
};

export default AdminBookings;
