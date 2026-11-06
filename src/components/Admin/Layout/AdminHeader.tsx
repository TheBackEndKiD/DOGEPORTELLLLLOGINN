import React from 'react';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';

export default function AdminHeader() {
  const { admin } = useAdminAuth();

  return (
    <div className="bg-white shadow-sm px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src="/DOGE LOOG.jpg" 
            alt="Department of Government Efficiency" 
            className="w-8 h-8 object-contain"
          />
          <h1 className="text-lg font-semibold text-gray-800">DOGE Administration</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            📊 Visit site
          </a>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-700 font-medium">Afrikaans</span>
            <div className="text-gray-500">📧 💬 📊 🔔</div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-700 font-medium">MANAGER</span>
            <span className="text-gray-700">Hi, MANAGER ▼</span>
          </div>
        </div>
      </div>
    </div>
  );
}