import React from 'react';
import Button from './Button';

const NotificationItem = ({
  notificationId,
  message,
  type,
  isRead,
  createdAt,
  onMarkRead,
  onDelete,
  onClick,
}) => {
  const typeConfig = {
    BOOKING_APPROVED: { icon: '✅', color: 'green', label: 'Booking Approved' },
    BOOKING_REJECTED: { icon: '❌', color: 'red', label: 'Booking Rejected' },
    BOOKING_CANCELLED: { icon: '⛔', color: 'grey', label: 'Booking Cancelled' },
    TICKET_UPDATED: { icon: '📝', color: 'blue', label: 'Ticket Updated' },
    TICKET_ASSIGNED: { icon: '👤', color: 'blue', label: 'Ticket Assigned' },
    COMMENT_ADDED: { icon: '💬', color: 'blue', label: 'Comment Added' },
  };

  const config = typeConfig[type] || { icon: '🔔', color: 'grey', label: 'Notification' };

  return (
    <div
      className={`p-4 rounded-lg border mb-3 cursor-pointer transition ${
        isRead ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{config.icon}</div>
        <div className="flex-1">
          <p className={`text-sm ${isRead ? 'text-gray-600' : 'font-semibold text-gray-900'}`}>
            {message}
          </p>
          <p className="text-xs text-gray-400 mt-1">{createdAt}</p>
        </div>
        <div className="flex items-center gap-2">
          {onMarkRead && !isRead && (
            <Button
              label="Read"
              onClick={(e) => {
                e.stopPropagation();
                onMarkRead();
              }}
              variant="ghost"
              size="sm"
            />
          )}
          {onDelete && (
            <Button
              label="×"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              variant="ghost"
              size="sm"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
