import React from 'react';

export type BadgeVariant = 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'neutral' 
  | 'urgent' 
  | 'purple'
  | 'teal'
  | 'theme';

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
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-900 border-amber-200',
    error: 'bg-rose-50 text-rose-800 border-rose-200',
    urgent: 'bg-rose-100 text-rose-900 border-rose-300 font-semibold',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    purple: 'bg-purple-50 text-purple-800 border-purple-200',
    teal: 'bg-teal-50 text-teal-800 border-teal-200',
    theme: 'bg-theme-primary-subtle text-theme-text-accent border-theme-primary-border'
  };

  const dotStyles = {
    success: 'bg-emerald-600',
    warning: 'bg-amber-600',
    error: 'bg-rose-600',
    urgent: 'bg-rose-600',
    info: 'bg-blue-600',
    neutral: 'bg-slate-400',
    purple: 'bg-purple-600',
    teal: 'bg-teal-600',
    theme: 'bg-theme-primary'
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-micro',
    md: 'px-2.5 py-0.5 text-xs'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-subtle ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles[variant]}`} />}
      {children}
    </span>
  );
};
