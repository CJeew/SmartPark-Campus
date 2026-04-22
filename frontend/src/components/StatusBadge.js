import React from 'react';

const StatusBadge = ({ status, size = 'sm' }) => {
  const statusConfig = {
    PENDING: { bg: '#FEF3C7', text: '#B45309', label: 'Pending' },
    APPROVED: { bg: '#DCFCE7', text: '#15803D', label: 'Approved' },
    REJECTED: { bg: '#FEE2E2', text: '#B91C1C', label: 'Rejected' },
    CANCELLED: { bg: '#F3F4F6', text: '#4B5563', label: 'Cancelled' },
    OPEN: { bg: '#DBEAFE', text: '#1D4ED8', label: 'Open' },
    IN_PROGRESS: { bg: '#FEF3C7', text: '#B45309', label: 'In Progress' },
    RESOLVED: { bg: '#DCFCE7', text: '#15803D', label: 'Resolved' },
    CLOSED: { bg: '#F3F4F6', text: '#4B5563', label: 'Closed' },
    ACTIVE: { bg: '#DCFCE7', text: '#15803D', label: 'Active' },
    OUT_OF_SERVICE: { bg: '#F3F4F6', text: '#4B5563', label: 'Out of Service' },
    AVAILABLE: { bg: '#DCFCE7', text: '#15803D', label: 'Available' },
    BOOKED: { bg: '#FEE2E2', text: '#B91C1C', label: 'Booked' },
  };

  const config = statusConfig[status] || { bg: '#F3F4F6', text: '#4B5563', label: status };
  const sizeClass = size === 'md' ? 'px-3 py-2 text-sm' : 'px-2 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClass}`}
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
