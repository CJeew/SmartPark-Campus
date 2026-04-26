import React from 'react';

const UserRoleBadge = ({ role, size = 'sm' }) => {
  const roleConfig = {
    USER: { bg: '#DBEAFE', text: '#1D4ED8', icon: '👤', label: 'User' },
    WARDEN: { bg: '#FEF3C7', text: '#B45309', icon: '🛡️', label: 'Warden' },
    ADMIN: { bg: '#FEE2E2', text: '#B91C1C', icon: '⚙️', label: 'Admin' },
  };

  const config = roleConfig[role] || { bg: '#F3F4F6', text: '#4B5563', icon: '•', label: role };
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

export default UserRoleBadge;
