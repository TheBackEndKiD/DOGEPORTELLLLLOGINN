import React, { useState, useEffect } from 'react';

interface Gateway {
  id: string;
  name: string;
  currency: string;
  rate: number;
  status: 'active' | 'inactive';
  wallet_address?: string;
  api_key?: string;
  created_at: string;
}

// Simulated crypto gateways data (since this is typically stored in app config)
const defaultGateways: Gateway[] = [
  {
    id: '1',
    name: 'Bitcoin',
    currency: 'BTC',
    rate: 1.00000000,
    status: 'active',
    wallet_address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'USDT (TRC20)',
    currency: 'USDT',
    rate: 1.00000000,
    status: 'active',
    wallet_address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Ethereum(ERC20)',
    currency: 'ETH',
    rate: 1.00000000,
    status: 'active',
    wallet_address: '0x742d35Cc6634C0532925a3b8D6d65A3d8E8e9f14',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'USDT (BRC20)',
    currency: 'USDT',
    rate: 1.00000000,
    status: 'active',
    wallet_address: 'bc1pxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    created_at: new Date().toISOString()
  }
];

export default function PaymentGateway() {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGateway, setEditingGateway] = useState<Gateway | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    currency: '',
    rate: '1.00000000',
    wallet_address: '',
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    // Load gateways from localStorage or use defaults
    const savedGateways = localStorage.getItem('payment_gateways');
    if (savedGateways) {
      try {
        setGateways(JSON.parse(savedGateways));
      } catch (error) {
        setGateways(defaultGateways);
      }
    } else {
      setGateways(defaultGateways);
      localStorage.setItem('payment_gateways', JSON.stringify(defaultGateways));
    }
    setLoading(false);
  }, []);

  const saveGateways = (newGateways: Gateway[]) => {
    localStorage.setItem('payment_gateways', JSON.stringify(newGateways));
    setGateways(newGateways);
  };

  const handleCreateGateway = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.currency || !formData.wallet_address) {
      alert('Please fill in all required fields');
      return;
    }

    const newGateway: Gateway = {
      id: Date.now().toString(),
      name: formData.name,
      currency: formData.currency.toLowerCase(),
      rate: Number(formData.rate),
      status: formData.status,
      wallet_address: formData.wallet_address,
      created_at: new Date().toISOString()
    };

    const updatedGateways = [...gateways, newGateway];
    saveGateways(updatedGateways);

    setShowCreateForm(false);
    setFormData({
      name: '',
      currency: '',
      rate: '1.00000000',
      wallet_address: '',
      status: 'active'
    });

    alert('Gateway created successfully!');
  };

  const handleUpdateGateway = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingGateway) return;

    const updatedGateways = gateways.map(g =>
      g.id === editingGateway.id ? {
        ...g,
        name: formData.name,
        currency: formData.currency.toLowerCase(),
        rate: Number(formData.rate),
        wallet_address: formData.wallet_address,
        status: formData.status
      } : g
    );

    saveGateways(updatedGateways);
    setEditingGateway(null);
    setFormData({
      name: '',
      currency: '',
      rate: '1.00000000',
      wallet_address: '',
      status: 'active'
    });

    alert('Gateway updated successfully!');
  };

  const handleEdit = (gateway: Gateway) => {
    setEditingGateway(gateway);
    setFormData({
      name: gateway.name,
      currency: gateway.currency,
      rate: gateway.rate.toString(),
      wallet_address: gateway.wallet_address || '',
      status: gateway.status
    });
    setShowCreateForm(true);
  };

  const handleToggleStatus = (gatewayId: string) => {
    const updatedGateways = gateways.map(g =>
      g.id === gatewayId ? { ...g, status: g.status === 'active' ? 'inactive' : 'active' } : g
    );
    saveGateways(updatedGateways);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Payment Gateways</h1>
        
        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditingGateway(null);
            setFormData({
              name: '',
              currency: '',
              rate: '1.00000000',
              wallet_address: '',
              status: 'active'
            });
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2"
        >
          <span>+</span>
          <span>Create gateway</span>
        </button>
      </div>

      {/* Create/Edit Gateway Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editingGateway ? 'Edit Gateway' : 'Create New Gateway'}
          </h2>
          <form onSubmit={editingGateway ? handleUpdateGateway : handleCreateGateway} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gateway Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Bitcoin, USDT"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency Code
                </label>
                <input
                  type="text"
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value.toUpperCase() }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., BTC, ETH, USDT"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exchange Rate
                </label>
                <input
                  type="number"
                  step="0.00000001"
                  value={formData.rate}
                  onChange={(e) => setFormData(prev => ({ ...prev, rate: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Address
                </label>
                <input
                  type="text"
                  value={formData.wallet_address}
                  onChange={(e) => setFormData(prev => ({ ...prev, wallet_address: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Enter wallet address for this cryptocurrency"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingGateway(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                {editingGateway ? 'Update Gateway' : 'Create Gateway'}
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
                  Wallet Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
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
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Loading gateways...
                  </td>
                </tr>
              ) : gateways.map((gateway) => (
                <tr key={gateway.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {gateway.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                    {gateway.currency.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                    <div className="truncate font-mono text-xs">
                      {gateway.wallet_address}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {gateway.rate.toFixed(8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        gateway.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {gateway.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => handleToggleStatus(gateway.id)}
                        className={`px-2 py-1 text-xs rounded ${
                          gateway.status === 'active'
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {gateway.status === 'active' ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(gateway)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          const address = gateway.wallet_address;
                          if (address) {
                            navigator.clipboard.writeText(address);
                            alert('Wallet address copied to clipboard!');
                          }
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Copy
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gateway Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-1">Total Gateways</h3>
          <p className="text-2xl font-bold">{gateways.length}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-1">Active Gateways</h3>
          <p className="text-2xl font-bold">{gateways.filter(g => g.status === 'active').length}</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-1">Inactive Gateways</h3>
          <p className="text-2xl font-bold">{gateways.filter(g => g.status === 'inactive').length}</p>
        </div>
        <div className="bg-purple-500 text-white p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-1">Cryptocurrencies</h3>
          <p className="text-2xl font-bold">{[...new Set(gateways.map(g => g.currency))].length}</p>
        </div>
      </div>
    </div>
  );
}