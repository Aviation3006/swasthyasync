import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  padded?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  padded = true,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-card transition-all max-w-full min-w-0 ${
        hoverEffect ? 'hover:shadow-elevated hover:border-slate-300' : ''
      } ${padded ? 'p-3.5 sm:p-5 sm:p-6' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, icon, className = '' }) => {
  return (
    <div className={`flex flex-col xs:flex-row xs:items-center justify-between gap-2.5 pb-3.5 sm:pb-4 border-b border-slate-100 min-w-0 ${className}`}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-theme-primary-subtle text-theme-primary flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug break-words">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5 break-words">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0 self-start xs:self-auto min-w-0">{action}</div>}
    </div>
  );
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return <div className={`pt-4 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`pt-3.5 sm:pt-4 mt-3.5 sm:mt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 ${className}`}>
      {children}
    </div>
  );
};
