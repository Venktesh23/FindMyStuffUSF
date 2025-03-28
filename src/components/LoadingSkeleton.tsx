import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
  type?: 'card' | 'list';
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 3, type = 'card' }) => {
  return (
    <div className={`grid gap-6 ${type === 'card' ? 'md:grid-cols-2 lg:grid-cols-3' : ''}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 animate-pulse"
        >
          <div className="h-48 bg-gray-200 rounded-md mb-4" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;