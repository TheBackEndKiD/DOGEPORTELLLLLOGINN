import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function AdminAccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-6">
            <img
              src="/DOGE LOOG.jpg"
              alt="Department of Government Efficiency"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">DOGE Administration</h1>
          <p className="text-blue-200 text-lg">Department of Government Efficiency</p>
          <p className="text-gray-400 text-sm">Administrative Access Portal</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-blue-300" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Administrative Access</h2>
            <p className="text-blue-200 text-sm">Authorized personnel only</p>
          </div>

          <div className="space-y-4">
            <Link
              to="/admin/login"
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2"
            >
              <ShieldCheckIcon className="h-5 w-5" />
              <span>Admin Login</span>
            </Link>

            <div className="text-center">
              <p className="text-xs text-blue-200 mb-4">
                For authorized administrators only
              </p>
              
              <Link
                to="/"
                className="inline-flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300"
              >
                <ArrowLeftIcon className="h-3 w-3" />
                <span>Back to User Login</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <p className="text-sm text-blue-200 italic">Secure Access Portal</p>
          </div>
        </div>
      </div>
    </div>
  );
}