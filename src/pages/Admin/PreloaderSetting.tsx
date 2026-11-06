import React, { useState } from 'react';

export default function PreloaderSetting() {
  const [preloaderEnabled, setPreloaderEnabled] = useState(true);
  const [preloaderColor, setPreloaderColor] = useState('#007bff');
  const [preloaderText, setPreloaderText] = useState('Loading...');

  const handleSave = () => {
    alert('Preloader settings saved successfully!');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Preloader Setting</h1>
        <p className="text-gray-600">Configure your site's loading screen</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enable Preloader
              </label>
              <p className="text-sm text-gray-500">Show loading screen when site is loading</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preloaderEnabled}
                onChange={(e) => setPreloaderEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preloader Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={preloaderColor}
                onChange={(e) => setPreloaderColor(e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={preloaderColor}
                onChange={(e) => setPreloaderColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preloader Text
            </label>
            <input
              type="text"
              value={preloaderText}
              onChange={(e) => setPreloaderText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter loading text"
            />
          </div>

          <div className="pt-4">
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium"
            >
              Save Preloader Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}