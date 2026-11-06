import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  // Mock user data
  const user = {
    id: userId,
    name: 'Gareld Gabriel',
    email: 'gareldiavelle@yahoo.com',
    phone: '8165292919',
    address: '',
    city: 'Kansas City',
    state: 'Missouri',
    zip: '64118-1020',
    country: 'Afghanistan',
    currency: 'Current $ Change Currency',
    accountLevel: 'STARTER',
    billingMessage: '',
    transferCode: '',
    currentTransferCode: '',
    emailVerified: false,
    smsVerified: false,
    kycVerified: false,
    status: true,
    totalBalance: 23130000.00,
    totalReferral: 0,
    totalReturnInterest: 0.00,
    totalCommission: 0.00,
    totalWithdraw: 0.00,
    totalDeposit: 0.00,
    totalInvestAmount: 0.00,
    totalTicket: 0,
    chosenAccountType: '',
    chosenCurrency: '$'
  };

  const handleSendEmail = () => {
    alert('Email sent successfully!');
    setShowEmailModal(false);
    setEmailSubject('');
    setEmailMessage('');
  };

  const handleUserAction = (action: string) => {
    switch (action) {
      case 'login':
        alert('Logging in as user...');
        break;
      case 'commission':
        navigate(`/admin/users/${userId}/commission`);
        break;
      case 'interest':
        navigate(`/admin/users/${userId}/interest`);
        break;
      case 'deposit':
        navigate(`/admin/users/${userId}/deposits`);
        break;
      case 'investment':
        navigate(`/admin/users/${userId}/investments`);
        break;
      case 'withdraw':
        navigate(`/admin/users/${userId}/withdraws`);
        break;
      case 'tickets':
        navigate(`/admin/users/${userId}/tickets`);
        break;
      case 'transactions':
        navigate(`/admin/users/${userId}/transactions`);
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this user?')) {
          alert('User deleted!');
          navigate('/admin/users');
        }
        break;
      default:
        break;
    }
  };

  const handleUpdateUser = () => {
    alert('User updated successfully!');
  };

  const handleAddBalance = () => {
    alert('Add balance functionality');
  };

  const handleSubtractBalance = () => {
    alert('Subtract balance functionality');
  };

  const renderOverview = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <button
          onClick={() => setShowEmailModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2"
        >
          <span>📧</span>
          <span>Send Email</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => handleUserAction('login')}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium text-sm"
        >
          🔐 Login As User
        </button>
        <button
          onClick={() => handleUserAction('commission')}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium text-sm"
        >
          📊 Commission Log
        </button>
        <button
          onClick={() => handleUserAction('interest')}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium text-sm"
        >
          📈 Interest Log
        </button>
        <button
          onClick={() => handleUserAction('deposit')}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium text-sm"
        >
          💰 Deposit Log
        </button>
        <button
          onClick={() => handleUserAction('investment')}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium text-sm"
        >
          📋 Investment Log
        </button>
        <button
          onClick={() => handleUserAction('withdraw')}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium text-sm"
        >
          💸 Withdraw Log
        </button>
        <button
          onClick={() => handleUserAction('tickets')}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium text-sm"
        >
          🎫 User Ticket
        </button>
        <button
          onClick={() => handleUserAction('transactions')}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium text-sm"
        >
          📝 User Transactions
        </button>
        <button
          onClick={() => handleUserAction('delete')}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md font-medium text-sm"
        >
          🗑️ Delete User
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-teal-500 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Chosen Account Type</p>
              <p className="text-lg font-bold">{user.chosenAccountType || 'Not Set'}</p>
            </div>
            <div className="text-2xl">📋</div>
          </div>
        </div>

        <div className="bg-teal-500 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Chosen Currency</p>
              <p className="text-lg font-bold">{user.chosenCurrency}</p>
            </div>
            <div className="text-2xl">💱</div>
          </div>
        </div>

        <div className="bg-teal-500 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Balance</p>
              <p className="text-lg font-bold">{user.totalBalance.toLocaleString()}.00$</p>
            </div>
            <div className="text-2xl">💰</div>
          </div>
        </div>

        <div className="bg-blue-500 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Referral</p>
              <p className="text-lg font-bold">{user.totalReferral}</p>
            </div>
            <div className="text-2xl">🔗</div>
          </div>
        </div>

        <div className="bg-teal-500 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Return Interest</p>
              <p className="text-lg font-bold">{user.totalReturnInterest.toFixed(2)}$</p>
            </div>
            <div className="text-2xl">🔄</div>
          </div>
        </div>

        <div className="bg-blue-500 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Commission</p>
              <p className="text-lg font-bold">{user.totalCommission.toFixed(2)}$</p>
            </div>
            <div className="text-2xl">💼</div>
          </div>
        </div>

        <div className="bg-blue-500 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Withdraw</p>
              <p className="text-lg font-bold">{user.totalWithdraw.toFixed(2)}$</p>
            </div>
            <div className="text-2xl">💸</div>
          </div>
        </div>

        <div className="bg-teal-500 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Deposit</p>
              <p className="text-lg font-bold">{user.totalDeposit.toFixed(2)} $</p>
            </div>
            <div className="text-2xl">💵</div>
          </div>
        </div>

        <div className="bg-teal-500 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Invest Amount</p>
              <p className="text-lg font-bold">{user.totalInvestAmount.toFixed(2)}$</p>
            </div>
            <div className="text-2xl">📊</div>
          </div>
        </div>

        <div className="bg-gray-700 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Ticket</p>
              <p className="text-lg font-bold">{user.totalTicket}</p>
            </div>
            <div className="text-2xl">🎫</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-blue-600">Investment Chart</h3>
          <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Investment chart visualization</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4 text-blue-600">Withdraw Chart</h3>
          <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Withdraw chart visualization</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(); }} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="Gareld"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="Gabriel"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="8165292919"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="Afghanistan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Change account currency $</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="current">Current $ Change Currency</option>
              <option value="usd">USD - US Dollar</option>
              <option value="eur">EUR - Euro</option>
              <option value="gbp">GBP - British Pound</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="Kansas City"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Zip</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="64118-1020"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="Missouri"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transfer code</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={user.transferCode}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current transfer code</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={user.currentTransferCode}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Billing/account message</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              defaultValue={user.billingMessage}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account level</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={user.accountLevel}
            />
          </div>
        </div>

        {/* Toggle Switches */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Email verified</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={user.emailVerified} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              <span className="ml-3 text-sm text-gray-700">Active/Deactive</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Sms verified</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={user.smsVerified} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              <span className="ml-3 text-sm text-gray-700">Active/Deactive</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Kyc verified</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={user.kycVerified} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              <span className="ml-3 text-sm text-gray-700">Active/Deactive</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={user.status} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              <span className="ml-3 text-sm text-gray-700">Active/Deactive</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md font-medium"
        >
          Update User
        </button>
      </form>
    </div>
  );

  const renderBalance = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Balance To Fund</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4">
            <option>Total Balance 23,130,000.00 $</option>
            <option>Choose Balance</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">add Balance</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
              />
              <button
                onClick={handleAddBalance}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-1"
              >
                <span>+</span>
                <span>Add balance</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtract Balance</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
              />
              <button
                onClick={handleSubtractBalance}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-1"
              >
                <span>-</span>
                <span>Subtract balance</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReferral = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😞</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No reference user found</h3>
      </div>
    </div>
  );

  const renderCurrency = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😞</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No reference user found</h3>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/users')}
          className="text-blue-500 hover:text-blue-600 mb-4 flex items-center space-x-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Users</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveTab('balance')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'balance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Balance
          </button>
          <button
            onClick={() => setActiveTab('referral')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'referral'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Referral
          </button>
          <button
            onClick={() => setActiveTab('currency')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'currency'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Currency
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'settings' && renderSettings()}
      {activeTab === 'balance' && renderBalance()}
      {activeTab === 'referral' && renderReferral()}
      {activeTab === 'currency' && renderCurrency()}

      {/* Send Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Send Mail To User</h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <div className="border border-gray-300 rounded-md">
                  {/* Rich Text Editor Toolbar */}
                  <div className="border-b border-gray-300 p-2 flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-100 rounded">🖋️</button>
                    <button className="p-1 hover:bg-gray-100 rounded font-bold">B</button>
                    <button className="p-1 hover:bg-gray-100 rounded italic">I</button>
                    <button className="p-1 hover:bg-gray-100 rounded underline">U</button>
                    <button className="p-1 hover:bg-gray-100 rounded">🔗</button>
                    <select className="text-sm border rounded px-2 py-1">
                      <option>Poppins</option>
                    </select>
                    <button className="p-1 hover:bg-gray-100 rounded">⚠️</button>
                    <button className="p-1 hover:bg-gray-100 rounded">📋</button>
                    <button className="p-1 hover:bg-gray-100 rounded">📝</button>
                    <button className="p-1 hover:bg-gray-100 rounded">🔗</button>
                    <button className="p-1 hover:bg-gray-100 rounded">📷</button>
                    <button className="p-1 hover:bg-gray-100 rounded">📁</button>
                  </div>
                  <textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    className="w-full p-3 border-0 focus:outline-none resize-none"
                    rows={8}
                    placeholder="Type your message here..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
                <button
                  onClick={handleSendEmail}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium"
                >
                  Send mail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}