import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Commission {
  id: string;
  from: string;
  from_email: string;
  to: string;
  to_email: string;
  amount: number;
  commission_rate: number;
  investment_amount: number;
  date: string;
  status: 'paid' | 'pending';
}

export default function CommissionLog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    if (!supabase) return;

    try {
      // Fetch referral commissions from referrals table
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          referrer:profiles!referrals_referrer_id_fkey(username, email),
          referred:profiles!referrals_referred_id_fkey(username, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedCommissions = data.map((ref: any) => ({
          id: ref.id,
          from: ref.referred?.username || 'Unknown',
          from_email: ref.referred?.email || 'N/A',
          to: ref.referrer?.username || 'Unknown',
          to_email: ref.referrer?.email || 'N/A',
          amount: Number(ref.commission_amount),
          commission_rate: 10, // Default 10% commission
          investment_amount: Number(ref.commission_amount) / 0.1, // Calculate original investment
          date: ref.created_at,
          status: ref.commission_paid ? 'paid' : 'pending'
        }));
        setCommissions(formattedCommissions);
      }
    } catch (error) {
      console.error('Error fetching commissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayCommission = async (commissionId: string) => {
    if (!confirm('Mark this commission as paid?')) return;

    try {
      const { error } = await supabase
        .from('referrals')
        .update({ commission_paid: true })
        .eq('id', commissionId);

      if (error) throw error;

      // Update local state
      setCommissions(commissions.map(c => 
        c.id === commissionId ? { ...c, status: 'paid' as const } : c
      ));
      
      alert('Commission marked as paid!');
    } catch (error) {
      console.error('Error updating commission:', error);
      alert('Failed to update commission status');
    }
  };

  const handleViewDetails = (commission: Commission) => {
    alert(`Commission Details:\n\nFrom: ${commission.from} (${commission.from_email})\nTo: ${commission.to} (${commission.to_email})\nCommission Amount: $${commission.amount.toFixed(2)}\nOriginal Investment: $${commission.investment_amount.toFixed(2)}\nCommission Rate: ${commission.commission_rate}%\nStatus: ${commission.status}\nDate: ${new Date(commission.date).toLocaleString()}`);
  };

  const filteredCommissions = commissions.filter(commission =>
    commission.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commission.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commission.from_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commission.to_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCommissions = commissions.reduce((sum, c) => sum + c.amount, 0);
  const paidCommissions = commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0);
  const pendingCommissions = commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Commission Log</h1>
          <button
            onClick={fetchCommissions}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Refresh
          </button>
        </div>

        {/* Commission Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-500 text-white p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-1">Total Commissions</h3>
            <p className="text-2xl font-bold">${totalCommissions.toFixed(2)}</p>
          </div>
          <div className="bg-green-500 text-white p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-1">Paid Commissions</h3>
            <p className="text-2xl font-bold">${paidCommissions.toFixed(2)}</p>
          </div>
          <div className="bg-yellow-500 text-white p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-1">Pending Commissions</h3>
            <p className="text-2xl font-bold">${pendingCommissions.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission from
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission to
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Investment Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission date
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
                    Loading commissions...
                  </td>
                </tr>
              ) : filteredCommissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No commission data found
                  </td>
                </tr>
              ) : (
                filteredCommissions.map((commission) => (
                  <tr key={commission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{commission.from}</div>
                        <div className="text-gray-500 text-xs">{commission.from_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{commission.to}</div>
                        <div className="text-gray-500 text-xs">{commission.to_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${commission.investment_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                      ${commission.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {commission.commission_rate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        commission.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {commission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(commission.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(commission)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                        >
                          View
                        </button>
                        {commission.status === 'pending' && (
                          <button
                            onClick={() => handlePayCommission(commission.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                          >
                            Pay
                          </button>
                        )}
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