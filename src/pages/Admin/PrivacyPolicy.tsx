import React, { useState } from 'react';

export default function PrivacyPolicy() {
  const [title, setTitle] = useState('Privacy Policy');
  const [content, setContent] = useState(`Financial Market Biz Limited operates the https://financialmarketbiz.org/ website, which provides the SERVICE.

This page is used to inform website visitors regarding our policies regarding the collection, use, and disclosure of Personal Information if anyone decides to use our Service.

If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.

The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which are accessible at https://financialmarketbiz.org/ unless otherwise defined in this Privacy Policy.

Information Collection and Use

For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to your name, phone number, and postal address. The information that we collect will be used to contact or identify you.

Log Data

We want to inform you that whenever you visit our Service, we collect information that your browser sends to us which is called Log Data. This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser version, pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other statistics.

Cookies`);

  const handleSave = () => {
    alert('Privacy Policy updated successfully!');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Manage Privacy Policy Section</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Privacy policy
            </label>
            
            {/* Rich Text Editor Toolbar */}
            <div className="border border-gray-300 rounded-md">
              <div className="border-b border-gray-300 p-2 flex items-center space-x-2 bg-gray-50">
                <button className="p-1 hover:bg-gray-200 rounded">🖋️</button>
                <button className="p-1 hover:bg-gray-200 rounded font-bold">B</button>
                <button className="p-1 hover:bg-gray-200 rounded italic">I</button>
                <button className="p-1 hover:bg-gray-200 rounded underline">U</button>
                <button className="p-1 hover:bg-gray-200 rounded line-through">S</button>
                <select className="text-sm border rounded px-2 py-1 bg-white">
                  <option>Poppins</option>
                  <option>Arial</option>
                  <option>Helvetica</option>
                </select>
                <button className="p-1 hover:bg-gray-200 rounded">⚠️</button>
                <button className="p-1 hover:bg-gray-200 rounded">•</button>
                <button className="p-1 hover:bg-gray-200 rounded">1.</button>
                <button className="p-1 hover:bg-gray-200 rounded">⇥</button>
                <button className="p-1 hover:bg-gray-200 rounded">⇤</button>
                <button className="p-1 hover:bg-gray-200 rounded">📋</button>
                <button className="p-1 hover:bg-gray-200 rounded">🔗</button>
                <button className="p-1 hover:bg-gray-200 rounded">📷</button>
                <button className="p-1 hover:bg-gray-200 rounded">📹</button>
                <button className="p-1 hover:bg-gray-200 rounded">❌</button>
                <button className="p-1 hover:bg-gray-200 rounded">&lt;/&gt;</button>
                <button className="p-1 hover:bg-gray-200 rounded">?</button>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 border-0 focus:outline-none resize-none"
                rows={15}
                placeholder="Enter privacy policy content..."
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium"
            >
              Update Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}