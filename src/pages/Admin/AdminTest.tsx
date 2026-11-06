import React from 'react';

export default function AdminTest() {
  React.useEffect(() => {
    console.log('🧪 AdminTest: Component mounted successfully');
    console.log('🧪 AdminTest: Current location:', window.location.href);
  }, []);

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center">
      <div className="text-center text-white max-w-md">
        <h1 className="text-4xl font-bold mb-4">✅ Admin Route Test</h1>
        <p className="text-xl mb-4">This page confirms admin routing is working!</p>
        <div className="bg-blue-800 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <p className="text-sm">URL: {window.location.href}</p>
          <p className="text-sm">Path: {window.location.pathname}</p>
          <p className="text-sm">Time: {new Date().toLocaleTimeString()}</p>
        </div>
        <div className="space-y-4">
          <a 
            href="/admin/login" 
            className="block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go to Admin Login
          </a>
          <button
            onClick={() => window.location.href = '/admin/login'}
            className="block w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Force Navigate to Admin Login
          </button>
          <a 
            href="/" 
            className="block bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Main Site
          </a>
        </div>
      </div>
    </div>
  );
}