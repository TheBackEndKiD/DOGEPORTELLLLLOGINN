import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Payment {
  id: string;
  user: string;
  user_email: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  payment_method: string;
  created_at: string;
  transaction_hash?: string;
  notes?: string;
}

export default function AllPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles(username, email)
        `)
        .eq('type', 'deposit')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedPayments = data.map((tx: any) => ({
          id: tx.id,
          user: tx.profiles?.username || 'Unknown User',
          user_email: tx.profiles?.email || '',
          amount: Number(tx.amount),
          status: tx.status,
          payment_method: tx.payment_method || 'N/A',
          created_at: tx.created_at,
          transaction_hash: tx.transaction_hash,
          notes: tx.notes
        }));
        setPayments(formattedPayments);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeeProof = async (paymentId: string) => {
    const payment = payments.find(p => p.id === paymentId);
    if (payment?.transaction_hash) {
      alert(`Transaction Hash: ${payment.transaction_hash}`);
    } else {
      alert('No proof submitted yet');
    }
  };

  const handleAccept = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (error) throw error;

      // Update local state
      setPayments(payments.map(p => 
        p.id === paymentId ? { ...p, status: 'approved' as const } : p
      ));
      
      alert('Payment accepted successfully!');
    } catch (error) {
      console.error('Error accepting payment:', error);
      alert('Failed to accept payment');
    }
  };

  const handleReject = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (error) throw error;

      // Update local state
      setPayments(payments.map(p => 
        p.id === paymentId ? { ...p, status: 'rejected' as const } : p
      ));
      
      alert('Payment rejected successfully!');
    } catch (error) {
      console.error('Error rejecting payment:', error);
      alert('Failed to reject payment');
    }
  };

  const handleDelete = async (paymentId: string) => {
    if (!confirm('Are you sure you want to delete this payment record?')) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', paymentId);

      if (error) throw error;

      setPayments(payments.filter(p => p.id !== paymentId));
      alert('Payment deleted successfully!');
    } catch (error) {
      console.error('Error deleting payment:', error);
      alert('Failed to delete payment');
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">All Payments</h1>
        
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-600">
          Please set cron url to your server to dispatch returns. This is because some users won't submit proof after payment. 
          If "See Proof" button returns error, means user didn't submit proof or complete deposit process. 
          Only accept deposit if you received amount.
        </div>

        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by user or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            onClick={fetchPayments}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
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
                  Payment Method
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
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2">Loading payments...</p>
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No payments found
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {payment.user_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {payment.payment_method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        payment.status === 'approved' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status === 'pending' ? 'Awaiting payment' : payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleSeeProof(payment.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                        >
                          See proof
                        </button>
                        {payment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAccept(payment.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(payment.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(payment.id)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
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