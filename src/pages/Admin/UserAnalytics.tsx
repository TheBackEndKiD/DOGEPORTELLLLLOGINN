import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  UsersIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export interface SignupStats {
  total_users: number;
  today_signups: number;
  yesterday_signups: number;
  this_week_signups: number;
  this_month_signups: number;
  growth_rate_7d: number;
}

export interface DailySignup {
  signup_date: string;
  signups: number;
  cumulative_signups: number;
}

export default function UserAnalytics() {
  const [stats, setStats] = useState<SignupStats | null>(null);
  const [dailySignups, setDailySignups] = useState<DailySignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get signup statistics
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_signup_stats');
        
      if (statsError) throw statsError;
      if (statsData && statsData.length > 0) {
        setStats(statsData[0]);
      }

      // Get signup trends based on selected period
      let viewName = 'daily_signups';
      if (selectedPeriod === 'weekly') viewName = 'weekly_signups';
      if (selectedPeriod === 'monthly') viewName = 'monthly_signups';

      const { data: trendsData, error: trendsError } = await supabase
        .from(viewName)
        .select('*')
        .limit(30)
        .order(selectedPeriod === 'daily' ? 'signup_date' : 
               selectedPeriod === 'weekly' ? 'week_start' : 'month_start', 
               { ascending: false });

      if (trendsError) throw trendsError;
      setDailySignups(trendsData || []);

    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error instanceof Error ? error.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const refreshAnalytics = () => {
    fetchAnalytics();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (selectedPeriod === 'daily') {
      return date.toLocaleDateString();
    } else if (selectedPeriod === 'weekly') {
      return `Week of ${date.toLocaleDateString()}`;
    } else {
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600 text-xl">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error Loading Analytics</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refreshAnalytics}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">User Signup Analytics</h1>
            <p className="text-gray-600">Track user registrations and growth trends</p>
          </div>
          <button
            onClick={refreshAnalytics}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2"
          >
            <span>🔄</span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-blue-500 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Users</p>
                <p className="text-2xl font-bold">{stats.total_users.toLocaleString()}</p>
              </div>
              <UsersIcon className="h-8 w-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-green-500 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Today</p>
                <p className="text-2xl font-bold">{stats.today_signups}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-green-200" />
            </div>
          </div>

          <div className="bg-yellow-500 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm mb-1">Yesterday</p>
                <p className="text-2xl font-bold">{stats.yesterday_signups}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-yellow-200" />
            </div>
          </div>

          <div className="bg-purple-500 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">This Week</p>
                <p className="text-2xl font-bold">{stats.this_week_signups}</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-indigo-500 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm mb-1">Growth (7d)</p>
                <p className="text-2xl font-bold">
                  {stats.growth_rate_7d > 0 ? '+' : ''}{stats.growth_rate_7d}%
                </p>
              </div>
              <ArrowTrendingUpIcon className="h-8 w-8 text-indigo-200" />
            </div>
          </div>
        </div>
      )}

      {/* Period Selector */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">View by:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* Signup Trends Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Signups
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  New Signups
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cumulative Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dailySignups.map((signup, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(
                      selectedPeriod === 'daily' ? signup.signup_date :
                      selectedPeriod === 'weekly' ? (signup as any).week_start :
                      (signup as any).month_start
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {signup.signups}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {signup.cumulative_signups}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {dailySignups.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <div>
              <p className="text-gray-500 text-lg font-medium mb-2">No signup data available yet</p>
              <p className="text-gray-400 text-sm">Connect your database to start tracking user registrations</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}