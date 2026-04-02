import React from 'react';

const VehicleTypeBadge = ({ types, selectedType, onSelect }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Vehicle Type <span className="text-red-500">*</span>
      </label>
      <div className="flex gap-3 flex-wrap">
        {types.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VehicleTypeBadge;
