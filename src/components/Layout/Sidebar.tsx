import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  BanknotesIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ArrowsRightLeftIcon,
  DocumentCheckIcon,
  ClockIcon,
  DocumentTextIcon,
  UsersIcon,
  ShieldCheckIcon,
  LifebuoyIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { useAuth } from '../../contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Investment',
    icon: ChartBarIcon,
    children: [
      { name: 'Investment plans', href: '/investment-plans' },
      { name: 'Invest log', href: '/invest-log' }
    ]
  },
  {
    name: 'Deposit',
    icon: ArrowDownTrayIcon,
    children: [
      { name: 'Add deposit', href: '/deposit' },
      { name: 'Deposit log', href: '/deposit-log' }
    ]
  },
  {
    name: 'Withdraw',
    icon: ArrowUpTrayIcon,
    children: [
      { name: 'Withdraw', href: '/withdraw' },
      { name: 'Withdraw log', href: '/withdraw-log' }
    ]
  },
  { name: 'Transfer money', href: '/transfer', icon: ArrowsRightLeftIcon },
  { name: 'Money transfer log', href: '/transfer-log', icon: DocumentTextIcon },
  { name: 'Kyc verification', href: '/kyc-verification', icon: DocumentCheckIcon },
  { name: 'Interest log', href: '/interest-log', icon: ClockIcon },
  { name: 'Transaction log', href: '/transaction-log', icon: BanknotesIcon },
  { name: 'Referral log', href: '/referral-log', icon: UsersIcon },
  { name: '2fa', href: '/2fa', icon: ShieldCheckIcon },
  { name: 'Support', href: '/support', icon: LifebuoyIcon },
  { name: 'Notifications', href: '/notifications', icon: BanknotesIcon },
  { name: 'Portfolio', href: '/portfolio', icon: ChartBarIcon },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col w-64 bg-slate-800 min-h-screen">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-8">
          <div className="flex items-center space-x-3">
            <img 
              src="/DOGE LOOG.jpg" 
              alt="DOGE" 
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-xl font-bold text-white">DOGE</h1>
          </div>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <div>
                  <div className="flex items-center px-2 py-2 text-sm font-medium text-gray-300 hover:text-white">
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                    <ChevronRightIcon className="ml-auto h-4 w-4" />
                  </div>
                  <div className="ml-6 space-y-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.name}
                        to={child.href}
                        className={({ isActive }) =>
                          `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                            isActive
                              ? 'bg-slate-900 text-white'
                              : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                          }`
                        }
                      >
                        <ChevronRightIcon className="mr-2 h-3 w-3" />
                        {child.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              )}
            </div>
          ))}
        </nav>
        <div className="mt-auto">
          <button
            onClick={logout}
            className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-slate-700 hover:text-white"
          >
            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}