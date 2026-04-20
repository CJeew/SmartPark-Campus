import React from 'react';

const styles = {
  LOW: 'bg-gray-100 text-gray-700 ring-gray-200',
  MEDIUM: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  HIGH: 'bg-orange-50 text-orange-700 ring-orange-200',
  CRITICAL: 'bg-red-50 text-red-700 ring-red-200',
};

const PriorityBadge = ({ priority }) => {
  const cls = styles[priority] || 'bg-gray-100 text-gray-700 ring-gray-200';
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ring-1 ring-inset ${cls}`}>
      {priority || 'UNKNOWN'}
    </span>
  );
};

export default PriorityBadge;

