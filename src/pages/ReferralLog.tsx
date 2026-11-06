import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Copy as CopyIcon, Users as UsersIcon } from 'lucide-react';

interface ReferralData {
  id: string;
  referred_username: string;
  referred_email: string;
  commission_amount: number;
  commission_paid: boolean;
  created_at: string;
}

export default function ReferralLog() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalCommission: 0,
    thisMonth: 0
  });
  const [loading, setLoading] = useState(true);

  const referralLink = `${window.location.origin}/signup?ref=${user?.referral_code || ''}`;

  useEffect(() => {
    if (user) {
      fetchReferralData();
    }
  }, [user]);

  const fetchReferralData = async () => {
    if (!user) return;

    try {
      const { data: referralData, error } = await supabase
        .from('referrals')
        .select(`
          *,
          profiles!referrals_referred_id_fkey(username, email, is_active)
        `)
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (referralData) {
        const formattedReferrals = referralData.map((ref: any) => ({
          id: ref.id,
          referred_username: ref.profiles?.username || 'Unknown',
          referred_email: ref.profiles?.email || 'N/A',
          commission_amount: Number(ref.commission_amount),
          commission_paid: ref.commission_paid,
          created_at: ref.created_at
        }));

        setReferrals(formattedReferrals);

        const total = referralData.length;
        const active = referralData.filter((r: any) => r.profiles?.is_active).length;
        const totalCommission = referralData.reduce((sum: number, r: any) =>
          sum + Number(r.commission_amount), 0
        );

        const thisMonthStart = new Date();
        thisMonthStart.setDate(1);
        thisMonthStart.setHours(0, 0, 0, 0);

        const thisMonth = referralData
          .filter((r: any) => new Date(r.created_at) >= thisMonthStart)
          .reduce((sum: number, r: any) => sum + Number(r.commission_amount), 0);

        setStats({ total, active, totalCommission, thisMonth });
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied to clipboard!');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Referral Program</h1>
        <p className="text-gray-300">Earn commissions by referring new users to DOGE</p>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-500 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Referrals</p>
              <p className="text-2xl font-bold">{loading ? '...' : stats.total}</p>
            </div>
            <UsersIcon className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-green-500 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Active Referrals</p>
              <p className="text-2xl font-bold">{loading ? '...' : stats.active}</p>
            </div>
            <UsersIcon className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-purple-500 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Total Commission</p>
              <p className="text-2xl font-bold">${loading ? '...' : stats.totalCommission.toFixed(2)}</p>
            </div>
            <CopyIcon className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-yellow-500 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm mb-1">This Month</p>
              <p className="text-2xl font-bold">${loading ? '...' : stats.thisMonth.toFixed(2)}</p>
            </div>
            <CopyIcon className="h-8 w-8 text-yellow-200" />
          </div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Your Referral Link</h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 bg-slate-600 text-white px-3 py-2 rounded-md border border-slate-500 focus:outline-none"
          />
          <button
            onClick={copyReferralLink}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2"
          >
            <CopyIcon className="h-4 w-4" />
            <span>Copy</span>
          </button>
        </div>
      </div>

      {/* Commission Structure */}
      <div className="bg-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Commission Structure</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-600 rounded-lg">
            <div className="text-2xl font-bold text-green-400 mb-2">10%</div>
            <p className="text-gray-300">Level 1 Commission</p>
            <p className="text-sm text-gray-400">Direct referrals</p>
          </div>
          <div className="text-center p-4 bg-slate-600 rounded-lg">
            <div className="text-2xl font-bold text-blue-400 mb-2">5%</div>
            <p className="text-gray-300">Level 2 Commission</p>
            <p className="text-sm text-gray-400">2nd level referrals</p>
          </div>
          <div className="text-center p-4 bg-slate-600 rounded-lg">
            <div className="text-2xl font-bold text-purple-400 mb-2">2%</div>
            <p className="text-gray-300">Level 3 Commission</p>
            <p className="text-sm text-gray-400">3rd level referrals</p>
          </div>
        </div>
      </div>

      {/* Referrals List */}
      <div className="bg-slate-700 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-600">
          <h2 className="text-lg font-semibold text-white">Your Referrals</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">
            Loading referrals...
          </div>
        ) : referrals.length === 0 ? (
          <div className="p-8 text-center">
            <UsersIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No referrals yet</h3>
            <p className="text-gray-400">
              Share your referral link to start earning commissions
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Commission</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-600">
                {referrals.map((referral) => (
                  <tr key={referral.id} className="hover:bg-slate-600">
                    <td className="px-6 py-4 text-white">{referral.referred_username}</td>
                    <td className="px-6 py-4 text-gray-300">{referral.referred_email}</td>
                    <td className="px-6 py-4 text-green-400">${referral.commission_amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        referral.commission_paid
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {referral.commission_paid ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}