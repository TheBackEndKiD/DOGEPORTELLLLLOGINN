import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UserIcon,
  UsersIcon,
  DocumentCheckIcon,
  BanknotesIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  CogIcon,
  TicketIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  LanguageIcon,
  PaintBrushIcon,
  DocumentTextIcon,
  ChartPieIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Change password', href: '/admin/profile', icon: UserIcon },
  {
    name: 'USER MANAGEMENT',
    icon: UsersIcon,
    children: [
      { name: 'Manage users', href: '/admin/users' },
      { name: 'Active users', href: '/admin/users/active' },
      { name: 'Deactive users', href: '/admin/users/deactive' },
      { name: 'User analytics', href: '/admin/users/analytics' },
      { name: 'Sign-up analytics', href: '/admin/users/signups' },
      { name: 'Kyc setting', href: '/admin/kyc/setting' },
      { name: 'Kyc request', href: '/admin/kyc/requests' }
    ]
  },
  {
    name: 'DEPOSIT AND WITHDRAWAL',
    icon: BanknotesIcon,
    children: [
      { name: 'Deposit log', href: '/admin/deposit/log' },
      { name: 'Direct invest', href: '/admin/manual/payments' },
      { name: 'All payments', href: '/admin/payments/all' },
      { name: 'Pending payments', href: '/admin/payments/pending' },
      { name: 'Accepted payments', href: '/admin/payments/accepted' },
      { name: 'Rejected payments', href: '/admin/payments/rejected' }
    ]
  },
  {
    name: 'Manage withdraw',
    icon: ArrowUpTrayIcon,
    children: [
      { name: 'Withdraw method', href: '/admin/withdraw/method' },
      { name: 'Pending withdraws', href: '/admin/withdraw/pending' },
      { name: 'Accepted withdraws', href: '/admin/withdraw/accepted' },
      { name: 'Rejected withdraws', href: '/admin/withdraw/rejected' }
    ]
  },
  {
    name: 'LOGS',
    icon: ClockIcon,
    children: [
      { name: 'User interest log', href: '/admin/interest/log' },
      { name: 'Commission log', href: '/admin/commission/log' }
    ]
  },
  {
    name: 'ADMINISTRATION',
    icon: ShieldCheckIcon,
    children: [
      { name: 'Manage role', href: '/admin/roles' },
      { name: 'Manage admins', href: '/admin/admins' }
    ]
  },
  {
    name: 'MANAGE PLAN',
    icon: ChartBarIcon,
    children: [
      { name: 'Manage plan', href: '/admin/plans' },
      { name: 'Schedule', href: '/admin/schedule' }
    ]
  },
  {
    name: 'Ticket',
    icon: TicketIcon,
    children: [
      { name: 'All tickets', href: '/admin/tickets/all' },
      { name: 'Pending ticket', href: '/admin/tickets/pending' },
      { name: 'Manage referral', href: '/admin/referral' }
    ]
  },
  {
    name: 'Payment settings',
    icon: CurrencyDollarIcon,
    children: [
      { name: 'Change wallet address', href: '/admin/gateway' },
      { name: 'Flutterwave', href: '/admin/gateway/flutterwave' },
      { name: 'Paystack', href: '/admin/gateway/paystack' },
      { name: 'Bank payment', href: '/admin/gateway/bank' },
      { name: 'Coins list', href: '/admin/coins' }
    ]
  },
  {
    name: 'Email manager',
    icon: EnvelopeIcon,
    children: [
      { name: 'Email configure', href: '/admin/email/config' },
      { name: 'Email templates', href: '/admin/email/templates' }
    ]
  },
  {
    name: 'General settings',
    icon: CogIcon,
    children: [
      { name: 'General settings', href: '/admin/settings/general' },
      { name: 'Preloader setting', href: '/admin/settings/preloader' },
      { name: 'Google analytics', href: '/admin/settings/analytics' },
      { name: 'Cookie consent', href: '/admin/settings/cookie' },
      { name: 'Google recaptcha', href: '/admin/settings/recaptcha' },
      { name: 'Live chat setting', href: '/admin/settings/chat' },
      { name: 'Global seo manager', href: '/admin/settings/seo' },
      { name: 'Cache clear', href: '/admin/cache/clear' }
    ]
  },
  {
    name: 'Manage language',
    icon: LanguageIcon,
    children: [
      { name: 'Manage language', href: '/admin/language' },
      { name: 'Manage theme', href: '/admin/theme' }
    ]
  },
  {
    name: 'OTHERS',
    icon: DocumentTextIcon,
    children: [
      { name: 'Frontend', href: '/admin/frontend' },
      { name: 'Pages', href: '/admin/pages' },
      { name: 'Newsletter subscriber', href: '/admin/subscribers' }
    ]
  },
  {
    name: 'Report',
    icon: ChartPieIcon,
    children: [
      { name: 'Payment reports', href: '/admin/reports/payment' },
      { name: 'Withdraw reports', href: '/admin/reports/withdraw' },
      { name: 'Manage transaction', href: '/admin/reports/transaction' }
    ]
  },
  { name: 'Update system', href: '/admin/system/update', icon: ArrowUpTrayIcon }
];

export default function AdminSidebar() {
  const { logout } = useAdminAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName) 
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    );
  };

  return (
    <div className={`flex flex-col bg-slate-800 min-h-screen transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4">
        <div className={`flex items-center space-x-2 ${isCollapsed ? 'hidden' : ''}`}>
          <img 
            src="/DOGE LOOG.jpg" 
            alt="DOGE" 
            className="w-8 h-8 object-contain"
          />
          <h1 className="font-bold text-white text-lg">DOGE</h1>
        </div>
        {isCollapsed && (
          <img 
            src="/DOGE LOOG.jpg" 
            alt="DOGE" 
            className="w-8 h-8 object-contain mx-auto"
          />
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-white"
        >
          <Bars3Icon className="h-5 w-5" />
        </button>
      </div>
      
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleSection(item.name)}
                  className={`w-full flex items-center px-2 py-2 text-sm font-medium text-gray-300 hover:bg-slate-700 hover:text-white rounded-md ${
                    isCollapsed ? 'justify-center' : 'justify-between'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 mr-3" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </div>
                  {!isCollapsed && (
                    expandedSections.includes(item.name) ? 
                      <ChevronDownIcon className="h-4 w-4" /> : 
                      <ChevronRightIcon className="h-4 w-4" />
                  )}
                </button>
                {!isCollapsed && expandedSections.includes(item.name) && (
                  <div className="ml-6 space-y-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.name}
                        to={child.href}
                        className={({ isActive }) =>
                          `block px-2 py-1 text-sm rounded-md ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                          }`
                        }
                      >
                        {child.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            )}
          </div>
        ))}
      </nav>
      
      <div className="p-2">
        <button
          onClick={logout}
          className={`w-full flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-slate-700 hover:text-white ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}