import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import AdminMetricCard from '../../components/Admin/ui/AdminMetricCard';
import {
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UsersIcon,
  UserIcon,
  ArrowUpTrayIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  deactivatedUsers: number;
  totalInvest: number;
  pendingInvest: number;
  totalInterest: number;
  totalWithdraw: number;
  pendingWithdraw: number;
  withdrawCharge: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    deactivatedUsers: 0,
    totalInvest: 0,
    pendingInvest: 0,
    totalInterest: 0,
    totalWithdraw: 0,
    pendingWithdraw: 0,
    withdrawCharge: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    if (!supabase) return;

    try {
      const [usersResult, investmentsResult, transactionsResult] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('user_investments').select('*'),
        supabase.from('transactions').select('*')
      ]);

      const users = usersResult.data || [];
      const investments = investmentsResult.data || [];
      const transactions = transactionsResult.data || [];

      const activeUsers = users.filter(u => u.is_active).length;
      const deactivatedUsers = users.filter(u => !u.is_active).length;

      const activeInvestments = investments.filter(i => i.status === 'active');
      const totalInvest = activeInvestments.reduce((sum, i) => sum + Number(i.amount), 0);
      const pendingInvest = investments
        .filter(i => i.status === 'active')
        .reduce((sum, i) => sum + Number(i.amount), 0);

      const interests = transactions.filter(t => t.type === 'interest' && t.status === 'approved');
      const totalInterest = interests.reduce((sum, t) => sum + Number(t.amount), 0);

      const withdrawals = transactions.filter(t => t.type === 'withdraw');
      const approvedWithdraws = withdrawals.filter(t => t.status === 'approved');
      const pendingWithdraws = withdrawals.filter(t => t.status === 'pending');

      const totalWithdraw = approvedWithdraws.reduce((sum, t) => sum + Number(t.amount), 0);
      const pendingWithdraw = pendingWithdraws.reduce((sum, t) => sum + Number(t.amount), 0);

      setStats({
        totalUsers: users.length,
        activeUsers,
        deactivatedUsers,
        totalInvest,
        pendingInvest,
        totalInterest,
        totalWithdraw,
        pendingWithdraw,
        withdrawCharge: 0
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAnalytics = () => {
    navigate('/admin/users/signups');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleViewAnalytics}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2"
          >
<ChartBarIcon className="h-5 w-5" />
            <span>View User Analytics</span>
          </button>
        </div>
        <div className="bg-gray-100 p-3 rounded-md">
          <p className="text-sm text-gray-600 mb-2">
            Please set cron url to your server to dispatched return
          </p>
          <div className="flex items-center justify-between">
            <code className="text-sm bg-white px-2 py-1 rounded border text-gray-800">
              curl -s https://firstquantumsystem.pro/return/interest
            </code>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium">
              Set cron url
            </button>
          </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminMetricCard
          title="Total Invest"
          value={loading ? 'Loading...' : formatCurrency(stats.totalInvest)}
          icon={<ChartBarIcon className="h-8 w-8" />}
          bgColor="bg-blue-500"
        />

        <AdminMetricCard
          title="Total pending Invest"
          value={loading ? 'Loading...' : formatCurrency(stats.pendingInvest)}
          icon={<ClockIcon className="h-8 w-8" />}
          bgColor="bg-orange-500"
        />

        <AdminMetricCard
          title="Total Interest amount"
          value={loading ? 'Loading...' : formatCurrency(stats.totalInterest)}
          icon={<CurrencyDollarIcon className="h-8 w-8" />}
          bgColor="bg-green-500"
        />

        <div
          className="cursor-pointer transform hover:scale-105 transition-transform"
          onClick={handleViewAnalytics}
        >
          <AdminMetricCard
            title="Total Users (Click for Analytics)"
            value={loading ? 'Loading...' : stats.totalUsers.toString()}
            icon={<UsersIcon className="h-8 w-8" />}
            bgColor="bg-cyan-600"
          />
        </div>

        <AdminMetricCard
          title="Total active user"
          value={loading ? 'Loading...' : stats.activeUsers.toString()}
          icon={<UserIcon className="h-8 w-8" />}
          bgColor="bg-green-600"
        />

        <AdminMetricCard
          title="Total deactived user"
          value={loading ? 'Loading...' : stats.deactivatedUsers.toString()}
          icon={<UserIcon className="h-8 w-8" />}
          bgColor="bg-red-500"
        />

        <AdminMetricCard
          title="Total withdraw"
          value={loading ? 'Loading...' : formatCurrency(stats.totalWithdraw)}
          icon={<ArrowUpTrayIcon className="h-8 w-8" />}
          bgColor="bg-slate-600"
        />

        <AdminMetricCard
          title="Total pending withdraw"
          value={loading ? 'Loading...' : formatCurrency(stats.pendingWithdraw)}
          icon={<BanknotesIcon className="h-8 w-8" />}
          bgColor="bg-yellow-600"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard
          title="Automatic Gateways"
          value="20"
          icon={<BanknotesIcon className="h-6 w-6" />}
          bgColor="bg-blue-500"
          size="small"
        />
        
        <AdminMetricCard
          title="Withdraw Charge"
          value={loading ? '...' : formatCurrency(stats.withdrawCharge)}
          icon={<CurrencyDollarIcon className="h-6 w-6" />}
          bgColor="bg-slate-500"
          size="small"
        />
        
        <AdminMetricCard
          title="Withdraw Gateways"
          value="3"
          icon={<ArrowUpTrayIcon className="h-6 w-6" />}
          bgColor="bg-blue-500"
          size="small"
        />
        
        <AdminMetricCard
          title="Withdraw Gateways"
          value="3"
          icon={<ArrowUpTrayIcon className="h-6 w-6" />}
          bgColor="bg-blue-500"
          size="small"
        />
      </div>
    </div>
  );
}