import React from 'react';

const FilterSelect = ({ label, value, onChange, options }) => (
  <div className="flex items-center gap-2">
    <span className="text-xs font-medium text-gray-500 whitespace-nowrap">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-700"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const FilterBar = ({ status, onStatusChange, zone, onZoneChange, dateRange, onDateRangeChange, zones = [] }) => {
  const statusOptions = [
    { value: 'all',       label: 'All Statuses' },
    { value: 'PENDING',   label: 'Pending' },
    { value: 'APPROVED',  label: 'Approved' },
    { value: 'REJECTED',  label: 'Rejected' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  const zoneOptions = [
    { value: 'all', label: 'All Zones' },
    ...zones.map((z) => ({ value: z, label: z })),
  ];

  const dateOptions = [
    { value: 'all',   label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week',  label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white border border-gray-200 rounded-lg px-4 py-3">
      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm3 4h10M7 12h6m-3 4h0" />
      </svg>
      <FilterSelect label="Status"     value={status}    onChange={onStatusChange}    options={statusOptions} />
      <FilterSelect label="Zone"       value={zone}      onChange={onZoneChange}      options={zoneOptions} />
      <FilterSelect label="Date Range" value={dateRange} onChange={onDateRangeChange} options={dateOptions} />
    </div>
  );
};

export default FilterBar;
