import React from 'react';

export function DashboardCard({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-[#0a0a0b] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200 p-5 ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeader({ icon: Icon, iconSvg, title, description, trailing }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          {Icon && <Icon size={18} className="text-gray-400 dark:text-gray-500" />}
          {iconSvg}
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      {trailing}
    </div>
  );
}
