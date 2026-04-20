import React from 'react';

const SkeletonLine = ({ className = '' }) => (
  <div className={`h-3 animate-pulse rounded bg-gray-200 ${className}`} />
);

const LoadingSkeleton = ({ rows = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <SkeletonLine className="w-2/3" />
              <SkeletonLine className="mt-3 w-full" />
              <SkeletonLine className="mt-2 w-5/6" />
            </div>
            <SkeletonLine className="w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;

