import React, { useState, useEffect } from 'react';
import AvailabilityEditor from './AvailabilityEditor';
import { ZONE_TYPES, ZONE_STATUSES, ZONE_TYPE_LABELS, ZONE_STATUS_LABELS } from '../../constants/parkingConstants';

const blank = {
  name: '', location: '', type: 'OPEN', totalCapacity: '',
  availableSlots: '', status: 'ACTIVE', description: '', availabilityWindows: [],
};

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
  </div>
);

const input = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400';

const ZoneFormModal = ({ zone, onSave, onClose, saving, serverError }) => {
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(zone
      ? { ...zone, totalCapacity: zone.totalCapacity ?? '', availableSlots: zone.availableSlots ?? '', availabilityWindows: zone.availabilityWindows ?? [] }
      : blank
    );
    setErrors({});
  }, [zone]);

  const set = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.type) e.type = 'Type is required';
    if (!form.totalCapacity || Number(form.totalCapacity) < 1) e.totalCapacity = 'Capacity must be ≥ 1';
    if (form.availableSlots !== '' && Number(form.availableSlots) > Number(form.totalCapacity)) {
      e.availableSlots = 'Cannot exceed total capacity';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...form,
      totalCapacity: Number(form.totalCapacity),
      availableSlots: form.availableSlots !== '' ? Number(form.availableSlots) : Number(form.totalCapacity),
    });
  };

  const isEdit = !!zone?.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-800">
            {isEdit ? 'Edit Parking Zone' : 'Add Parking Zone'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        {/* Body */}
        <form id="zone-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Zone Name *" error={errors.name || serverError}>
              <input className={input} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Zone A - Main Gate" />
            </Field>
            <Field label="Type *" error={errors.type}>
              <select className={input} value={form.type} onChange={(e) => set('type', e.target.value)}>
                {ZONE_TYPES.map((t) => <option key={t} value={t}>{ZONE_TYPE_LABELS[t]}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Location *" error={errors.location}>
            <input className={input} value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. Near Main Entrance, Block 1" />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Total Capacity *" error={errors.totalCapacity}>
              <input type="number" min="1" className={input} value={form.totalCapacity} onChange={(e) => set('totalCapacity', e.target.value)} placeholder="120" />
            </Field>
            <Field label="Available Slots" error={errors.availableSlots}>
              <input type="number" min="0" className={input} value={form.availableSlots} onChange={(e) => set('availableSlots', e.target.value)} placeholder="Auto" />
            </Field>
            <Field label="Status">
              <select className={input} value={form.status} onChange={(e) => set('status', e.target.value)}>
                {ZONE_STATUSES.map((s) => <option key={s} value={s}>{ZONE_STATUS_LABELS[s]}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Description">
            <textarea className={input} rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Optional description…" />
          </Field>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Availability Windows</label>
            <AvailabilityEditor value={form.availabilityWindows} onChange={(v) => set('availabilityWindows', v)} />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            form="zone-form"
            disabled={saving}
            className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : isEdit ? 'Update Zone' : 'Create Zone'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZoneFormModal;
