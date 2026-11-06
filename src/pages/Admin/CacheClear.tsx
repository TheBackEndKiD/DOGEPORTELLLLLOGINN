import React, { useState } from 'react';
import { TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function CacheClear() {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCache = async (cacheType: string) => {
    setIsClearing(true);
    
    // Simulate cache clearing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert(`${cacheType} cache cleared successfully!`);
    setIsClearing(false);
  };

  const cacheTypes = [
    {
      name: 'Application Cache',
      description: 'Clear all application cache including views, routes, and config',
      icon: <TrashIcon className="h-8 w-8" />,
      color: 'bg-blue-500'
    },
    {
      name: 'View Cache',
      description: 'Clear compiled view templates and layouts',
      icon: <ArrowPathIcon className="h-8 w-8" />,
      color: 'bg-green-500'
    },
    {
      name: 'Route Cache',
      description: 'Clear cached routing information',
      icon: <TrashIcon className="h-8 w-8" />,
      color: 'bg-purple-500'
    },
    {
      name: 'Config Cache',
      description: 'Clear configuration cache files',
      icon: <ArrowPathIcon className="h-8 w-8" />,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cache Clear</h1>
        <p className="text-gray-600">Clear various types of cache to improve performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cacheTypes.map((cache, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className={`${cache.color} text-white p-4 rounded-lg mb-4 flex items-center justify-center`}>
              {cache.icon}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{cache.name}</h3>
            <p className="text-gray-600 mb-4">{cache.description}</p>
            
            <button
              onClick={() => handleClearCache(cache.name)}
              disabled={isClearing}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {isClearing ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  <span>Clearing...</span>
                </>
              ) : (
                <>
                  <TrashIcon className="h-4 w-4" />
                  <span>Clear Cache</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Clearing cache will temporarily slow down your website while cache rebuilds. This is normal and performance will improve after cache regeneration.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}