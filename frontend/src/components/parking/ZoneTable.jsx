import React from 'react';
import ZoneStatusBadge from './ZoneStatusBadge';
import { ZONE_TYPE_LABELS } from '../../constants/parkingConstants';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const ZoneTable = ({ zones, loading, onEdit, onStatusChange, onDelete }) => {
  if (loading) {
    return (
      <div className="p-6 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48 flex-1" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (!zones.length) {
    return (
      <div className="py-16 text-center text-gray-400 text-sm">
        No parking zones found. Create one to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wider">
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Location</th>
            <th className="px-6 py-3">Type</th>
            <th className="px-6 py-3">Capacity</th>
            <th className="px-6 py-3">Occupancy</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {zones.map((zone) => {
            const occupied = (zone.totalCapacity ?? 0) - (zone.availableSlots ?? 0);
            return (
              <tr key={zone.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-6 py-3 font-medium text-gray-800">{zone.name}</td>
                <td className="px-6 py-3 text-gray-500 max-w-xs truncate">{zone.location}</td>
                <td className="px-6 py-3">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium">
                    {ZONE_TYPE_LABELS[zone.type] ?? zone.type}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-600">
                  {occupied}/{zone.totalCapacity}
                  <span className="text-gray-400 text-xs ml-1">({zone.availableSlots} free)</span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-20">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${Math.min(zone.occupancyRate ?? 0, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{zone.occupancyRate ?? 0}%</span>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <ZoneStatusBadge status={zone.status} />
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(zone)}
                      className="text-xs px-2.5 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors font-medium"
                    >
                      Edit
                    </button>
                    <select
                      value={zone.status}
                      onChange={(e) => onStatusChange(zone.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded px-1.5 py-1 text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    >
                      <option value="ACTIVE">Active</option>
                      
                      <option value="OUT_OF_SERVICE">Out of Service</option>
                    </select>
                    <button
                      onClick={() => onDelete(zone)}
                      className="text-xs px-2.5 py-1 text-red-500 hover:bg-red-50 rounded-md transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ZoneTable;
