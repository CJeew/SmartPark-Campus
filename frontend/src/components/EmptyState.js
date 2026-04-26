import React from 'react';
import Button from './Button';

const EmptyState = ({ icon, title, description, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="text-5xl mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-4 max-w-sm">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button label={actionLabel} onClick={onAction} variant="primary" size="sm" />
      )}
    </div>
  );
};

export default EmptyState;
