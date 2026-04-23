import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import ZoneTable from '../../components/parking/ZoneTable';
import ZoneFormModal from '../../components/parking/ZoneFormModal';
import { useParkingZones } from '../../hooks/useParkingZones';
import { parkingZoneService } from '../../services/parkingZoneService';
import { ZONE_TYPES, ZONE_STATUSES, ZONE_TYPE_LABELS, ZONE_STATUS_LABELS } from '../../constants/parkingConstants';

const ZoneManagement = () => {
  const { zones, totalPages, totalElements, loading, error, filters, updateFilters, setPage, reload } = useParkingZones();
  const [modalZone, setModalZone] = useState(null);   // null = closed, {} = new, zone = edit
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openCreate = () => { setModalZone({}); setModalError(null); setModalOpen(true); };
  const openEdit   = (zone) => { setModalZone(zone); setModalError(null); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setModalZone(null); setModalError(null); };

  const handleSave = async (data) => {
    setSaving(true);
    setModalError(null);

    const normalizedName = (data.name || '').trim().toLowerCase();
    const duplicate = zones.find((z) => {
      const sameName = (z.name || '').trim().toLowerCase() === normalizedName;
      const sameRecord = modalZone?.id && z.id === modalZone.id;
      return sameName && !sameRecord;
    });

    if (duplicate) {
      setModalError('A zone with this name already exists');
      setSaving(false);
      return;
    }

    try {
      if (modalZone?.id) {
        await parkingZoneService.update(modalZone.id, data);
        showToast('Zone updated successfully');
      } else {
        await parkingZoneService.create(data);
        showToast('Zone created successfully');
      }
      closeModal();
      reload();
    } catch (err) {
      if (err.status === 409) {
        setModalError(err.message || 'A zone with this name already exists');
      } else {
        showToast(err.message || 'Failed to save zone', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await parkingZoneService.updateStatus(id, status);
      showToast('Status updated');
      reload();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await parkingZoneService.delete(deleteTarget.id);
      showToast('Zone deleted');
      setDeleteTarget(null);
      reload();
    } catch (err) {
      if (err.status === 409) {
        showToast(err.message || 'Cannot delete zone with booking history', 'error');
      } else {
        showToast(err.message || 'Failed to delete zone', 'error');
      }
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Parking Zones</h2>
            <p className="text-xs text-gray-400 mt-0.5">{totalElements} zone{totalElements !== 1 ? 's' : ''} total</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="text-lg leading-none">+</span>
            Add Zone
          </button>
        </header>

        <div className="px-8 py-6 space-y-4">
          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs text-gray-500 mb-1">Search</label>
              <input
                type="text"
                placeholder="Name or location…"
                value={filters.search ?? ''}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Type</label>
              <select
                value={filters.type ?? ''}
                onChange={(e) => updateFilters({ type: e.target.value || undefined })}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">All types</option>
                {ZONE_TYPES.map((t) => <option key={t} value={t}>{ZONE_TYPE_LABELS[t]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Status</label>
              <select
                value={filters.status ?? ''}
                onChange={(e) => updateFilters({ status: e.target.value || undefined })}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">All statuses</option>
                {ZONE_STATUSES.map((s) => <option key={s} value={s}>{ZONE_STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Min Capacity</label>
              <input
                type="number" min="0" placeholder="Any"
                value={filters.minCapacity ?? ''}
                onChange={(e) => updateFilters({ minCapacity: e.target.value || undefined })}
                className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <ZoneTable
              zones={zones}
              loading={loading}
              onEdit={openEdit}
              onStatusChange={handleStatusChange}
              onDelete={setDeleteTarget}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  Page {filters.page + 1} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={filters.page === 0}
                    onClick={() => setPage(filters.page - 1)}
                    className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    disabled={filters.page >= totalPages - 1}
                    onClick={() => setPage(filters.page + 1)}
                    className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Form Modal */}
      {modalOpen && (
        <ZoneFormModal
          zone={modalZone?.id ? modalZone : null}
          onSave={handleSave}
          onClose={closeModal}
          saving={saving}
          serverError={modalError}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-base font-semibold text-gray-800 mb-1">Delete Zone</h3>
            <p className="text-sm text-gray-500 mb-5">
              Are you sure you want to delete <span className="font-medium text-gray-700">{deleteTarget.name}</span>? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default ZoneManagement;
