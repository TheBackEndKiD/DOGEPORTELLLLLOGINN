import React from 'react';

interface AdminMetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  textColor?: string;
  size?: 'normal' | 'small';
}

export default function AdminMetricCard({ 
  title, 
  value, 
  icon, 
  bgColor, 
  textColor = 'text-white',
  size = 'normal'
}: AdminMetricCardProps) {
  if (size === 'small') {
    return (
      <div className={`${bgColor} ${textColor} p-4 rounded-lg shadow-lg flex items-center space-x-3`}>
        <div className="p-2 bg-white bg-opacity-20 rounded-full">
          {icon}
        </div>
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${bgColor} ${textColor} p-6 rounded-lg shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90 mb-2">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="text-white opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );
}