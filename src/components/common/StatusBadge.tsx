import React from 'react';

export type BadgeVariant = 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'neutral' 
  | 'urgent' 
  | 'purple'
  | 'teal';

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = true,
  className = ''
}) => {
  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    error: 'bg-rose-50 text-rose-700 border-rose-200',
    urgent: 'bg-rose-100 text-rose-800 border-rose-300 font-semibold animate-pulse',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200'
  };

  const dotStyles = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
    urgent: 'bg-rose-600',
    info: 'bg-sky-500',
    neutral: 'bg-slate-400',
    purple: 'bg-purple-500',
    teal: 'bg-teal-500'
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs sm:text-xs'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-subtle ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]}`} />}
      {children}
    </span>
  );
};
