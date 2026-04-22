import React from 'react';

const StatCard = ({ label, value, icon, color = 'blue', trend, trendValue }) => {
  const colorConfig = {
    blue: '#2563EB',
    green: '#16A34A',
    yellow: '#D97706',
    red: '#DC2626',
    grey: '#6B7280',
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          <h3 className="text-3xl font-bold mt-2" style={{ color: colorConfig[color] }}>
            {value}
          </h3>
          {trendValue && (
            <p className="text-xs text-gray-400 mt-2">{trendValue}</p>
          )}
        </div>
        {icon && (
          <div className="text-3xl">{icon}</div>
        )}
      </div>
      {trend && (
        <div className="flex items-center mt-3 text-xs">
          <span style={{ color: trend === 'up' ? '#16A34A' : '#DC2626' }}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
