import React from 'react';

const TagBadge = ({ tag }) => {
  if (!tag) return null;
  return (
    <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200">
      {tag}
    </span>
  );
};

export default TagBadge;

