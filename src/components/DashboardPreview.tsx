
import React from 'react';

const DashboardPreview = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-gray-200/50 dark:border-gray-800/50">
      <img 
        src="https://images.unsplash.com/photo-1509390222857-1ffefcb3f1e7" 
        alt="Mathematical Equations and Visualization" 
        className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
      />
    </div>
  );
};

export default DashboardPreview;
