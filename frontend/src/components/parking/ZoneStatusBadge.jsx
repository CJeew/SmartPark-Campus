import React from 'react';
import { ZONE_STATUS_LABELS } from '../../constants/parkingConstants';

const styles = {
  ACTIVE:         'bg-green-100 text-green-700',
  OUT_OF_SERVICE: 'bg-red-100 text-red-700',
  MAINTENANCE:    'bg-amber-100 text-amber-700',
};

const dots = {
  ACTIVE:         'bg-green-500',
  OUT_OF_SERVICE: 'bg-red-500',
  MAINTENANCE:    'bg-amber-500',
};

const ZoneStatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] ?? 'bg-gray-100 text-gray-600'}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${dots[status] ?? 'bg-gray-400'}`} />
    {ZONE_STATUS_LABELS[status] ?? status}
  </span>
);

export default ZoneStatusBadge;
