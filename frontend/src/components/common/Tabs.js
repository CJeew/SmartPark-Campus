import React from 'react';

const Tabs = ({ tabs, activeKey, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        const classes = isActive
          ? 'bg-gray-900 text-white'
          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50';
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${classes}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;

