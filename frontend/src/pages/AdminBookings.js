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
      if (!bookingId) {
        throw new Error('Invalid booking id');
      }

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

  const pendingCount = bookings.filter((b) => b.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar pendingBookings={pendingCount} />

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
                key={booking.id ?? booking.bookingId}
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
        loading={actionLoading}
        onConfirm={handleConfirm}
        onCancel={closeModal}
      />
    </div>
  );
};

export default AdminBookings;
