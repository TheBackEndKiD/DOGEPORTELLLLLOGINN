import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import MetricCard from '../components/ui/MetricCard';
import {
  BanknotesIcon,
  CurrencyDollarIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChartBarIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalDeposit: number;
  totalWithdraw: number;
  totalInvest: number;
  currentInvest: number;
  profit: number;
  pendingTransactions: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalDeposit: 0,
    totalWithdraw: 0,
    totalInvest: 0,
    currentInvest: 0,
    profit: 0,
    pendingTransactions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardStats();
    }
  }, [user?.id]);

  const fetchDashboardStats = async () => {
    if (!user?.id || !supabase) return;

    try {
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id);

      const { data: investments } = await supabase
        .from('user_investments')
        .select('*')
        .eq('user_id', user.id);

      const deposits = transactions?.filter(t => t.type === 'deposit' && t.status === 'approved') || [];
      const withdraws = transactions?.filter(t => t.type === 'withdraw' && t.status === 'approved') || [];
      const interests = transactions?.filter(t => t.type === 'interest' && t.status === 'approved') || [];
      const pending = transactions?.filter(t => t.status === 'pending') || [];

      const totalDeposit = deposits.reduce((sum, t) => sum + Number(t.amount), 0);
      const totalWithdraw = withdraws.reduce((sum, t) => sum + Number(t.amount), 0);
      const profit = interests.reduce((sum, t) => sum + Number(t.amount), 0);

      const activeInvestments = investments?.filter(i => i.status === 'active') || [];
      const totalInvest = investments?.reduce((sum, i) => sum + Number(i.amount), 0) || 0;
      const currentInvest = activeInvestments.reduce((sum, i) => sum + Number(i.amount), 0);

      setStats({
        totalDeposit,
        totalWithdraw,
        totalInvest,
        currentInvest,
        profit,
        pendingTransactions: pending.length
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      {/* User Info Header */}
      <div className="bg-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">G</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{user?.full_name || user?.username}</h2>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-gray-300">UID: {user?.uid}</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${user?.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`capitalize ${user?.is_active ? 'text-green-400' : 'text-red-400'}`}>
                    {user?.is_active ? 'active' : 'inactive'}
                  </span>
                </div>
              </div>
              <p className="text-gray-300 text-sm mt-1">Account Info</p>
              <p className="text-gray-300">{user?.email}</p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Total Balance</h3>
            <div className="text-4xl font-bold text-white mb-4">
              {formatCurrency(user?.balance || 0)}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/deposit')}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center space-x-2"
              >
                <BanknotesIcon className="h-5 w-5" />
                <span>Deposit</span>
              </button>
              <button
                onClick={() => navigate('/withdraw')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium transition-colors border border-gray-500 flex items-center space-x-2"
              >
                <ArrowUpTrayIcon className="h-5 w-5" />
                <span>Withdraw</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="KYC Status"
          value={user?.kyc_status?.toUpperCase() || 'PENDING'}
          icon={<UserIcon className="h-8 w-8" />}
          bgColor="bg-pink-500"
        />
        <MetricCard
          title="Profit"
          value={loading ? '...' : formatCurrency(user?.profit || 0)}
          icon={<CurrencyDollarIcon className="h-8 w-8" />}
          bgColor="bg-green-600"
        />
        <MetricCard
          title="Withdraws"
          value={loading ? '...' : formatCurrency(user?.total_withdrawn || 0)}
          icon={<ArrowUpTrayIcon className="h-8 w-8" />}
          bgColor="bg-blue-500"
        />
        <MetricCard
          title="Available Balance"
          value={formatCurrency(user?.balance || 0)}
          icon={<BanknotesIcon className="h-8 w-8" />}
          bgColor="bg-cyan-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total withdraw"
          value={loading ? '...' : formatCurrency(user?.total_withdrawn || 0)}
          icon={<ArrowUpTrayIcon className="h-8 w-8" />}
          bgColor="bg-slate-600"
        />
        <MetricCard
          title="Total deposit"
          value={loading ? '...' : formatCurrency(user?.total_deposit || 0)}
          icon={<ArrowDownTrayIcon className="h-8 w-8" />}
          bgColor="bg-green-600"
        />
        <MetricCard
          title="Total invest"
          value={loading ? '...' : formatCurrency(user?.total_invested || 0)}
          icon={<ChartBarIcon className="h-8 w-8" />}
          bgColor="bg-blue-600"
        />
        <MetricCard
          title="Current invest"
          value={loading ? '...' : formatCurrency(stats.currentInvest)}
          icon={<ClockIcon className="h-8 w-8" />}
          bgColor="bg-orange-600"
        />
      </div>
    </div>
  );
}