import React, { useState, useEffect } from 'react';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  color: string;
  price?: number;
  change_24h?: number;
  is_active: boolean;
}

// Default cryptocurrency list with current market data simulation
const defaultCoins: Coin[] = [
  { id: '1', name: 'Bitcoin', symbol: 'BTC', icon: '₿', color: 'text-orange-500', price: 42000, change_24h: 2.5, is_active: true },
  { id: '2', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', color: 'text-blue-500', price: 2800, change_24h: -1.2, is_active: true },
  { id: '3', name: 'Tether', symbol: 'USDT', icon: '₮', color: 'text-green-500', price: 1.00, change_24h: 0.1, is_active: true },
  { id: '4', name: 'BNB', symbol: 'BNB', icon: 'Ⓑ', color: 'text-yellow-500', price: 320, change_24h: 3.8, is_active: true },
  { id: '5', name: 'Shiba Inu', symbol: 'SHIB', icon: '🐕', color: 'text-orange-600', price: 0.000025, change_24h: -5.2, is_active: true },
  { id: '6', name: 'Litecoin', symbol: 'LTC', icon: 'Ł', color: 'text-gray-500', price: 75, change_24h: 1.8, is_active: true },
  { id: '7', name: 'Tron', symbol: 'TRX', icon: '⚡', color: 'text-red-500', price: 0.12, change_24h: 4.2, is_active: true },
  { id: '8', name: 'Bitcoin Cash', symbol: 'BCH', icon: '₿', color: 'text-green-600', price: 280, change_24h: -0.5, is_active: true },
  { id: '9', name: 'USD Coin', symbol: 'USDC', icon: '🔵', color: 'text-blue-600', price: 1.00, change_24h: 0.0, is_active: true },
  { id: '10', name: '1inch', symbol: '1INCH', icon: '1⃣', color: 'text-gray-600', price: 0.45, change_24h: 2.1, is_active: false }
];

export default function CoinsList() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCoin, setEditingCoin] = useState<Coin | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    icon: '',
    color: 'text-blue-500',
    price: '',
    is_active: true
  });

  useEffect(() => {
    // Load coins from localStorage or use defaults
    const savedCoins = localStorage.getItem('coins_list');
    if (savedCoins) {
      try {
        setCoins(JSON.parse(savedCoins));
      } catch (error) {
        setCoins(defaultCoins);
      }
    } else {
      setCoins(defaultCoins);
      localStorage.setItem('coins_list', JSON.stringify(defaultCoins));
    }
    setLoading(false);
  }, []);

  const saveCoins = (newCoins: Coin[]) => {
    localStorage.setItem('coins_list', JSON.stringify(newCoins));
    setCoins(newCoins);
  };

  const handleAddCoin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.symbol) {
      alert('Please fill in all required fields');
      return;
    }

    const newCoin: Coin = {
      id: Date.now().toString(),
      name: formData.name,
      symbol: formData.symbol.toUpperCase(),
      icon: formData.icon || formData.symbol.charAt(0),
      color: formData.color,
      price: formData.price ? Number(formData.price) : undefined,
      change_24h: Math.random() * 10 - 5, // Random change for demo
      is_active: formData.is_active
    };

    const updatedCoins = [...coins, newCoin];
    saveCoins(updatedCoins);

    setShowCreateForm(false);
    setFormData({
      name: '',
      symbol: '',
      icon: '',
      color: 'text-blue-500',
      price: '',
      is_active: true
    });

    alert('Cryptocurrency added successfully!');
  };

  const handleUpdateCoin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingCoin) return;

    const updatedCoins = coins.map(c =>
      c.id === editingCoin.id ? {
        ...c,
        name: formData.name,
        symbol: formData.symbol.toUpperCase(),
        icon: formData.icon || formData.symbol.charAt(0),
        color: formData.color,
        price: formData.price ? Number(formData.price) : c.price,
        is_active: formData.is_active
      } : c
    );

    saveCoins(updatedCoins);
    setEditingCoin(null);
    setShowCreateForm(false);
    setFormData({
      name: '',
      symbol: '',
      icon: '',
      color: 'text-blue-500',
      price: '',
      is_active: true
    });

    alert('Cryptocurrency updated successfully!');
  };

  const handleEdit = (coin: Coin) => {
    setEditingCoin(coin);
    setFormData({
      name: coin.name,
      symbol: coin.symbol,
      icon: coin.icon,
      color: coin.color,
      price: coin.price?.toString() || '',
      is_active: coin.is_active
    });
    setShowCreateForm(true);
  };

  const handleDelete = (coinId: string) => {
    if (!confirm('Are you sure you want to delete this cryptocurrency?')) return;

    const updatedCoins = coins.filter(c => c.id !== coinId);
    saveCoins(updatedCoins);
    alert('Cryptocurrency deleted successfully!');
  };

  const handleToggleStatus = (coinId: string) => {
    const updatedCoins = coins.map(c =>
      c.id === coinId ? { ...c, is_active: !c.is_active } : c
    );
    saveCoins(updatedCoins);
  };

  const colorOptions = [
    'text-orange-500', 'text-blue-500', 'text-green-500', 'text-yellow-500',
    'text-red-500', 'text-purple-500', 'text-pink-500', 'text-gray-500'
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Cryptocurrencies List</h1>
        
        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditingCoin(null);
            setFormData({
              name: '',
              symbol: '',
              icon: '',
              color: 'text-blue-500',
              price: '',
              is_active: true
            });
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add coin</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editingCoin ? 'Edit Cryptocurrency' : 'Add New Cryptocurrency'}
          </h2>
          <form onSubmit={editingCoin ? handleUpdateCoin : handleAddCoin} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cryptocurrency Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Bitcoin, Ethereum"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Symbol
                </label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., BTC, ETH"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon/Emoji
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="₿ or 🔵 or leave empty"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Theme
                </label>
                <select
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {colorOptions.map(color => (
                    <option key={color} value={color}>
                      {color.replace('text-', '').replace('-500', '')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Price (Optional)
                </label>
                <input
                  type="number"
                  step="0.00000001"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active for trading
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingCoin(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                {editingCoin ? 'Update Coin' : 'Add Coin'}
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
                  Symbol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  24h Change
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
                    Loading cryptocurrencies...
                  </td>
                </tr>
              ) : coins.map((coin) => (
                <tr key={coin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-3">
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 ${coin.color}`}>
                        <span className="text-lg font-bold">{coin.icon}</span>
                      </div>
                      <span className="font-medium">{coin.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                    {coin.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {coin.price ? `$${coin.price.toLocaleString()}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {coin.change_24h !== undefined ? (
                      <span className={`font-medium ${coin.change_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {coin.change_24h >= 0 ? '+' : ''}{coin.change_24h.toFixed(2)}%
                      </span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        coin.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {coin.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => handleToggleStatus(coin.id)}
                        className={`px-2 py-1 text-xs rounded ${
                          coin.is_active 
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {coin.is_active ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(coin)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(coin.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Delete
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
          <h3 className="text-sm font-medium mb-1">Total Coins</h3>
          <p className="text-2xl font-bold">{coins.length}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-1">Active Coins</h3>
          <p className="text-2xl font-bold">{coins.filter(c => c.is_active).length}</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-1">Inactive Coins</h3>
          <p className="text-2xl font-bold">{coins.filter(c => !c.is_active).length}</p>
        </div>
        <div className="bg-purple-500 text-white p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-1">Avg. Price</h3>
          <p className="text-2xl font-bold">
            ${coins.filter(c => c.price).reduce((sum, c) => sum + (c.price || 0), 0) / coins.filter(c => c.price).length || 0}
          </p>
        </div>
      </div>
    </div>
  );
}