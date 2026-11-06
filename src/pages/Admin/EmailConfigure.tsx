import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function EmailConfigure() {
  const [formData, setFormData] = useState({
    phpMailFrom: 'noreply@coretrends.online',
    smtpEmailFrom: 'noreply@coretrends.online',
    smtpHost: 'ssl://coretrends.online',
    smtpUsername: 'noreply@coretrends.online',
    smtpPassword: '••••••••••••',
    smtpPort: '465',
    smtpEncryption: 'ssl'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateConfiguration = () => {
    alert('Email configuration updated successfully!');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Email Configuration</h1>
        <p className="text-gray-600">Configure email settings for your platform</p>
      </div>

      <div className="space-y-6">
        {/* PHP Mail Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Php Mail Settings</h2>
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email sent from
            </label>
            <input
              type="email"
              name="phpMailFrom"
              value={formData.phpMailFrom}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* SMTP Mail Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-gray-800">Smtp Mail Settings</h2>
              <XCircleIcon className="h-5 w-5 text-red-500" />
            </div>
            
            <button
              onClick={handleUpdateConfiguration}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium"
            >
              Update email configuration
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email sent from
              </label>
              <input
                type="email"
                name="smtpEmailFrom"
                value={formData.smtpEmailFrom}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Smtp host
              </label>
              <input
                type="text"
                name="smtpHost"
                value={formData.smtpHost}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Smtp username
              </label>
              <input
                type="email"
                name="smtpUsername"
                value={formData.smtpUsername}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Smtp password
              </label>
              <input
                type="password"
                name="smtpPassword"
                value={formData.smtpPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Smtp port
              </label>
              <input
                type="text"
                name="smtpPort"
                value={formData.smtpPort}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Smtp encryption
              </label>
              <input
                type="text"
                name="smtpEncryption"
                value={formData.smtpEncryption}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}