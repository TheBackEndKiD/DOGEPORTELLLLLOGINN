import React, { useState } from 'react';

export default function Flutterwave() {
  const [formData, setFormData] = useState({
    gatewayCurrency: '',
    flutterApiKey: 'FLWPUBK_TEST-SANDBOXDEMOKEY-X',
    flutterReferenceKey: 'titanic-48981487343MDiONxMAJd',
    conversionRate: '1.0000',
    allowPayment: 'No'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateFlutterwave = () => {
    alert('Flutterwave information updated successfully!');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Flutterwave</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Flutterwave Logo */}
          <div className="flex items-center justify-center">
            <div className="bg-slate-800 text-white p-8 rounded-lg text-center">
              <div className="text-2xl font-bold mb-2">flutterwave</div>
              <div className="text-sm opacity-75">®</div>
            </div>
          </div>

          {/* Right Column - Configuration */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gateway currency
              </label>
              <input
                type="text"
                name="gatewayCurrency"
                value={formData.gatewayCurrency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter gateway currency"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flutter api key
              </label>
              <input
                type="text"
                name="flutterApiKey"
                value={formData.flutterApiKey}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flutter reference key
              </label>
              <input
                type="text"
                name="flutterReferenceKey"
                value={formData.flutterReferenceKey}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conversion rate
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">1$ =</span>
                <input
                  type="text"
                  name="conversionRate"
                  value={formData.conversionRate}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allow as payment method
              </label>
              <select
                name="allowPayment"
                value={formData.allowPayment}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Update Button */}
        <div className="mt-8">
          <button
            onClick={handleUpdateFlutterwave}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-md font-medium"
          >
            Update flutterwave information
          </button>
        </div>
      </div>
    </div>
  );
}