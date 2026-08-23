import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-card space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse" />
          <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-slate-200 rounded animate-pulse" />
        <div className="h-3 bg-slate-200 rounded w-5/6 animate-pulse" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-card">
      <div className="h-12 bg-slate-100 border-b border-slate-200 animate-pulse" />
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center space-x-4">
            <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};
