import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 3 }) => {
  const skeletonItem = (
    <div className="animate-pulse">
      {type === 'card' && (
        <div className="bg-gray-200 rounded-lg h-40 mb-4"></div>
      )}
      {type === 'list' && (
        <div className="bg-gray-200 rounded-lg h-16 mb-3"></div>
      )}
      {type === 'stat' && (
        <div className="bg-gray-200 rounded-lg h-24 mb-4"></div>
      )}
      {type === 'text' && (
        <>
          <div className="bg-gray-200 rounded h-4 mb-2 w-3/4"></div>
          <div className="bg-gray-200 rounded h-4 w-1/2"></div>
        </>
      )}
    </div>
  );

  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{skeletonItem}</div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
