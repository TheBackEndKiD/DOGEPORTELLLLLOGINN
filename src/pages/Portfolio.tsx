import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Copy as CopyIcon, Frown as FrownIcon } from 'lucide-react';

interface Investment {
  id: string;
  plan_name: string;
  amount: number;
  status: string;
  start_date: string;
  end_date: string;
  total_earned: number;
}

export default function Portfolio() {
  const { user } = useAuth();
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPortfolioData();
    }
  }, [user]);

  const fetchPortfolioData = async () => {
    if (!user) return;

    try {
      const { data: investmentData, error: investError } = await supabase
        .from('user_investments')
        .select(`
          *,
          investment_plans(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (investError) throw investError;

      if (investmentData) {
        const formattedInvestments = investmentData.map((inv: any) => ({
          id: inv.id,
          plan_name: inv.investment_plans?.name || 'Unknown Plan',
          amount: Number(inv.amount),
          status: inv.status,
          start_date: inv.start_date,
          end_date: inv.end_date,
          total_earned: Number(inv.total_earned)
        }));
        setInvestments(formattedInvestments);
      }

      const { count } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_id', user.id);

      setReferralCount(count || 0);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const referralLink = `${window.location.origin}/signup?ref=${user?.referral_code || ''}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Portfolio & Referrals</h1>
        <p className="text-gray-300">Manage your crypto assets and referral network</p>
      </div>

      {/* Active Investments */}
      <div className="bg-slate-700 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-600">
          <h2 className="text-lg font-semibold text-white">Active Investments</h2>
        </div>

        {loading ? (
          <div className="px-6 py-8 text-center text-gray-400">
            Loading investments...
          </div>
        ) : investments.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-400">
            No active investments found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Earned</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">End Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-600">
                {investments.map((investment) => (
                  <tr key={investment.id} className="hover:bg-slate-600">
                    <td className="px-6 py-4 text-white">{investment.plan_name}</td>
                    <td className="px-6 py-4 text-white">${investment.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-green-400">${investment.total_earned.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        investment.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {investment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(investment.end_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Referral Section */}
      <div className="bg-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Your Referral Link</h2>
        
        <div className="flex items-center space-x-2 mb-6">
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
            <span>{copiedReferral ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        {/* Referral Stats */}
        <div className="bg-slate-800 rounded-lg p-8 text-center">
          {referralCount === 0 ? (
            <>
              <div className="flex justify-center mb-4">
                <FrownIcon className="h-16 w-16 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No referrals yet</h3>
              <p className="text-gray-400">
                Share your referral link to start earning commissions from referred users.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-3xl font-bold text-white mb-2">{referralCount}</h3>
              <p className="text-gray-400">Total Referrals</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}