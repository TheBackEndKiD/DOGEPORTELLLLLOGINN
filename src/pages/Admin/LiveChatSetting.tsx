import React, { useState } from 'react';

export default function LiveChatSetting() {
  const [chatEnabled, setChatEnabled] = useState(true);
  const [chatProvider, setChatProvider] = useState('tawk');
  const [chatCode, setChatCode] = useState('');

  const handleSave = () => {
    alert('Live chat settings saved successfully!');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Live Chat Setting</h1>
        <p className="text-gray-600">Configure live chat widget for customer support</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enable Live Chat
              </label>
              <p className="text-sm text-gray-500">Show live chat widget on your website</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={chatEnabled}
                onChange={(e) => setChatEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chat Provider
            </label>
            <select
              value={chatProvider}
              onChange={(e) => setChatProvider(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tawk">Tawk.to</option>
              <option value="intercom">Intercom</option>
              <option value="zendesk">Zendesk Chat</option>
              <option value="freshchat">Freshchat</option>
              <option value="custom">Custom Code</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chat Widget Code
            </label>
            <textarea
              value={chatCode}
              onChange={(e) => setChatCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              rows={6}
              placeholder="Paste your live chat widget code here..."
            />
            <p className="text-sm text-gray-500 mt-1">
              Paste the embed code provided by your chat service provider
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium"
            >
              Save Chat Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}