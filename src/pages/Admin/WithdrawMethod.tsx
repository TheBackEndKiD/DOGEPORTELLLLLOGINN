import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface WithdrawMethod {
  id: string;
  name: string;
  charge: number;
  chargeType: 'fixed' | 'percentage';
  minWithdraw: number;
  maxWithdraw: number;
  currency: string;
  status: 'active' | 'inactive';
  processing_time: string;
  description?: string;
}

// Default withdrawal methods
const defaultMethods: WithdrawMethod[] = [
  {
    id: '1',
    name: 'Bank Withdrawal',
    charge: 0.00,
    chargeType: 'fixed',
    minWithdraw: 1000.00,
    maxWithdraw: 10000000.00,
    currency: 'USD',
    status: 'active',
    processing_time: '1-3 business days',
    description: 'Direct bank transfer'
  },
  {
    id: '2',
    name: 'USDT (TRC20)',
    charge: 2.00,
    chargeType: 'fixed',
    minWithdraw: 50.00,
    maxWithdraw: 10000000.00,
    currency: 'USDT',
    status: 'active',
    processing_time: '10-30 minutes',
    description: 'USDT on Tron network'
  },
  {
    id: '3',
    name: 'Bitcoin Withdrawal',
    charge: 0.0005,
    chargeType: 'fixed',
    minWithdraw: 100.00,
    maxWithdraw: 10000000.00,
    currency: 'BTC',
    status: 'active',
    processing_time: '30-60 minutes',
    description: 'Bitcoin network transfer'
  },
  {
    id: '4',
    name: 'Ethereum (ERC20)',
    charge: 0.01,
    chargeType: 'fixed',
    minWithdraw: 100.00,
    maxWithdraw: 10000000.00,
    currency: 'ETH',
    status: 'inactive',
    processing_time: '15-30 minutes',
    description: 'Ethereum network transfer'
  }
];

export default function WithdrawMethod() {
  const [methods, setMethods] = useState<WithdrawMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<WithdrawMethod | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    charge: '',
    chargeType: 'fixed' as 'fixed' | 'percentage',
    minWithdraw: '',
    maxWithdraw: '',
    currency: 'USD',
    status: 'active' as 'active' | 'inactive',
    processing_time: '',
    description: ''
  });

  useEffect(() => {
    // Load methods from localStorage or use defaults
    const savedMethods = localStorage.getItem('withdraw_methods');
    if (savedMethods) {
      try {
        setMethods(JSON.parse(savedMethods));
      } catch (error) {
        setMethods(defaultMethods);
      }
    } else {
      setMethods(defaultMethods);
      localStorage.setItem('withdraw_methods', JSON.stringify(defaultMethods));
    }
    setLoading(false);
  }, []);

  const saveMethods = (newMethods: WithdrawMethod[]) => {
    localStorage.setItem('withdraw_methods', JSON.stringify(newMethods));
    setMethods(newMethods);
  };

  const handleCreateMethod = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.charge || !formData.minWithdraw || !formData.maxWithdraw) {
      alert('Please fill in all required fields');
      return;
    }

    const newMethod: WithdrawMethod = {
      id: Date.now().toString(),
      name: formData.name,
      charge: Number(formData.charge),
      chargeType: formData.chargeType,
      minWithdraw: Number(formData.minWithdraw),
      maxWithdraw: Number(formData.maxWithdraw),
      currency: formData.currency,
      status: formData.status,
      processing_time: formData.processing_time,
      description: formData.description
    };

    const updatedMethods = [...methods, newMethod];
    saveMethods(updatedMethods);

    resetForm();
    alert('Withdrawal method created successfully!');
  };

  const handleUpdateMethod = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingMethod) return;

    const updatedMethods = methods.map(m =>
      m.id === editingMethod.id ? {
        ...m,
        name: formData.name,
        charge: Number(formData.charge),
        chargeType: formData.chargeType,
        minWithdraw: Number(formData.minWithdraw),
        maxWithdraw: Number(formData.maxWithdraw),
        currency: formData.currency,
        status: formData.status,
        processing_time: formData.processing_time,
        description: formData.description
      } : m
    );

    saveMethods(updatedMethods);
    resetForm();
    alert('Withdrawal method updated successfully!');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      charge: '',
      chargeType: 'fixed',
      minWithdraw: '',
      maxWithdraw: '',
      currency: 'USD',
      status: 'active',
      processing_time: '',
      description: ''
    });
    setShowCreateForm(false);
    setEditingMethod(null);
  };

  const handleEdit = (method: WithdrawMethod) => {
    setEditingMethod(method);
    setFormData({
      name: method.name,
      charge: method.charge.toString(),
      chargeType: method.chargeType,
      minWithdraw: method.minWithdraw.toString(),
      maxWithdraw: method.maxWithdraw.toString(),
      currency: method.currency,
      status: method.status,
      processing_time: method.processing_time,
      description: method.description || ''
    });
    setShowCreateForm(true);
  };

  const handleDelete = (methodId: string) => {
    if (!confirm('Are you sure you want to delete this withdrawal method?')) return;

    const updatedMethods = methods.filter(m => m.id !== methodId);
    saveMethods(updatedMethods);
    alert('Withdrawal method deleted successfully!');
  };

  const handleToggleStatus = (methodId: string) => {
    const updatedMethods = methods.map(m =>
      m.id === methodId ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' } : m
    );
    saveMethods(updatedMethods);
  };

  const filteredMethods = methods.filter(method =>
    method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    method.currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Withdrawal Methods</h1>
          <p className="text-gray-600">Configure available withdrawal options for users</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search methods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md">
              🔍
            </button>
          </div>

          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setEditingMethod(null);
              resetForm();
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          >
            + Add Method
          </button>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editingMethod ? 'Edit Withdrawal Method' : 'Add New Withdrawal Method'}
          </h2>
          <form onSubmit={editingMethod ? handleUpdateMethod : handleCreateMethod} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Method Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Bank Transfer, Bitcoin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <input
                  type="text"
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value.toUpperCase() }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="USD, BTC, ETH"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Processing Time
                </label>
                <input
                  type="text"
                  value={formData.processing_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, processing_time: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1-3 business days"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Charge Amount *
                </label>
                <input
                  type="number"
                  step="0.00000001"
                  value={formData.charge}
                  onChange={(e) => setFormData(prev => ({ ...prev, charge: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Charge Type
                </label>
                <select
                  value={formData.chargeType}
                  onChange={(e) => setFormData(prev => ({ ...prev, chargeType: e.target.value as 'fixed' | 'percentage' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fixed">Fixed</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Withdraw *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.minWithdraw}
                  onChange={(e) => setFormData(prev => ({ ...prev, minWithdraw: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Withdraw *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.maxWithdraw}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxWithdraw: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Optional description for this withdrawal method"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                {editingMethod ? 'Update Method' : 'Create Method'}
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
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Currency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Charge
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min withdraw
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Max withdraw
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Processing Time
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
                    Loading withdrawal methods...
                  </td>
                </tr>
              ) : filteredMethods.map((method) => (
                <tr key={method.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    <div>
                      <div>{method.name}</div>
                      {method.description && (
                        <div className="text-xs text-gray-500">{method.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                    {method.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <span className="font-medium">
                        {method.charge.toFixed(method.chargeType === 'percentage' ? 2 : 8)}
                      </span>
                      <span className="text-gray-500 ml-1">
                        {method.chargeType === 'percentage' ? '%' : method.currency}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 capitalize">{method.chargeType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${method.minWithdraw.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${method.maxWithdraw.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {method.processing_time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        method.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {method.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => handleToggleStatus(method.id)}
                        className={`px-2 py-1 text-xs rounded ${
                          method.status === 'active'
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {method.status === 'active' ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(method)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(method.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-1">Total Methods</h3>
          <p className="text-2xl font-bold">{methods.length}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-1">Active Methods</h3>
          <p className="text-2xl font-bold">{methods.filter(m => m.status === 'active').length}</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-1">Cryptocurrencies</h3>
          <p className="text-2xl font-bold">{[...new Set(methods.map(m => m.currency))].length}</p>
        </div>
        <div className="bg-purple-500 text-white p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-1">Average Min</h3>
          <p className="text-2xl font-bold">
            ${(methods.reduce((sum, m) => sum + m.minWithdraw, 0) / methods.length || 0).toFixed(0)}
          </p>
        </div>
      </div>
    </div>
  );
}