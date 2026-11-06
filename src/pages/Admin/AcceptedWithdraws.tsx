import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface AcceptedWithdraw {
  id: string;
  user: string;
  user_email: string;
  withdrawAmount: number;
  userWillGet: number;
  chargeType: string;
  charge: number;
  status: 'approved';
  created_at: string;
  updated_at: string;
  admin_notes?: string;
}

export default function AcceptedWithdraws() {
  const [withdraws, setWithdraws] = useState<AcceptedWithdraw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAcceptedWithdraws();
  }, []);

  const fetchAcceptedWithdraws = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles(username, email)
        `)
        .eq('type', 'withdraw')
        .eq('status', 'approved')
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
          status: 'approved' as const,
          created_at: tx.created_at,
          updated_at: tx.updated_at,
          admin_notes: tx.admin_notes
        }));
        setWithdraws(formattedWithdraws);
      }
    } catch (error) {
      console.error('Error fetching accepted withdraws:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetails = (withdrawId: string) => {
    const withdraw = withdraws.find(w => w.id === withdrawId);
    if (withdraw) {
      alert(`Withdrawal Details:\n\nUser: ${withdraw.user}\nEmail: ${withdraw.user_email}\nAmount: $${withdraw.withdrawAmount.toLocaleString()}\nUser Gets: $${withdraw.userWillGet.toLocaleString()}\nCharge: $${withdraw.charge.toFixed(2)}\nApproved: ${new Date(withdraw.updated_at).toLocaleString()}\nNotes: ${withdraw.admin_notes || 'None'}`);
    }
  };

  const handleReprocess = async (withdrawId: string) => {
    if (!confirm('Mark this withdrawal for reprocessing?')) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status: 'pending',
          admin_notes: `Reprocessed by admin at ${new Date().toISOString()}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', withdrawId);

      if (error) throw error;

      // Remove from accepted list
      setWithdraws(withdraws.filter(w => w.id !== withdrawId));
      alert('Withdrawal marked for reprocessing!');
    } catch (error) {
      console.error('Error reprocessing withdrawal:', error);
      alert('Failed to reprocess withdrawal');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Accepted Withdrawals</h1>
          <button
            onClick={fetchAcceptedWithdraws}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Refresh
          </button>
        </div>
        <p className="text-gray-600 mt-2">View all approved withdrawal transactions</p>
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
                  Charge type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Charge
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
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2">Loading accepted withdrawals...</p>
                  </td>
                </tr>
              ) : withdraws.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No accepted withdrawals found
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      ${withdraw.userWillGet.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {withdraw.chargeType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ${withdraw.charge.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Approved
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDetails(withdraw.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleReprocess(withdraw.id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Reprocess
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