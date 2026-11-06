import React, { useState } from 'react';

export default function Paystack() {
  const [formData, setFormData] = useState({
    gatewayCurrency: '',
    paystackPublicKey: '',
    paystackSecretKey: '',
    conversionRate: '1.0000',
    allowPayment: 'No'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdatePaystack = () => {
    alert('Paystack information updated successfully!');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Paystack</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Paystack Logo */}
          <div className="flex items-center justify-center">
            <div className="bg-blue-600 text-white p-8 rounded-lg text-center">
              <div className="text-3xl font-bold">Paystack</div>
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
                Paystack public key
              </label>
              <input
                type="text"
                name="paystackPublicKey"
                value={formData.paystackPublicKey}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Paystack public key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paystack secret key
              </label>
              <input
                type="password"
                name="paystackSecretKey"
                value={formData.paystackSecretKey}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Paystack secret key"
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
            onClick={handleUpdatePaystack}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-md font-medium"
          >
            Update Paystack information
          </button>
        </div>
      </div>
    </div>
  );
}