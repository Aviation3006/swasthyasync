import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'underline' | 'pills';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  variant = 'underline'
}) => {
  if (variant === 'pills') {
    return (
      <div className={`flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 overflow-x-auto no-scrollbar max-w-full ${className}`}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all focus:outline-none ${
                isActive
                  ? 'bg-white text-health-800 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.5 text-xs rounded-full ${
                    isActive
                      ? 'bg-health-100 text-health-800 font-bold'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`border-b border-slate-200 overflow-x-auto no-scrollbar max-w-full ${className}`}>
      <nav className="flex space-x-6 min-w-max" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors focus:outline-none whitespace-nowrap ${
                isActive
                  ? 'border-health-600 text-health-700 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                    isActive
                      ? 'bg-health-100 text-health-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
