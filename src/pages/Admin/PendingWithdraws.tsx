import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface PendingWithdraw {
  id: string;
  user: string;
  user_email: string;
  amount: number;
  network: string;
  wallet_address: string;
  status: string;
  created_at: string;
  notes?: string;
}

export default function PendingWithdraws() {
  const [withdraws, setWithdraws] = useState<PendingWithdraw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingWithdraws();
  }, []);

  const fetchPendingWithdraws = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles(username, email)
        `)
        .eq('type', 'withdraw')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedWithdraws = data.map((tx: any) => ({
          id: tx.id,
          user: tx.profiles?.username || 'Unknown',
          user_email: tx.profiles?.email || 'N/A',
          amount: Number(tx.amount),
          network: tx.payment_method || 'N/A',
          wallet_address: tx.transaction_hash || 'N/A',
          status: tx.status,
          created_at: tx.created_at,
          notes: tx.notes
        }));
        setWithdraws(formattedWithdraws);
      }
    } catch (error) {
      console.error('Error fetching pending withdraws:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (withdrawId: string) => {
    if (!confirm('Are you sure you want to approve this withdrawal?')) return;

    try {
      const withdraw = withdraws.find(w => w.id === withdrawId);
      if (!withdraw) return;

      // Update transaction status
      const { error: txError } = await supabase
        .from('transactions')
        .update({ 
          status: 'approved',
          admin_notes: `Approved by admin at ${new Date().toISOString()}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', withdrawId);

      if (txError) throw txError;

      // Update user balance (subtract withdrawal amount)
      const { data: profile } = await supabase
        .from('profiles')
        .select('balance, total_withdrawn')
        .eq('id', withdraw.user_id || '')
        .single();

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            balance: Number(profile.balance) - withdraw.amount,
            total_withdrawn: Number(profile.total_withdrawn) + withdraw.amount
          })
          .eq('id', withdraw.user_id || '');
      }

      // Remove from pending list
      setWithdraws(withdraws.filter(w => w.id !== withdrawId));
      alert('Withdrawal approved successfully!');
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      alert('Failed to approve withdrawal');
    }
  };

  const handleReject = async (withdrawId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status: 'rejected',
          admin_notes: `Rejected: ${reason}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', withdrawId);

      if (error) throw error;

      // Remove from pending list
      setWithdraws(withdraws.filter(w => w.id !== withdrawId));
      alert('Withdrawal rejected successfully!');
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      alert('Failed to reject withdrawal');
    }
  };

  const handleViewDetails = (withdrawId: string) => {
    const withdraw = withdraws.find(w => w.id === withdrawId);
    if (withdraw) {
      alert(`Withdrawal Details:\n\nUser: ${withdraw.user}\nAmount: $${withdraw.amount}\nNetwork: ${withdraw.network}\nWallet: ${withdraw.wallet_address}\nNotes: ${withdraw.notes || 'None'}`);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Pending Withdrawals</h1>
          <button
            onClick={fetchPendingWithdraws}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Refresh
          </button>
        </div>
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
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Network
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wallet Address
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
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2">Loading pending withdrawals...</p>
                  </td>
                </tr>
              ) : withdraws.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No pending withdrawals found
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
                      ${withdraw.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {withdraw.network}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                      {withdraw.wallet_address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(withdraw.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleViewDetails(withdraw.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleApprove(withdraw.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(withdraw.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Reject
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