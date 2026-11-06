import React, { useState, useEffect } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';

interface Plan {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  roi: string;
  duration: string;
  features: string[];
  popular?: boolean;
}

export default function InvestmentPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('is_active', true)
        .order('min_amount', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedPlans: Plan[] = data.map((plan, index) => ({
          id: plan.id,
          name: plan.name,
          minAmount: Number(plan.min_amount),
          maxAmount: Number(plan.max_amount),
          roi: `${plan.interest_rate}%`,
          duration: `${plan.duration_days} days`,
          features: Array.isArray(plan.features) ? plan.features : [],
          popular: index === 1
        }));
        setPlans(formattedPlans);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
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

  const handleInvest = (plan: Plan) => {
    alert(`Investment in ${plan.name} initiated! Redirecting to payment...`);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-white text-xl">Loading investment plans...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Investment Plans</h1>
        <p className="text-gray-300 text-lg">Choose the perfect investment plan for your goals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-slate-700 rounded-lg p-6 border-2 transition-all hover:shadow-lg ${
              plan.popular ? 'border-green-500 transform scale-105' : 'border-transparent'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-green-400 mb-1">{plan.roi}</div>
              <p className="text-gray-400">Daily ROI</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-300">
                <span>Min Investment:</span>
                <span className="text-white font-medium">{formatCurrency(plan.minAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Max Investment:</span>
                <span className="text-white font-medium">{formatCurrency(plan.maxAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Duration:</span>
                <span className="text-white font-medium">{plan.duration}</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-white font-medium mb-3">Features:</h4>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleInvest(plan)}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                plan.popular
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-slate-600 hover:bg-slate-500 text-white border border-slate-500'
              }`}
            >
              Invest Now
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Why Choose Our Investment Plans?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-2">🔒</div>
            <h3 className="font-medium text-white mb-2">Secure & Safe</h3>
            <p className="text-gray-400 text-sm">Your investments are protected with bank-level security</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <h3 className="font-medium text-white mb-2">High Returns</h3>
            <p className="text-gray-400 text-sm">Competitive ROI rates with consistent daily payouts</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">⚡</div>
            <h3 className="font-medium text-white mb-2">Instant Withdrawals</h3>
            <p className="text-gray-400 text-sm">Access your profits anytime with instant withdrawal processing</p>
          </div>
        </div>
      </div>
    </div>
  );
}