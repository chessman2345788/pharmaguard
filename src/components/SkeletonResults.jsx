import React from 'react';

const SkeletonResults = () => {
  return (
    <div className="animate-pulse space-y-12">
      <div className="h-40 bg-gray-200 rounded-[2rem]" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-96 bg-gray-100 rounded-[2rem]" />
        <div className="lg:col-span-2 space-y-6">
          <div className="h-48 bg-gray-100 rounded-[2rem]" />
          <div className="h-48 bg-gray-100 rounded-[2rem]" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonResults;
