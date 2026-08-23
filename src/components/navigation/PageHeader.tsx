import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '../../types/common';

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  badge?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  badge
}) => {
  return (
    <div className="mb-6 space-y-2">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-slate-800 transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              {crumb.path ? (
                <Link to={crumb.path} className="hover:text-slate-800 transition-colors font-medium">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-700 font-semibold truncate">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && <p className="text-sm text-slate-500 mt-1 max-w-3xl">{subtitle}</p>}
        </div>

        {actions && <div className="flex items-center gap-2.5 flex-shrink-0 flex-wrap">{actions}</div>}
      </div>
    </div>
  );
};
