import React from 'react';

const PriorityBadge = ({ priority, size = 'sm' }) => {
  const priorityConfig = {
    LOW: { bg: '#F3F4F6', text: '#4B5563', icon: '↓', label: 'Low' },
    MEDIUM: { bg: '#DBEAFE', text: '#1D4ED8', icon: '→', label: 'Medium' },
    HIGH: { bg: '#FEF3C7', text: '#B45309', icon: '↑', label: 'High' },
    CRITICAL: { bg: '#FEE2E2', text: '#B91C1C', icon: '⚠️', label: 'Critical' },
  };

  const config = priorityConfig[priority] || { bg: '#F3F4F6', text: '#4B5563', icon: '•', label: priority };
  const sizeClass = size === 'md' ? 'px-3 py-2 text-sm' : 'px-2 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClass}`}
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
};

export default PriorityBadge;
