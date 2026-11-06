import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<any>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Check connection status on component mount
  React.useEffect(() => {
    import('../lib/supabase').then(({ getConnectionStatus }) => {
      const status = getConnectionStatus();
      setConnectionStatus(status);
      
      if (!status.isInitialized) {
        setError('Database not connected. Please check your setup.');
      }
    });
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message?.includes('not initialized')) {
        setError('Database connection failed. Please refresh and try again.');
      } else {
        setError(err.message || 'Invalid email or password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-6">
            <img
              src="/DOGE LOOG.jpg"
              alt="Department of Government Efficiency"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">DOGE Portal</h1>
          <p className="text-cyan-300 text-lg">Department of Government Efficiency</p>
          <p className="text-gray-400 text-sm">Secure Investment Platform</p>
        </div>

        <div className="bg-slate-800/70 backdrop-blur-sm p-8 rounded-2xl border border-slate-600/50 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-1">Login</h2>
            <div className="w-full h-0.5 bg-gradient-to-r from-cyan-400 to-transparent"></div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {connectionStatus && !connectionStatus.isInitialized && (
              <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-300 p-3 rounded-lg text-sm">
                <div className="font-medium mb-1">Database Setup Required:</div>
                <p className="mb-2">Click the Supabase button in settings (⚙️) to connect your database.</p>
                <div className="text-xs opacity-75">
                  Missing: {!connectionStatus.hasUrl && 'SUPABASE_URL'} {!connectionStatus.hasKey && 'ANON_KEY'}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-3">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 text-slate-900 font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Login</span>
                </div>
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Need an account? <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium">Sign Up</Link>
              </p>
            </div>
          </form>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <p className="text-sm text-gray-400 italic">Verified. Secure. Encrypted.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
