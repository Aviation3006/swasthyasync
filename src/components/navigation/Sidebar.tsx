import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/useTranslation';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Calendar, 
  Stethoscope, 
  FileCheck2, 
  QrCode, 
  Bell, 
  Settings, 
  Users, 
  Clock, 
  Pill, 
  BarChart3, 
  Building2, 
  AlertTriangle,
  FileSpreadsheet,
  Star,
  ChevronLeft,
  ChevronRight,
  HeartPulse
} from 'lucide-react';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  onToggleCollapse,
  className = '',
  onNavigate
}) => {
  const { role } = useAuth();
  const { t } = useTranslation();

  const patientNavItems = [
    { label: t.navDashboard, path: '/patient', icon: LayoutDashboard, exact: true },
    { label: t.navProfile, path: '/patient/profile', icon: User },
    { label: t.navRecords, path: '/patient/records', icon: FileText },
    { label: t.navAppointments, path: '/patient/appointments', icon: Calendar },
    { label: t.navSymptoms, path: '/patient/symptoms', icon: Stethoscope },
    { label: t.navReports, path: '/patient/reports', icon: FileCheck2 },
    { label: t.navHealthQR, path: '/patient/health-qr', icon: QrCode },
    { label: t.navNotifications, path: '/patient/notifications', icon: Bell },
    { label: t.navSettings, path: '/patient/settings', icon: Settings },
  ];

  const hospitalNavItems = [
    { label: t.navHospitalCommand, path: '/hospital', icon: LayoutDashboard, exact: true },
    { label: 'CareSetu Record', path: '/hospital/caresetu', icon: QrCode },
    { label: t.navPatientDirectory, path: '/hospital/patients', icon: Users },
    { label: t.navHospitalAppointments, path: '/hospital/appointments', icon: Calendar },
    { label: t.navLiveQueue, path: '/hospital/queue', icon: Clock },
    { label: t.navPrescriptions, path: '/hospital/prescriptions', icon: Pill },
    { label: t.navDiagnosticReports, path: '/hospital/reports', icon: FileCheck2 },
  ];

  const adminNavItems = [
    { label: t.navDistrictCommand, path: '/district-admin', icon: LayoutDashboard, exact: true },
    { label: t.navHospitalNetwork, path: '/district-admin/hospitals', icon: Building2 },
    { label: t.navDistrictAnalytics, path: '/district-admin/analytics', icon: BarChart3 },
    { label: t.navAudit || 'Quality Audit', path: '/district-admin/audit', icon: Star },
    { label: t.navHealthReports, path: '/district-admin/reports', icon: FileSpreadsheet },
    { label: t.navEmergencyAlerts, path: '/district-admin/alerts', icon: AlertTriangle },
  ];

  const navItems = role === 'patient' 
    ? patientNavItems 
    : role === 'hospital' 
    ? hospitalNavItems 
    : adminNavItems;

  return (
    <aside
      className={`h-full flex flex-col bg-slate-900 text-slate-200 border-r border-slate-800 transition-all duration-300 ${
        isCollapsed ? 'w-18' : 'w-64'
      } ${className}`}
    >
      {/* Navigation Section */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          {!isCollapsed && (
            <span>
              {role === 'patient' ? t.portalPatient : role === 'hospital' ? t.portalHospital : t.portalAdmin}
            </span>
          )}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-theme-primary text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                } ${isCollapsed ? 'justify-center px-2' : ''}`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isCollapsed ? '' : ''}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </div>

      {/* Emergency & Support Card (if not collapsed) */}
      {!isCollapsed && (
        <div className="p-3 mx-3 mb-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
          <div className="flex items-center gap-2 text-rose-400 font-semibold mb-1">
            <HeartPulse className="w-4 h-4" />
            <span>Emergency 24x7</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            National Ambulance: <strong className="text-white">108</strong><br />
            Health Info Line: <strong className="text-white">104</strong>
          </p>
        </div>
      )}

      {/* Collapse Toggle Footer */}
      {onToggleCollapse && (
        <div className="p-3 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      )}
    </aside>
  );
};
