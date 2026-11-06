import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface ReferralCommission {
  id: string;
  level: number;
  commission_rate: number;
  description: string;
  is_active: boolean;
  created_at: string;
}

interface ReferralTransaction {
  id: string;
  referrer_name: string;
  referred_name: string;
  level: number;
  commission_amount: number;
  investment_amount: number;
  status: 'pending' | 'paid';
  created_at: string;
}

export default function ManageReferral() {
  const [commissionRates, setCommissionRates] = useState<ReferralCommission[]>([]);
  const [referralTransactions, setReferralTransactions] = useState<ReferralTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'rates' | 'transactions'>('rates');
  const [showRateForm, setShowRateForm] = useState(false);

  const [rateFormData, setRateFormData] = useState({
    level: 1,
    commission_rate: '',
    description: '',
    is_active: true
  });

  // Default commission structure
  const defaultRates: ReferralCommission[] = [
    {
      id: '1',
      level: 1,
      commission_rate: 10,
      description: 'Direct referrals - 10% commission',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      level: 2,
      commission_rate: 5,
      description: 'Second level referrals - 5% commission',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      level: 3,
      commission_rate: 2,
      description: 'Third level referrals - 2% commission',
      is_active: true,
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      // Load commission rates from localStorage or use defaults
      const savedRates = localStorage.getItem('referral_rates');
      if (savedRates) {
        setCommissionRates(JSON.parse(savedRates));
      } else {
        setCommissionRates(defaultRates);
        localStorage.setItem('referral_rates', JSON.stringify(defaultRates));
      }

      // Fetch actual referral transactions from database
      if (supabase) {
        const { data: referrals, error } = await supabase
          .from('referrals')
          .select(`
            *,
            referrer:profiles!referrals_referrer_id_fkey(username),
            referred:profiles!referrals_referred_id_fkey(username)
          `)
          .order('created_at', { ascending: false });

        if (!error && referrals) {
          const formattedTransactions = referrals.map((ref: any) => ({
            id: ref.id,
            referrer_name: ref.referrer?.username || 'Unknown',
            referred_name: ref.referred?.username || 'Unknown',
            level: 1, // Default to level 1
            commission_amount: Number(ref.commission_amount),
            investment_amount: Number(ref.commission_amount) / 0.1, // Assuming 10% rate
            status: ref.commission_paid ? 'paid' : 'pending',
            created_at: ref.created_at
          }));
          setReferralTransactions(formattedTransactions);
        }
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!rateFormData.commission_rate || rateFormData.level < 1) {
      alert('Please fill in all required fields');
      return;
    }

    const newRate: ReferralCommission = {
      id: Date.now().toString(),
      level: rateFormData.level,
      commission_rate: Number(rateFormData.commission_rate),
      description: rateFormData.description,
      is_active: rateFormData.is_active,
      created_at: new Date().toISOString()
    };

    const updatedRates = [...commissionRates, newRate];
    setCommissionRates(updatedRates);
    localStorage.setItem('referral_rates', JSON.stringify(updatedRates));

    setShowRateForm(false);
    setRateFormData({
      level: 1,
      commission_rate: '',
      description: '',
      is_active: true
    });

    alert('Commission rate added successfully!');
  };

  const handleEditRate = (rate: ReferralCommission) => {
    setRateFormData({
      level: rate.level,
      commission_rate: rate.commission_rate.toString(),
      description: rate.description,
      is_active: rate.is_active
    });
    setShowRateForm(true);
  };

  const handleToggleRateStatus = (rateId: string) => {
    const updatedRates = commissionRates.map(rate =>
      rate.id === rateId ? { ...rate, is_active: !rate.is_active } : rate
    );
    setCommissionRates(updatedRates);
    localStorage.setItem('referral_rates', JSON.stringify(updatedRates));
  };

  const handlePayCommission = async (transactionId: string) => {
    if (!confirm('Mark this commission as paid?')) return;

    try {
      const { error } = await supabase
        .from('referrals')
        .update({ commission_paid: true })
        .eq('id', transactionId);

      if (error) throw error;

      // Update local state
      setReferralTransactions(transactions =>
        transactions.map(t => 
          t.id === transactionId ? { ...t, status: 'paid' as const } : t
        )
      );

      alert('Commission marked as paid!');
    } catch (error) {
      console.error('Error updating commission:', error);
      alert('Failed to update commission');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Referral Program</h1>
        <p className="text-gray-600 mt-1">Configure commission rates and track referral earnings</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('rates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'rates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Commission Rates
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'transactions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Referral Transactions
          </button>
        </nav>
      </div>

      {activeTab === 'rates' && (
        <>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Commission Rate Structure</h2>
            <button
              onClick={() => setShowRateForm(!showRateForm)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
            >
              {showRateForm ? 'Cancel' : 'Add New Rate'}
            </button>
          </div>

          {/* Add Rate Form */}
          {showRateForm && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Commission Rate</h3>
              <form onSubmit={handleAddRate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={rateFormData.level}
                      onChange={(e) => setRateFormData(prev => ({ ...prev, level: Number(e.target.value) }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Rate (%) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={rateFormData.commission_rate}
                      onChange={(e) => setRateFormData(prev => ({ ...prev, commission_rate: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="rate_active"
                        checked={rateFormData.is_active}
                        onChange={(e) => setRateFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="rate_active" className="text-sm font-medium text-gray-700">
                        Active
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={rateFormData.description}
                      onChange={(e) => setRateFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Description of this commission level"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowRateForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    Add Rate
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {commissionRates.map((rate) => (
                  <tr key={rate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                      Level {rate.level}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {rate.commission_rate}%
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                      {rate.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        rate.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {rate.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditRate(rate)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleRateStatus(rate.id)}
                          className={`px-3 py-1 rounded text-xs ${
                            rate.is_active
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                        >
                          {rate.is_active ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'transactions' && (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Referral Commission Transactions</h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-500 text-white p-4 rounded-lg">
                <h3 className="text-sm font-medium mb-1">Total Referrals</h3>
                <p className="text-2xl font-bold">{referralTransactions.length}</p>
              </div>
              <div className="bg-green-500 text-white p-4 rounded-lg">
                <h3 className="text-sm font-medium mb-1">Total Paid</h3>
                <p className="text-2xl font-bold">
                  ${referralTransactions
                    .filter(t => t.status === 'paid')
                    .reduce((sum, t) => sum + t.commission_amount, 0)
                    .toFixed(2)}
                </p>
              </div>
              <div className="bg-yellow-500 text-white p-4 rounded-lg">
                <h3 className="text-sm font-medium mb-1">Pending Payment</h3>
                <p className="text-2xl font-bold">
                  ${referralTransactions
                    .filter(t => t.status === 'pending')
                    .reduce((sum, t) => sum + t.commission_amount, 0)
                    .toFixed(2)}
                </p>
              </div>
              <div className="bg-purple-500 text-white p-4 rounded-lg">
                <h3 className="text-sm font-medium mb-1">This Month</h3>
                <p className="text-2xl font-bold">
                  {referralTransactions.filter(t => {
                    const transDate = new Date(t.created_at);
                    const now = new Date();
                    return transDate.getMonth() === now.getMonth() && transDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referrer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referred User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Investment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      Loading referral transactions...
                    </td>
                  </tr>
                ) : referralTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      No referral transactions found
                    </td>
                  </tr>
                ) : (
                  referralTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {transaction.referrer_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transaction.referred_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Level {transaction.level}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${transaction.investment_amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                        ${transaction.commission_amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {transaction.status === 'pending' && (
                          <button
                            onClick={() => handlePayCommission(transaction.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}