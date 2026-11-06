import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface ManualPayment {
  id: string;
  user: string;
  user_id: string;
  amount: number;
  network: string;
  status: string;
  created_at: string;
}

export default function ManualPayments() {
  const [payments, setPayments] = useState<ManualPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state for adding new manual payment
  const [showAddForm, setShowAddForm] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    user_id: '',
    amount: '',
    payment_method: 'manual_credit',
    notes: ''
  });

  useEffect(() => {
    fetchPayments();
    fetchUsers();
  }, []);

  const fetchPayments = async () => {
    if (!supabase) return;

    try {
      // Fetch manual payments (transactions marked as manual)
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles(username, email)
        `)
        .eq('payment_method', 'manual_credit')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedPayments = data.map((tx: any) => ({
          id: tx.id,
          user: tx.profiles?.username || tx.profiles?.email || 'Unknown',
          user_id: tx.user_id,
          amount: Number(tx.amount),
          network: tx.payment_method || 'Manual',
          status: tx.status,
          created_at: tx.created_at
        }));
        setPayments(formattedPayments);
      }
    } catch (error) {
      console.error('Error fetching manual payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, email')
        .eq('is_active', true)
        .order('username');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddManualPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.user_id || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Create transaction record
      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: formData.user_id,
          type: 'deposit',
          amount: Number(formData.amount),
          status: 'approved',
          payment_method: 'manual_credit',
          notes: formData.notes || 'Manual payment added by admin',
          admin_notes: `Manual credit: ${formData.notes}`
        })
        .select()
        .single();

      if (txError) throw txError;

      // Update user balance
      const { error: balanceError } = await supabase.rpc('increment', {
        table_name: 'profiles',
        row_id: formData.user_id,
        x: Number(formData.amount)
      });

      if (balanceError) {
        // Fallback to manual balance update
        const { data: profile } = await supabase
          .from('profiles')
          .select('balance, total_deposit')
          .eq('id', formData.user_id)
          .single();

        if (profile) {
          await supabase
            .from('profiles')
            .update({
              balance: Number(profile.balance) + Number(formData.amount),
              total_deposit: Number(profile.total_deposit) + Number(formData.amount)
            })
            .eq('id', formData.user_id);
        }
      }

      alert('Manual payment added successfully!');
      setShowAddForm(false);
      setFormData({ user_id: '', amount: '', payment_method: 'manual_credit', notes: '' });
      fetchPayments();
    } catch (error) {
      console.error('Error adding manual payment:', error);
      alert('Failed to add manual payment');
    }
  };

  const handleEdit = (paymentId: string) => {
    alert(`Edit payment functionality for ${paymentId}`);
  };

  const filteredPayments = payments.filter(payment =>
    payment.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Manual Payments</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
          >
            {showAddForm ? 'Cancel' : '+ Add Manual Payment'}
          </button>
        </div>

        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={fetchPayments}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Add Manual Payment Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Manual Payment</h2>
          <form onSubmit={handleAddManualPayment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select User
                </label>
                <select
                  value={formData.user_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, user_id: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose user...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Optional notes about this payment..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Add Payment
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Network
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
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No manual payments found
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {payment.network}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        payment.status === 'approved' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(payment.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Edit
                      </button>
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