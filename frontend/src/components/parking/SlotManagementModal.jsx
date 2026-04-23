import React, { useCallback, useEffect, useState } from 'react';
import { parkingSlotService } from '../../services/parkingSlotService';

const VEHICLE_TYPES = ['CAR', 'BIKE', 'THREE_WHEELER'];

const normalizeSlotNumber = (value) => (value || '').trim().toUpperCase();

const suggestNextSlotNumber = (zoneId, slots) => {
  const existing = new Set((slots || []).map((s) => normalizeSlotNumber(s.slotNumber)));
  let seq = 1;
  while (seq <= 9999) {
    const candidate = `Z${zoneId}-${String(seq).padStart(3, '0')}`;
    if (!existing.has(candidate)) return candidate;
    seq += 1;
  }
  return `Z${zoneId}-${Date.now().toString().slice(-4)}`;
};

const SlotManagementModal = ({ zone, onClose, onChanged }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotNumber, setSlotNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('CAR');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadSlots = useCallback(async () => {
    setLoading(true);
    try {
      const data = await parkingSlotService.getSlots(zone.id);
      const loadedSlots = data || [];
      setSlots(loadedSlots);
      setSlotNumber((prev) => {
        if (normalizeSlotNumber(prev)) return prev;
        return suggestNextSlotNumber(zone.id, loadedSlots);
      });
    } catch {
      setError('Failed to load slots');
    } finally {
      setLoading(false);
    }
  }, [zone.id]);

  useEffect(() => { loadSlots(); }, [loadSlots]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const normalizedSlotNumber = normalizeSlotNumber(slotNumber);
    if (!normalizedSlotNumber) return;

    const localDuplicate = slots.some((s) => normalizeSlotNumber(s.slotNumber) === normalizedSlotNumber);
    if (localDuplicate) {
      setError(`Slot number '${normalizedSlotNumber}' already exists in this zone`);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await parkingSlotService.addSlot(zone.id, normalizedSlotNumber, vehicleType);
      setSlotNumber('');
      await loadSlots();
      onChanged();
    } catch (err) {
      setError(err.error || 'Failed to add slot');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slotId, slotNumber) => {
    setError(null);
    try {
      await parkingSlotService.deleteSlot(zone.id, slotId);
      await loadSlots();
      onChanged();
    } catch (err) {
      setError(err.error || `Cannot remove slot ${slotNumber}`);
    }
  };

  const vehicleIcon = (type) => {
    if (type === 'BIKE') return '🏍️';
    if (type === 'THREE_WHEELER') return '🛺';
    return '🚗';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-semibold text-gray-800">Manage Slots</h3>
            <p className="text-xs text-gray-400 mt-0.5">{zone.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        {/* Add slot form */}
        <div className="px-6 py-4 border-b border-gray-100">
          <form onSubmit={handleAdd} className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Slot Number</label>
              <input
                type="text"
                value={slotNumber}
                onChange={(e) => setSlotNumber(e.target.value.toUpperCase())}
                placeholder={`e.g. Z${zone.id}-001`}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Vehicle Type</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {VEHICLE_TYPES.map(t => (
                  <option key={t} value={t}>{vehicleIcon(t)} {t.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={saving || !slotNumber.trim()}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? '...' : 'Add'}
            </button>
          </form>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>

        {/* Slot list */}
        <div className="overflow-y-auto flex-1 px-6 py-3">
          {loading ? (
            <div className="py-8 text-center text-gray-400 text-sm">Loading slots...</div>
          ) : slots.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm">No slots yet. Add one above.</div>
          ) : (
            <div className="space-y-2">
              {slots.map(slot => (
                <div key={slot.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{vehicleIcon(slot.vehicleType)}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{slot.slotNumber}</p>
                      <p className="text-xs text-gray-400">{slot.vehicleType.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${slot.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {slot.isAvailable ? 'Available' : 'Occupied'}
                    </span>
                    <button
                      onClick={() => handleDelete(slot.id, slot.slotNumber)}
                      className="text-xs px-2 py-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs text-gray-400">{slots.length} slot{slots.length !== 1 ? 's' : ''}</span>
          <button onClick={onClose} className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotManagementModal;
