import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface InterestLog {
  id: string;
  name: string;
  email: string;
  planName: string;
  investmentAmount: number;
  interestAmount: number;
  interestRate: number;
  timesGetPaid: number;
  totalPaid: number;
  date: string;
}

export default function UserInterestLog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [logs, setLogs] = useState<InterestLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterestLogs();
  }, []);

  const fetchInterestLogs = async () => {
    if (!supabase) return;

    try {
      // Fetch interest transactions with user and investment details
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles(username, email),
          user_investments(
            amount,
            investment_plans(name, interest_rate)
          )
        `)
        .eq('type', 'interest')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedLogs = data.map((tx: any) => {
          const investment = tx.user_investments?.[0];
          const plan = investment?.investment_plans;
          
          return {
            id: tx.id,
            name: tx.profiles?.username || 'Unknown',
            email: tx.profiles?.email || 'N/A',
            planName: plan?.name || 'N/A',
            investmentAmount: Number(investment?.amount || 0),
            interestAmount: Number(tx.amount),
            interestRate: Number(plan?.interest_rate || 0),
            timesGetPaid: 1, // Each record is one payment
            totalPaid: Number(tx.amount),
            date: tx.created_at
          };
        });
        setLogs(formattedLogs);
      }
    } catch (error) {
      console.error('Error fetching interest logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInterest = async (userId: string) => {
    const amount = prompt('Enter interest amount to add:');
    if (!amount || isNaN(Number(amount))) return;

    try {
      // Add interest transaction
      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'interest',
          amount: Number(amount),
          status: 'approved',
          payment_method: 'system',
          notes: 'Manual interest payment by admin',
          admin_notes: `Manual interest payment: $${amount}`
        });

      if (txError) throw txError;

      // Update user balance and profit
      const { data: profile } = await supabase
        .from('profiles')
        .select('balance, profit')
        .eq('id', userId)
        .single();

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            balance: Number(profile.balance) + Number(amount),
            profit: Number(profile.profit) + Number(amount)
          })
          .eq('id', userId);
      }

      alert('Interest payment added successfully!');
      fetchInterestLogs();
    } catch (error) {
      console.error('Error adding interest:', error);
      alert('Failed to add interest payment');
    }
  };

  const filteredLogs = logs.filter(log =>
    log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.planName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEntries = filteredLogs.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  const formatAmount = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">User Interest Log</h1>
          <button
            onClick={fetchInterestLogs}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Refresh
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
          
          <input
            type="text"
            placeholder="Search by name, email, or plan..."
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
                  Sl
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Investment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interest amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
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
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    Loading interest logs...
                  </td>
                </tr>
              ) : currentLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    No interest payments found
                  </td>
                </tr>
              ) : (
                currentLogs.map((log, index) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {log.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {log.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {log.planName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatAmount(log.investmentAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                      {formatAmount(log.interestAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {log.interestRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(log.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          const userId = logs.find(l => l.id === log.id)?.id;
                          if (userId) handleAddInterest(userId);
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Add Interest
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, totalEntries)} of {totalEntries} entries
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="px-3 py-1 text-sm bg-blue-500 text-white rounded">
              {currentPage}
            </span>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}