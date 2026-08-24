import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/useTranslation';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  QrCode, 
  Clock, 
  Pill, 
  Building2, 
  BarChart3, 
  AlertTriangle 
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { role } = useAuth();
  const { t } = useTranslation();

  const patientLinks = [
    { label: t.navDashboard || 'Dashboard', path: '/patient', icon: LayoutDashboard, exact: true },
    { label: t.navRecords || 'Records', path: '/patient/records', icon: FileText },
    { label: t.navAppointments || 'Appointments', path: '/patient/appointments', icon: Calendar },
    { label: 'CareSetu', path: '/patient/caresetu', icon: QrCode },
  ];

  const hospitalLinks = [
    { label: t.navHospitalCommand || 'Command', path: '/hospital', icon: LayoutDashboard, exact: true },
    { label: 'CareSetu', path: '/hospital/caresetu', icon: QrCode },
    { label: t.navLiveQueue || 'Live Queue', path: '/hospital/queue', icon: Clock },
    { label: t.navPrescriptions || 'Prescriptions', path: '/hospital/prescriptions', icon: Pill },
  ];

  const adminLinks = [
    { label: t.navDistrictCommand || 'Command', path: '/district-admin', icon: LayoutDashboard, exact: true },
    { label: t.navHospitalNetwork || 'Hospitals', path: '/district-admin/hospitals', icon: Building2 },
    { label: t.navDistrictAnalytics || 'Analytics', path: '/district-admin/analytics', icon: BarChart3 },
    { label: t.navEmergencyAlerts || 'Alerts', path: '/district-admin/alerts', icon: AlertTriangle },
  ];

  const links = role === 'patient' 
    ? patientLinks 
    : role === 'hospital' 
    ? hospitalLinks 
    : adminLinks;

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-1 py-1 shadow-lg pb-safe"
    >
      <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.exact}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-1 min-h-[48px] rounded-xl text-[10px] font-semibold transition-all select-none ${
                  isActive
                    ? 'text-emerald-800 font-extrabold bg-emerald-50/80 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 active:bg-slate-100'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5 shrink-0" />
              <span className="truncate max-w-[70px] text-center leading-none">{link.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
