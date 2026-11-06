import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminFallback() {
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log('AdminFallback component loaded, redirecting to login...');
    navigate('/admin/login');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Redirecting to Admin Login...</p>
      </div>
    </div>
  );
}