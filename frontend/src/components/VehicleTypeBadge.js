import React from 'react';

const VehicleTypeBadge = ({ type, types, selectedType, onSelect, size = 'sm' }) => {
  // Color mapping for vehicle types
  const colorMap = {
    CAR: 'bg-blue-100 text-blue-800 border border-blue-300',
    BIKE: 'bg-green-100 text-green-800 border border-green-300',
    THREE_WHEELER: 'bg-yellow-100 text-yellow-800 border border-yellow-300'
  };

  const iconMap = {
    CAR: '🚗',
    BIKE: '🏍️',
    THREE_WHEELER: '🛺'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs font-medium',
    md: 'px-3 py-2 text-sm font-medium',
    lg: 'px-4 py-2 text-base font-medium'
  };

  // Display mode: single type badge (for showing vehicle type)
  if (type && !types) {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full ${colorMap[type] || colorMap.CAR} ${sizeClasses[size]}`}>
        <span>{iconMap[type] || iconMap.CAR}</span>
        <span>{type}</span>
      </span>
    );
  }

  // Selection mode: multiple buttons for selection
  if (types && onSelect) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vehicle Type <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3 flex-wrap">
          {types.map((vehicleType) => (
            <button
              key={vehicleType}
              type="button"
              onClick={() => onSelect(vehicleType)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedType === vehicleType
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {vehicleType}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Fallback: render nothing if props are invalid
  return null;
};

export default VehicleTypeBadge;
