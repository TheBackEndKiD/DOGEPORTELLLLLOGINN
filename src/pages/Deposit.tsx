import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface PaymentMethod {
  id: string;
  name: string;
  currency: string;
  wallet_address?: string;
  is_active: boolean;
}

export default function Deposit() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      // Load from localStorage (payment gateways)
      const savedGateways = localStorage.getItem('payment_gateways');
      if (savedGateways) {
        const gateways = JSON.parse(savedGateways);
        const activeMethods = gateways
          .filter((g: any) => g.status === 'active')
          .map((g: any) => ({
            id: g.id,
            name: g.name,
            currency: g.currency,
            wallet_address: g.wallet_address,
            is_active: true
          }));
        setPaymentMethods(activeMethods);
      } else {
        // Default payment methods
        const defaultMethods = [
          { id: '1', name: 'Bitcoin', currency: 'BTC', wallet_address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', is_active: true },
          { id: '2', name: 'Ethereum', currency: 'ETH', wallet_address: '0x742d35Cc6634C0532925a3b8D6d65A3d8E8e9f14', is_active: true },
          { id: '3', name: 'USDT (TRC20)', currency: 'USDT', wallet_address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE', is_active: true },
          { id: '4', name: 'PayPal', currency: 'USD', is_active: true },
          { id: '5', name: 'Bank Transfer', currency: 'USD', is_active: true }
        ];
        setPaymentMethods(defaultMethods);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    if (!selectedMethod || !amount || !user) {
      alert('Please select a payment method and enter an amount');
      return;
    }

    const depositAmount = Number(amount);
    if (depositAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setSubmitting(true);

    try {
      const method = paymentMethods.find(m => m.id === selectedMethod);
      if (!method) {
        alert('Invalid payment method selected');
        return;
      }

      // Create pending deposit transaction
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'deposit',
          amount: depositAmount,
          status: 'pending',
          payment_method: method.name,
          notes: `Deposit via ${method.name} - Amount: $${depositAmount}`
        });

      if (error) throw error;

      // Show payment instructions
      if (method.wallet_address) {
        alert(`Payment Instructions:\n\n1. Send $${depositAmount} worth of ${method.currency} to:\n${method.wallet_address}\n\n2. After payment, submit proof in your transaction log\n\n3. Your deposit will be processed within 24 hours\n\nTransaction created successfully!`);
      } else {
        alert(`Payment Instructions:\n\nMethod: ${method.name}\nAmount: $${depositAmount}\n\nPlease contact support for payment details.\n\nTransaction created successfully!`);
      }

      // Reset form
      setAmount('');
      setSelectedMethod('');
      
      // Navigate to transaction log
      navigate('/transaction-log');
    } catch (error) {
      console.error('Error creating deposit:', error);
      alert('Failed to create deposit transaction');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-green-500 hover:text-green-400 mb-4 flex items-center space-x-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">Deposit Funds</h1>
            <p className="text-gray-400 text-lg mb-6">Add funds to your DOGE investment account</p>
            
            <div className="bg-slate-800 p-6 rounded-lg mb-6">
              <h2 className="text-xl text-white mb-4">Account Balance</h2>
              <div className="text-3xl font-bold text-green-400 mb-2">
                ${user?.balance?.toLocaleString() || '0.00'}
              </div>
              <p className="text-gray-400">Available for investment</p>
            </div>
            
            <button 
              onClick={() => navigate('/transaction-log')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              View All Your Deposits
            </button>
          </div>

          {/* Right Side - Payment Form */}
          <div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-white text-lg mb-4">
                Select payment method and enter amount
              </h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading payment methods...</p>
                </div>
              ) : (
                <>
                  {/* Payment Method Selection */}
                  <div className="space-y-3 mb-6">
                    <label className="block text-gray-300 text-sm font-medium mb-3">
                      Choose Payment Method
                    </label>
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`w-full p-4 text-left rounded-lg border transition-all ${
                          selectedMethod === method.id
                            ? 'bg-blue-600 text-white border-blue-500 ring-2 ring-blue-400'
                            : 'bg-slate-700 text-gray-300 border-slate-600 hover:border-slate-500 hover:bg-slate-600'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{method.name}</div>
                            <div className="text-sm opacity-75">{method.currency}</div>
                          </div>
                          {method.wallet_address && (
                            <div className="text-xs opacity-75 font-mono">
                              {method.wallet_address.substring(0, 10)}...
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Amount Input */}
                  <div className="mb-6">
                    <label className="block text-gray-300 mb-2">Amount (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full bg-slate-700 text-white p-3 rounded-lg placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {amount && Number(amount) > 0 && (
                      <p className="text-sm text-gray-400 mt-2">
                        You will deposit: ${Number(amount).toFixed(2)}
                      </p>
                    )}
                  </div>

                  {/* Selected Method Info */}
                  {selectedMethodData && (
                    <div className="bg-slate-700 p-4 rounded-lg mb-6">
                      <h4 className="text-white font-medium mb-2">Payment Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Method:</span>
                          <span className="text-white">{selectedMethodData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Currency:</span>
                          <span className="text-white">{selectedMethodData.currency}</span>
                        </div>
                        {selectedMethodData.wallet_address && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Address:</span>
                            <span className="text-white font-mono text-xs break-all">
                              {selectedMethodData.wallet_address}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Pay Now Button */}
                  <button
                    onClick={handlePayNow}
                    disabled={!selectedMethod || !amount || submitting}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      'Create Deposit Request'
                    )}
                  </button>

                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-400">
                      Deposits are processed within 24 hours after payment confirmation
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}