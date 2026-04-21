import React from 'react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import TagBadge from './TagBadge';
import Button from './Button';

const TicketCard = ({
  ticketId,
  title,
  category,
  priority,
  status,
  location,
  createdAt,
  assigneeName,
  reporterName,
  onView,
  onAssign,
  onUpdateStatus,
}) => {
  const categoryColorMap = {
    'Infrastructure': 'red',
    'Electrical': 'yellow',
    'Security': 'yellow',
    'Cleanliness': 'green',
    'Other': 'grey',
  };

  return (
    <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <TagBadge label={category} color={categoryColorMap[category] || 'blue'} size="sm" />
            <PriorityBadge priority={priority} size="sm" />
            <StatusBadge status={status} size="sm" />
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-3">
        <p>📍 {location}</p>
        <p>📅 {createdAt}</p>
      </div>

      {assigneeName && (
        <div className="bg-gray-50 rounded p-2 mb-3 flex items-center gap-2">
          <span className="text-xs text-gray-500">Assigned to:</span>
          <span className="text-sm font-medium">{assigneeName}</span>
        </div>
      )}

      <div className="flex gap-2">
        {onView && (
          <Button label="View Details" onClick={onView} variant="ghost" size="sm" />
        )}
        {onAssign && (
          <Button label="Assign" onClick={onAssign} variant="primary" size="sm" />
        )}
        {onUpdateStatus && (
          <Button label="Update Status" onClick={onUpdateStatus} variant="secondary" size="sm" />
        )}
      </div>
    </div>
  );
};

export default TicketCard;
