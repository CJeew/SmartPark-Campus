import React from 'react';

const EmptyState = ({ title, description, action }) => {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
      <div className="text-base font-semibold text-gray-900">{title}</div>
      {description ? <div className="mt-1 text-sm text-gray-600">{description}</div> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
};

export default EmptyState;

