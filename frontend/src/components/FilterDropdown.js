import React, { useState } from 'react';

const FilterDropdown = ({ label, options, value, onChange, error, required = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to get label from option (handle both string and object formats)
  const getOptionLabel = (option) => {
    return typeof option === 'object' ? option.label : option;
  };

  // Helper to get value from option (handle both string and object formats)
  const getOptionValue = (option) => {
    return typeof option === 'object' ? option.value : option;
  };

  // Get the current label to display
  const displayLabel = options.find(opt => getOptionValue(opt) === value)?.label || value || 'Select an option';

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-2 text-left border rounded-lg focus:outline-none focus:ring-2 transition flex justify-between items-center ${
            error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
          }`}
        >
          <span>{displayLabel}</span>
          <svg
            className={`w-4 h-4 transition ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            {options.map((option) => (
              <button
                key={getOptionValue(option)}
                type="button"
                onClick={() => {
                  onChange(getOptionValue(option));
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-blue-50 transition"
              >
                {getOptionLabel(option)}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FilterDropdown;
