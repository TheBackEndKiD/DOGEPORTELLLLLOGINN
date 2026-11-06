import React, { useState, useEffect } from 'react';
import { testConnection, getConnectionStatus } from '../lib/supabase';
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

export default function ConnectionStatus() {
  const [status, setStatus] = useState<any>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const connectionStatus = getConnectionStatus();
    setStatus(connectionStatus);
    
    // Auto-test connection on mount if client is initialized
    if (connectionStatus.isInitialized) {
      autoTestConnection();
    }
  }, []);

  const autoTestConnection = async () => {
    setTesting(true);
    const result = await testConnection();
    setTestResult(result);
    setTesting(false);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    const result = await testConnection();
    setTestResult(result);
    setTesting(false);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (!status) return null;

  const hasIssues = !status.isInitialized || !status.hasUrl || !status.hasKey;
  const hasConnectionError = testResult && !testResult.success;

  // Show status if there are issues OR if connection test failed
  if (!hasIssues && !hasConnectionError) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className={`${hasIssues ? 'bg-red-50 border-red-400' : 'bg-yellow-50 border-yellow-400'} border-l-4 p-4 rounded-md shadow-lg`}>
        <div className="flex">
          <div className="flex-shrink-0">
            {hasIssues ? (
              <XCircleIcon className="h-5 w-5 text-red-400" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            )}
          </div>
          <div className="ml-3 flex-1">
            <h3 className={`text-sm font-medium ${hasIssues ? 'text-red-800' : 'text-yellow-800'}`}>
              {hasIssues ? 'Supabase Configuration Missing' : 'Database Connection Failed'}
            </h3>
            
            <div className={`mt-2 text-sm ${hasIssues ? 'text-red-700' : 'text-yellow-700'}`}>
              {hasIssues ? (
                <div className="space-y-2">
                  <p>Your app needs these environment variables:</p>
                  <ul className="space-y-1 ml-4">
                    {!status.hasUrl && (
                      <li className="flex items-center">
                        <XCircleIcon className="h-4 w-4 text-red-500 mr-2" />
                        VITE_SUPABASE_URL is missing
                      </li>
                    )}
                    {!status.hasKey && (
                      <li className="flex items-center">
                        <XCircleIcon className="h-4 w-4 text-red-500 mr-2" />
                        VITE_SUPABASE_ANON_KEY is missing
                      </li>
                    )}
                    {status.hasUrl && status.hasKey && !status.isInitialized && (
                      <li className="flex items-center">
                        <XCircleIcon className="h-4 w-4 text-red-500 mr-2" />
                        Client initialization failed
                      </li>
                    )}
                  </ul>
                </div>
              ) : (
                <div>
                  <p>Connection configured but unable to reach database.</p>
                  {testResult?.error && (
                    <p className="mt-1 font-mono text-xs">{testResult.error}</p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2">
              {status.isInitialized && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleTestConnection}
                    disabled={testing}
                    className="inline-flex items-center px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {testing ? (
                      <>
                        <ArrowPathIcon className="h-3 w-3 mr-1 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      'Test Connection'
                    )}
                  </button>
                  
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="inline-flex items-center px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    {showDetails ? 'Hide' : 'Show'} Details
                  </button>
                </div>
              )}

              <button
                onClick={handleRetry}
                className="inline-flex items-center px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
              >
                <ArrowPathIcon className="h-3 w-3 mr-1" />
                Retry Connection
              </button>
            </div>

            {testResult && (
              <div className="mt-3">
                <div className="flex items-center text-sm">
                  {testResult.success ? (
                    <>
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-green-700 font-medium">
                        Connected ({testResult.responseTime}ms)
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-red-700 font-medium">Connection Failed</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {showDetails && (
              <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
                <div className="space-y-1">
                  <div>URL: {status.url}</div>
                  <div>Key Length: {status.keyLength} chars</div>
                  <div>URL Valid: {status.urlValid ? '✅' : '❌'}</div>
                  <div>Key Valid: {status.keyValid ? '✅' : '❌'}</div>
                  {testResult?.details && (
                    <div>Error: {JSON.stringify(testResult.details, null, 2)}</div>
                  )}
                </div>
              </div>
            )}
            
            {hasIssues && (
              <div className="mt-3 p-2 bg-gray-800 rounded text-xs">
                <div className="text-gray-300 font-mono">
                  <div className="text-white font-bold mb-1">Add to .env file:</div>
                  <div className="space-y-1">
                    <div>VITE_SUPABASE_URL=https://your-project.supabase.co</div>
                    <div>VITE_SUPABASE_ANON_KEY=your_anon_key_here</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}