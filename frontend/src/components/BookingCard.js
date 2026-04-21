import React from 'react';
import StatusBadge from './StatusBadge';
import Button from './Button';
import AvatarCircle from './AvatarCircle';

const BookingCard = ({
  bookingId,
  slotNumber,
  zoneName,
  vehicleType,
  date,
  startTime,
  endTime,
  status,
  userName,
  userAvatar,
  rejectionReason,
  onApprove,
  onReject,
  onCancel,
  onViewDetails,
}) => {
  return (
    <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">
              Slot {slotNumber} • {zoneName}
            </h3>
            <StatusBadge status={status} size="sm" />
          </div>
          <p className="text-sm text-gray-500">
            {date} • {startTime} - {endTime}
          </p>
        </div>
        {userName && (
          <div className="flex items-center gap-2">
            <AvatarCircle src={userAvatar} name={userName} size="sm" />
            <span className="text-sm font-medium">{userName}</span>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded p-3 mb-4">
        <p className="text-xs text-gray-500 mb-1">Vehicle & Details</p>
        <p className="text-sm font-medium text-gray-900">
          {vehicleType === 'THREE_WHEELER' ? '3-Wheeler' : vehicleType}
        </p>
      </div>

      {rejectionReason && (
        <div className="bg-red-50 rounded p-3 mb-4">
          <p className="text-xs text-red-600 font-medium">Rejection Reason</p>
          <p className="text-sm text-red-600">{rejectionReason}</p>
        </div>
      )}

      <div className="flex gap-2">
        {onViewDetails && (
          <Button label="View Details" onClick={onViewDetails} variant="ghost" size="sm" />
        )}
        {onApprove && (
          <Button label="Approve" onClick={onApprove} variant="success" size="sm" />
        )}
        {onReject && (
          <Button label="Reject" onClick={onReject} variant="danger" size="sm" />
        )}
        {onCancel && (
          <Button label="Cancel" onClick={onCancel} variant="danger" size="sm" />
        )}
      </div>
    </div>
  );
};

export default BookingCard;
