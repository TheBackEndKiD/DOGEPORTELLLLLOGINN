import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  PlusIcon,
  ChartBarIcon,
  HomeIcon,
  ArrowUpTrayIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Add funds', href: '/deposit', icon: PlusIcon },
  { name: 'Plans', href: '/investment-plans', icon: ChartBarIcon },
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Withdraw', href: '/withdraw', icon: ArrowUpTrayIcon },
];

export default function BottomNav() {
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 lg:hidden">
        <div className="grid grid-cols-4 py-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-1 text-xs ${
                  isActive ? 'text-green-500' : 'text-gray-400'
                }`
              }
            >
              <item.icon className="h-6 w-6 mb-1" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
      
      {/* Chat Widget */}
      <div className="fixed bottom-20 right-4 lg:bottom-4">
        <button className="bg-green-500 text-white p-3 rounded-lg shadow-lg hover:bg-green-600 transition-colors">
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        </button>
      </div>
    </>
  );
}