import React, { useState } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@doge.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log('🎯 AdminLogin: Component mounted');
    console.log('🎯 AdminLogin: Current URL:', window.location.href);
    
    import('../../lib/supabase').then(({ getConnectionStatus }) => {
      const status = getConnectionStatus();
      setConnectionStatus(status);
      
      if (!status.isInitialized) {
        setError('Database not connected. Please check your setup.');
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 AdminLogin: Form submitted with:', { email, password: '***' });

    if (!connectionStatus?.isInitialized) {
      setError('Database not connected. Please refresh the page and try again.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Wait for login to fully complete (including role check)
      await login(email, password);
      console.log('✅ AdminLogin: Login successful, role verified');

      // Use a small delay to ensure state is fully updated
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('✅ AdminLogin: Navigating to dashboard');
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      console.error('❌ AdminLogin: Login error:', err);
      if (err.message?.includes('not initialized')) {
        setError('Database connection failed. Please refresh and try again.');
      } else if (err.message?.includes('admin privileges')) {
        setError('Access denied: This account does not have admin privileges.');
      } else {
        setError(err.message || 'Invalid email or password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  console.log('🎨 AdminLogin: Rendering with state:', { 
    email, 
    hasPassword: !!password, 
    isLoading, 
    hasError: !!error 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-6">
            <img 
              src="/DOGE LOOG.jpg" 
              alt="Department of Government Efficiency" 
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">DOGE Administration</h1>
          <h2 className="text-2xl font-semibold text-blue-100">Admin Dashboard</h2>
          <p className="text-blue-200 mt-2">Department of Government Efficiency</p>
        </div>
        
        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">Admin Sign In</h2>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          
          {connectionStatus && !connectionStatus.isInitialized && (
            <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-300 p-3 rounded-lg mb-4 text-sm">
              <div className="font-medium mb-1">Database Setup Required:</div>
              <p className="mb-2">Connect Supabase database to enable admin features.</p>
              <div className="text-xs opacity-75">
                Missing: {!connectionStatus.hasUrl && 'SUPABASE_URL'} {!connectionStatus.hasKey && 'ANON_KEY'}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-cyan-500/10 border border-cyan-500/50 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-cyan-300 mb-2">Test Admin Credentials</h3>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center justify-between bg-white/10 rounded px-3 py-2">
                      <span className="text-blue-100">Email:</span>
                      <button
                        type="button"
                        onClick={() => setEmail('admin@doge.com')}
                        className="text-cyan-400 hover:text-cyan-300 font-mono text-xs hover:underline"
                      >
                        admin@doge.com
                      </button>
                    </div>
                    <div className="flex items-center justify-between bg-white/10 rounded px-3 py-2">
                      <span className="text-blue-100">Password:</span>
                      <button
                        type="button"
                        onClick={() => setPassword('admin123')}
                        className="text-cyan-400 hover:text-cyan-300 font-mono text-xs hover:underline"
                      >
                        admin123
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-blue-200 mt-2 italic">Click credentials to auto-fill</p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                placeholder="Enter admin email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                placeholder="Enter admin password"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] disabled:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In as Admin'
              )}
            </button>

            <div className="mt-4 text-center">
              <a
                href="/"
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                ← Back to User Login
              </a>
            </div>
          </form>
        </div>
        
        {/* Security Badge */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <p className="text-sm text-blue-200 italic">Secure Admin Access</p>
          </div>
        </div>
      </div>
    </div>
  );
}