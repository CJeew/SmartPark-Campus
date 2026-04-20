import React from 'react';

const styles = {
  OPEN: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 ring-blue-200',
  RESOLVED: 'bg-green-50 text-green-700 ring-green-200',
  CLOSED: 'bg-gray-100 text-gray-700 ring-gray-200',
  REJECTED: 'bg-red-50 text-red-700 ring-red-200',
};

const StatusBadge = ({ status }) => {
  const cls = styles[status] || 'bg-gray-100 text-gray-700 ring-gray-200';
  const label = (status || 'UNKNOWN').replaceAll('_', ' ');
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ring-1 ring-inset ${cls}`}>
      {label}
    </span>
  );
};

export default StatusBadge;

