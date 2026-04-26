import React from 'react';
import { DAY_OPTIONS } from '../../constants/parkingConstants';

const empty = () => ({ day: 'DAILY', openTime: '07:00', closeTime: '22:00' });

const AvailabilityEditor = ({ value = [], onChange }) => {
  const add = () => onChange([...value, empty()]);

  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));

  const update = (i, field, val) => {
    const next = value.map((w, idx) => idx === i ? { ...w, [field]: val } : w);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {value.map((w, i) => (
        <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
          <select
            value={w.day}
            onChange={(e) => update(i, 'day', e.target.value)}
            className="text-sm border border-gray-200 rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            {DAY_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <input
            type="time"
            value={w.openTime}
            onChange={(e) => update(i, 'openTime', e.target.value)}
            className="text-sm border border-gray-200 rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <span className="text-xs text-gray-400">to</span>
          <input
            type="time"
            value={w.closeTime}
            onChange={(e) => update(i, 'closeTime', e.target.value)}
            className="text-sm border border-gray-200 rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="ml-auto text-red-400 hover:text-red-600 text-lg leading-none"
            aria-label="Remove"
          >
            &times;
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
      >
        + Add window
      </button>
    </div>
  );
};

export default AvailabilityEditor;
