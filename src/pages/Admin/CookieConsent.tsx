import React, { useState } from 'react';

export default function CookieConsent() {
  const [cookieEnabled, setCookieEnabled] = useState(true);
  const [cookieMessage, setCookieMessage] = useState('This website uses cookies to ensure you get the best experience on our website.');
  const [cookieButtonText, setCookieButtonText] = useState('Got it!');
  const [cookiePosition, setCookiePosition] = useState('bottom');

  const handleSave = () => {
    alert('Cookie consent settings saved successfully!');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cookie Consent</h1>
        <p className="text-gray-600">Configure cookie consent banner settings</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enable Cookie Consent
              </label>
              <p className="text-sm text-gray-500">Show cookie consent banner to users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={cookieEnabled}
                onChange={(e) => setCookieEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cookie Message
            </label>
            <textarea
              value={cookieMessage}
              onChange={(e) => setCookieMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter cookie consent message"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={cookieButtonText}
                onChange={(e) => setCookieButtonText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Button text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Position
              </label>
              <select
                value={cookiePosition}
                onChange={(e) => setCookiePosition(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bottom">Bottom</option>
                <option value="top">Top</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium"
            >
              Save Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}