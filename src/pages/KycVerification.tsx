import React, { useState } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

export default function KycVerification() {
  const [kycType, setKycType] = useState('SSN');
  const [frontDocument, setFrontDocument] = useState<File | null>(null);
  const [backDocument, setBackDocument] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle KYC submission
    alert('KYC documents submitted successfully!');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'front') {
        setFrontDocument(file);
      } else {
        setBackDocument(file);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="bg-gray-100 text-gray-600 p-4 rounded-lg mb-6">
        <p className="text-sm">
          Ensure document provided contains the same information used during registration
        </p>
      </div>

      <div className="bg-white rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              KYC TYPE
            </label>
            <p className="text-sm text-gray-500 mb-3">Choose kyc type</p>
            <select
              value={kycType}
              onChange={(e) => setKycType(e.target.value)}
              className="w-full px-3 py-3 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="SSN">SSN</option>
              <option value="Passport">Passport</option>
              <option value="Driver License">Driver License</option>
              <option value="National ID">National ID</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              DOCUMENT FRONT
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                onChange={(e) => handleFileChange(e, 'front')}
                className="hidden"
                id="front-document"
                accept="image/*,.pdf"
              />
              <label
                htmlFor="front-document"
                className="cursor-pointer inline-flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
              >
                <DocumentTextIcon className="h-5 w-5" />
                <span>Choose file</span>
              </label>
              <p className="mt-2 text-sm text-gray-500">
                {frontDocument ? frontDocument.name : 'No file chosen'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              DOCUMENT BACK
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                onChange={(e) => handleFileChange(e, 'back')}
                className="hidden"
                id="back-document"
                accept="image/*,.pdf"
              />
              <label
                htmlFor="back-document"
                className="cursor-pointer inline-flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
              >
                <DocumentTextIcon className="h-5 w-5" />
                <span>Choose file</span>
              </label>
              <p className="mt-2 text-sm text-gray-500">
                {backDocument ? backDocument.name : 'No file chosen'}
              </p>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Submit kyc
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}