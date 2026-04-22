import React from 'react';

const TagBadge = ({ label, color = 'blue', size = 'sm' }) => {
  const colorConfig = {
    blue: { bg: '#DBEAFE', text: '#1D4ED8' },
    green: { bg: '#DCFCE7', text: '#15803D' },
    yellow: { bg: '#FEF3C7', text: '#B45309' },
    red: { bg: '#FEE2E2', text: '#B91C1C' },
    grey: { bg: '#F3F4F6', text: '#4B5563' },
  };

  const sizeClass = size === 'md' ? 'px-3 py-1.5 text-sm' : 'px-2 py-1 text-xs';
  const config = colorConfig[color];

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClass}`}
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {label}
    </span>
  );
};

export default TagBadge;
