import React from 'react';

export function DashboardCard({ children, className = '' }) {
  return (
    <div
      className={`bg-white dark:bg-[#0a0a0b] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm hover:shadow-lg transition-all duration-300 p-5 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHeader({ icon: Icon, iconSvg, title, description, trailing }) {
  return (
    <div className="flex items-start justify-between mb-4 sm:mb-5">
      <div className="min-w-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 leading-tight">
          {Icon && <Icon size={18} className="text-gray-400 dark:text-gray-500 shrink-0" />}
          {iconSvg && <span className="shrink-0">{iconSvg}</span>}
          <span className="truncate">{title}</span>
        </h3>
        {description && (
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 leading-snug">
            {description}
          </p>
        )}
      </div>
      {trailing && <div className="shrink-0 ml-3">{trailing}</div>}
    </div>
  );
}
