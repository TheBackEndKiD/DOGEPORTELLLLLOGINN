import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface WithdrawMethod {
  id: string;
  name: string;
  currency: string;
  minWithdraw: number;
  maxWithdraw: number;
  charge: number;
  chargeType: 'fixed' | 'percentage';
  processing_time: string;
}

export default function Withdraw() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currency, setCurrency] = useState('BTC');
  const [network, setNetwork] = useState('');
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [transferCode, setTransferCode] = useState('');
  const [withdrawMethods, setWithdrawMethods] = useState<WithdrawMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchWithdrawMethods();
  }, []);

  const fetchWithdrawMethods = async () => {
    try {
      // Load from localStorage (withdrawal methods)
      const savedMethods = localStorage.getItem('withdraw_methods');
      if (savedMethods) {
        const methods = JSON.parse(savedMethods);
        const activeMethods = methods.filter((m: any) => m.status === 'active');
        setWithdrawMethods(activeMethods);
        if (activeMethods.length > 0) {
          setNetwork(activeMethods[0].id);
          setCurrency(activeMethods[0].currency);
        }
      } else {
        // Default withdrawal methods
        const defaultMethods = [
          {
            id: '1',
            name: 'Bitcoin Withdrawal',
            currency: 'BTC',
            minWithdraw: 100,
            maxWithdraw: 1000000,
            charge: 0.0005,
            chargeType: 'fixed' as const,
            processing_time: '30-60 minutes'
          },
          {
            id: '2',
            name: 'USDT (TRC20)',
            currency: 'USDT',
            minWithdraw: 50,
            maxWithdraw: 1000000,
            charge: 2,
            chargeType: 'fixed' as const,
            processing_time: '10-30 minutes'
          },
          {
            id: '3',
            name: 'Ethereum Withdrawal',
            currency: 'ETH',
            minWithdraw: 100,
            maxWithdraw: 1000000,
            charge: 0.01,
            chargeType: 'fixed' as const,
            processing_time: '15-30 minutes'
          }
        ];
        setWithdrawMethods(defaultMethods);
        if (defaultMethods.length > 0) {
          setNetwork(defaultMethods[0].id);
          setCurrency(defaultMethods[0].currency);
        }
      }
    } catch (error) {
      console.error('Error loading withdrawal methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    if (!amount || !walletAddress || !network || !user) {
      alert('Please fill all required fields');
      return;
    }

    const withdrawAmount = Number(amount);
    const selectedMethod = withdrawMethods.find(m => m.id === network);
    
    if (!selectedMethod) {
      alert('Invalid withdrawal method selected');
      return;
    }

    if (withdrawAmount < selectedMethod.minWithdraw) {
      alert(`Minimum withdrawal amount is $${selectedMethod.minWithdraw}`);
      return;
    }

    if (withdrawAmount > selectedMethod.maxWithdraw) {
      alert(`Maximum withdrawal amount is $${selectedMethod.maxWithdraw}`);
      return;
    }

    if (withdrawAmount > (user.balance || 0)) {
      alert('Insufficient balance for this withdrawal');
      return;
    }

    setSubmitting(true);

    try {
      // Calculate fees
      const fee = selectedMethod.chargeType === 'percentage' 
        ? withdrawAmount * (selectedMethod.charge / 100)
        : selectedMethod.charge;
      
      const netAmount = withdrawAmount - fee;

      // Create withdrawal transaction
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'withdraw',
          amount: withdrawAmount,
          status: 'pending',
          payment_method: selectedMethod.name,
          transaction_hash: walletAddress, // Store wallet address in transaction_hash field
          notes: `Withdrawal to ${walletAddress} - Net amount: $${netAmount.toFixed(2)} (Fee: $${fee.toFixed(2)})`,
          admin_notes: transferCode ? `Transfer code: ${transferCode}` : undefined
        });

      if (error) throw error;

      alert(`Withdrawal request submitted successfully!\n\nAmount: $${withdrawAmount}\nFee: $${fee.toFixed(2)}\nYou will receive: $${netAmount.toFixed(2)}\nProcessing time: ${selectedMethod.processing_time}\n\nYour request is now pending admin approval.`);

      // Reset form
      setAmount('');
      setWalletAddress('');
      setTransferCode('');
      
      // Navigate to transaction log
      navigate('/transaction-log');
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      alert('Failed to create withdrawal request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWithdrawToBank = () => {
    alert('Bank withdrawal feature coming soon! Please use cryptocurrency withdrawal for now.');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const selectedMethod = withdrawMethods.find(m => m.id === network);
  const withdrawAmount = Number(amount) || 0;
  const fee = selectedMethod ? (
    selectedMethod.chargeType === 'percentage' 
      ? withdrawAmount * (selectedMethod.charge / 100)
      : selectedMethod.charge
  ) : 0;
  const netAmount = withdrawAmount - fee;

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Left Side */}
      <div className="w-1/2 p-8 flex flex-col">
        <h1 className="text-4xl font-bold text-white mb-4">Withdraw Funds</h1>
        <p className="text-2xl text-gray-400 mb-4">Secure Cryptocurrency Withdrawal</p>
        <h2 className="text-2xl text-gray-500 mb-8">Fast & Reliable</h2>
        
        <div className="bg-slate-800 p-6 rounded-lg mb-6">
          <h3 className="text-white font-medium mb-4">Your Balance</h3>
          <div className="text-2xl font-bold text-green-400 mb-2">
            {formatCurrency(user?.balance || 0)}
          </div>
          <p className="text-gray-400 text-sm">Available for withdrawal</p>
        </div>
        
        <button 
          onClick={() => navigate('/transaction-log')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors max-w-md"
        >
          View All Withdrawals
        </button>
      </div>

      {/* Right Side - Withdrawal Form */}
      <div className="w-1/2 bg-slate-800 p-8">
        <div className="max-w-md mx-auto space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading withdrawal options...</p>
            </div>
          ) : (
            <>
              {/* Currency */}
              <div>
                <label className="block text-gray-300 text-sm mb-3">Currency</label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
                <p className="text-gray-400 text-sm mt-2">
                  Balance: {formatCurrency(user?.balance || 0)}
                </p>
              </div>

              {/* Network */}
              <div>
                <label className="block text-gray-300 text-sm mb-3">Withdrawal Method</label>
                <div className="grid grid-cols-1 gap-2">
                  {withdrawMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => {
                        setNetwork(method.id);
                        setCurrency(method.currency);
                      }}
                      className={`p-3 rounded-lg text-left transition-all ${
                        network === method.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      }`}
                    >
                      <div className="font-medium">{method.name}</div>
                      <div className="text-xs opacity-75">
                        Min: ${method.minWithdraw} | Max: ${method.maxWithdraw.toLocaleString()}
                      </div>
                      <div className="text-xs opacity-75">
                        Fee: {method.chargeType === 'percentage' ? `${method.charge}%` : `$${method.charge}`} | 
                        Time: {method.processing_time}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-gray-300 text-sm mb-3">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min={selectedMethod?.minWithdraw || 1}
                  max={Math.min(selectedMethod?.maxWithdraw || 1000000, user?.balance || 0)}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter withdrawal amount"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
                {selectedMethod && amount && (
                  <div className="mt-2 text-sm space-y-1">
                    <div className="flex justify-between text-gray-400">
                      <span>Withdrawal amount:</span>
                      <span>${withdrawAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Fee ({selectedMethod.chargeType}):</span>
                      <span>-${fee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white font-medium border-t border-slate-600 pt-1">
                      <span>You will receive:</span>
                      <span>${netAmount.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Wallet Address */}
              <div>
                <label className="block text-gray-300 text-sm mb-3">
                  Receiving wallet address
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter your wallet address"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 font-mono text-sm"
                />
              </div>

              {/* Transfer Code */}
              <div>
                <label className="block text-gray-300 text-sm mb-3">
                  Transfer Code (Optional)
                </label>
                <input
                  type="text"
                  value={transferCode}
                  onChange={(e) => setTransferCode(e.target.value)}
                  placeholder="Enter transfer code if required"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
                <p className="text-gray-400 text-xs mt-1">
                  Some withdrawals may require a transfer code from support
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={handleContinue}
                  disabled={!amount || !walletAddress || !network || submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    'Submit Withdrawal Request'
                  )}
                </button>
                
                <button
                  onClick={handleWithdrawToBank}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <span>🏦</span>
                  <span>Withdraw to Bank</span>
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">
                  Withdrawals are processed within {selectedMethod?.processing_time || '24 hours'} after approval
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}