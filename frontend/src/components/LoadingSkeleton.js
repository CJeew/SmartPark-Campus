import React from 'react';

const SkeletonRow = () => (
  <div className="bg-white rounded-lg border border-gray-100 p-4 animate-pulse flex items-start gap-4">
    <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-1/3" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
    <div className="flex gap-2 items-center">
      <div className="h-6 w-16 bg-gray-200 rounded-full" />
      <div className="h-8 w-20 bg-gray-200 rounded" />
    </div>
  </div>
);

const LoadingSkeleton = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => <SkeletonRow key={i} />)}
  </div>
);

export default LoadingSkeleton;
