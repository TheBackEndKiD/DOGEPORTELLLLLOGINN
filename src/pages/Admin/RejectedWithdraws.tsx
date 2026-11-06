import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface RejectedWithdraw {
  id: string;
  user: string;
  user_email: string;
  withdrawAmount: number;
  userWillGet: number;
  chargeType: string;
  charge: number;
  status: 'rejected';
  rejection_reason: string;
  created_at: string;
  updated_at: string;
}

export default function RejectedWithdraws() {
  const [withdraws, setWithdraws] = useState<RejectedWithdraw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRejectedWithdraws();
  }, []);

  const fetchRejectedWithdraws = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles(username, email)
        `)
        .eq('type', 'withdraw')
        .eq('status', 'rejected')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedWithdraws = data.map((tx: any) => ({
          id: tx.id,
          user: tx.profiles?.username || 'Unknown',
          user_email: tx.profiles?.email || 'N/A',
          withdrawAmount: Number(tx.amount),
          userWillGet: Number(tx.amount) * 0.98, // Assuming 2% fee
          chargeType: 'Fixed',
          charge: Number(tx.amount) * 0.02,
          status: 'rejected' as const,
          rejection_reason: tx.admin_notes || 'No reason provided',
          created_at: tx.created_at,
          updated_at: tx.updated_at
        }));
        setWithdraws(formattedWithdraws);
      }
    } catch (error) {
      console.error('Error fetching rejected withdraws:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetails = (withdrawId: string) => {
    const withdraw = withdraws.find(w => w.id === withdrawId);
    if (withdraw) {
      alert(`Rejection Details:\n\nUser: ${withdraw.user}\nEmail: ${withdraw.user_email}\nAmount: $${withdraw.withdrawAmount.toLocaleString()}\nRejection Reason: ${withdraw.rejection_reason}\nRejected: ${new Date(withdraw.updated_at).toLocaleString()}`);
    }
  };

  const handleReconsider = async (withdrawId: string) => {
    if (!confirm('Move this withdrawal back to pending for reconsideration?')) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status: 'pending',
          admin_notes: `Moved to pending for reconsideration at ${new Date().toISOString()}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', withdrawId);

      if (error) throw error;

      // Remove from rejected list
      setWithdraws(withdraws.filter(w => w.id !== withdrawId));
      alert('Withdrawal moved to pending for reconsideration!');
    } catch (error) {
      console.error('Error reconsidering withdrawal:', error);
      alert('Failed to move withdrawal to pending');
    }
  };

  const handlePermanentDelete = async (withdrawId: string) => {
    if (!confirm('Permanently delete this withdrawal record? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', withdrawId);

      if (error) throw error;

      setWithdraws(withdraws.filter(w => w.id !== withdrawId));
      alert('Withdrawal record deleted permanently!');
    } catch (error) {
      console.error('Error deleting withdrawal:', error);
      alert('Failed to delete withdrawal record');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Rejected Withdrawals</h1>
          <button
            onClick={fetchRejectedWithdraws}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Refresh
          </button>
        </div>
        <p className="text-gray-600 mt-2">Review and manage rejected withdrawal requests</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Withdraw amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User will get
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Charge
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rejection Reason
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
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2">Loading rejected withdrawals...</p>
                  </td>
                </tr>
              ) : withdraws.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No rejected withdrawals found
                  </td>
                </tr>
              ) : (
                withdraws.map((withdraw) => (
                  <tr key={withdraw.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {withdraw.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {withdraw.user_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                      ${withdraw.withdrawAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ${withdraw.userWillGet.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ${withdraw.charge.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                      <div className="truncate" title={withdraw.rejection_reason}>
                        {withdraw.rejection_reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(withdraw.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleDetails(withdraw.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleReconsider(withdraw.id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Reconsider
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(withdraw.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}