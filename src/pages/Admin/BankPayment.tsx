import React, { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface UserRequirement {
  id: string;
  fieldName: string;
  fieldType: string;
  validation: string;
}

export default function BankPayment() {
  const [bankImage, setBankImage] = useState<File | null>(null);
  const [requirements, setRequirements] = useState<UserRequirement[]>([
    { id: '1', fieldName: 'Upload Payment Screenshot*', fieldType: 'File upload', validation: 'Required' }
  ]);
  
  const [formData, setFormData] = useState({
    bankName: 'Request from company',
    accountNumber: 'Ask from company',
    routingNumber: 'Request from company',
    branchName: 'Request from company',
    gatewayCurrency: 'Request from company',
    conversionRate: '1.0000',
    charge: '0.0000',
    allowPayment: 'No'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRequirement = () => {
    alert('Add payment requirement functionality');
  };

  const handleRemoveRequirement = (id: string) => {
    setRequirements(prev => prev.filter(req => req.id !== id));
  };

  const handleUpdateBank = () => {
    alert('Bank information updated successfully!');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBankImage(file);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bank Payment</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Bank Image */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Bank Image</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="text-4xl">🏦</div>
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="bank-image"
                accept="image/*"
              />
              <label
                htmlFor="bank-image"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md cursor-pointer inline-block font-medium"
              >
                CHOOSE FILE
              </label>
              {bankImage && (
                <p className="mt-2 text-sm text-gray-600">{bankImage.name}</p>
              )}
            </div>
          </div>

          {/* Right Column - Bank Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank name
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank account number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank routing number
                </label>
                <input
                  type="text"
                  name="routingNumber"
                  value={formData.routingNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank branch name
                </label>
                <input
                  type="text"
                  name="branchName"
                  value={formData.branchName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

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
                  <span className="text-gray-500">Request from company</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Charge
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">$</span>
                  <input
                    type="text"
                    name="charge"
                    value={formData.charge}
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
        </div>

        {/* User Proof Requirements */}
        <div className="mt-8">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <h3 className="text-lg font-medium">User Proof Requirements</h3>
            <button
              onClick={handleAddRequirement}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add payment requirements</span>
            </button>
          </div>

          <div className="bg-white border border-t-0 rounded-b-lg">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Field name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Field type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Field validation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requirements.map((req) => (
                  <tr key={req.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{req.fieldName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{req.fieldType}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{req.validation}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleRemoveRequirement(req.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Update Button */}
        <div className="mt-6">
          <button
            onClick={handleUpdateBank}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md font-medium"
          >
            Update bank information
          </button>
        </div>
      </div>
    </div>
  );
}