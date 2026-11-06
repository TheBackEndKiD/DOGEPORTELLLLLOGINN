import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { CalendarIcon, UsersIcon, ArrowTrendingUpIcon, ClockIcon } from '@heroicons/react/24/outline';

interface SignupData {
  date: string;
  count: number;
}

interface Stats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export default function UserSignupAnalytics() {
  const [signupData, setSignupData] = useState<SignupData[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, today: 0, thisWeek: 0, thisMonth: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days'>('30days');

  useEffect(() => {
    fetchSignupData();
  }, [timeRange]);

  const fetchSignupData = async () => {
    try {
      setLoading(true);
      setError(null);

      const daysAgo = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

      if (usersError) throw usersError;

      const signupMap = new Map<string, number>();
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 7);
      const monthStart = new Date(now);
      monthStart.setDate(now.getDate() - 30);

      let todayCount = 0;
      let weekCount = 0;
      let monthCount = 0;

      users.users.forEach(user => {
        const createdAt = new Date(user.created_at);
        const dateKey = createdAt.toISOString().split('T')[0];

        if (createdAt >= startDate) {
          signupMap.set(dateKey, (signupMap.get(dateKey) || 0) + 1);
        }

        if (createdAt >= todayStart) todayCount++;
        if (createdAt >= weekStart) weekCount++;
        if (createdAt >= monthStart) monthCount++;
      });

      const sortedData = Array.from(signupMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setSignupData(sortedData);
      setStats({
        total: users.users.length,
        today: todayCount,
        thisWeek: weekCount,
        thisMonth: monthCount
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch signup data');
    } finally {
      setLoading(false);
    }
  };

  const maxCount = Math.max(...signupData.map(d => d.count), 1);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">User Sign-up Analytics</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('7days')}
            className={`px-4 py-2 rounded-md font-medium ${
              timeRange === '7days'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('30days')}
            className={`px-4 py-2 rounded-md font-medium ${
              timeRange === '30days'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange('90days')}
            className={`px-4 py-2 rounded-md font-medium ${
              timeRange === '90days'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            90 Days
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <UsersIcon className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Today</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stats.today}</p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <CalendarIcon className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">This Week</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stats.thisWeek}</p>
                </div>
                <div className="bg-orange-100 rounded-full p-3">
                  <ClockIcon className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">This Month</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stats.thisMonth}</p>
                </div>
                <div className="bg-pink-100 rounded-full p-3">
                  <ArrowTrendingUpIcon className="h-8 w-8 text-pink-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Sign-ups Over Time</h2>

            {signupData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No sign-up data available for the selected time range
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <div className="min-w-full" style={{ minHeight: '300px' }}>
                    <div className="flex items-end justify-between h-64 space-x-2">
                      {signupData.map((item, index) => {
                        const heightPercentage = (item.count / maxCount) * 100;
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="w-full flex flex-col items-center">
                              <span className="text-xs font-medium text-gray-700 mb-1">
                                {item.count}
                              </span>
                              <div
                                className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-all cursor-pointer"
                                style={{ height: `${Math.max(heightPercentage, 5)}%` }}
                                title={`${item.date}: ${item.count} sign-ups`}
                              />
                            </div>
                            <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left whitespace-nowrap">
                              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sign-ups
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Day of Week
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {signupData.slice().reverse().map((item, index) => {
                          const date = new Date(item.date);
                          return (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {date.toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {item.count}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {date.toLocaleDateString('en-US', { weekday: 'long' })}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
