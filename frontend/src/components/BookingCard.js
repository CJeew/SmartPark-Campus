import React from 'react';
import AvatarCircle from './AvatarCircle';
import StatusBadge from './StatusBadge';

const VEHICLE_BADGE = {
  CAR:           'bg-blue-50 text-blue-700',
  BIKE:          'bg-orange-50 text-orange-700',
  THREE_WHEELER: 'bg-purple-50 text-purple-700',
};

const VEHICLE_LABEL = {
  CAR: 'Car', BIKE: 'Bike', THREE_WHEELER: '3-Wheeler',
};

const fmt = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : '—';

const BookingCard = ({ booking, onApprove, onReject }) => {
  const isPending = booking.status === 'PENDING';

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4">
      {/* Avatar + User info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <AvatarCircle name={booking.userFullName} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{booking.userFullName}</p>
          <p className="text-xs text-gray-500 truncate">{booking.userEmail}</p>
          <p className="text-xs text-gray-400">{booking.userUniversityId}</p>
        </div>
      </div>

      {/* Slot info */}
      <div className="flex flex-col gap-1 w-40 flex-shrink-0">
        <p className="text-sm font-medium text-gray-700">
          Slot <span className="font-bold">{booking.slotNumber}</span>
        </p>
        <p className="text-xs text-gray-500">{booking.zoneName}</p>
        <span className={`inline-flex w-fit items-center px-2 py-0.5 rounded-full text-xs font-medium ${VEHICLE_BADGE[booking.vehicleType] ?? 'bg-gray-100 text-gray-600'}`}>
          {VEHICLE_LABEL[booking.vehicleType] ?? booking.vehicleType}
        </span>
      </div>

      {/* Date */}
      <div className="text-xs text-gray-400 w-24 flex-shrink-0">
        <p className="font-medium text-gray-500 mb-0.5">Requested</p>
        <p>{fmt(booking.createdAt)}</p>
        {booking.startTime && (
          <>
            <p className="font-medium text-gray-500 mt-1 mb-0.5">Duration</p>
            <p>{fmt(booking.startTime)}</p>
          </>
        )}
      </div>

      {/* Status + Actions */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <StatusBadge status={booking.status} />

        {booking.status === 'REJECTED' && booking.reason && (
          <p className="text-xs text-red-500 max-w-[140px] text-right italic">"{booking.reason}"</p>
        )}

        {isPending && (
          <div className="flex gap-2">
            <button
              onClick={() => onApprove(booking)}
              className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(booking)}
              className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
