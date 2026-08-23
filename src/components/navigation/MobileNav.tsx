import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/useTranslation';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  QrCode, 
  Users, 
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
    { label: t.navDashboard, path: '/patient', icon: LayoutDashboard, exact: true },
    { label: t.navRecords, path: '/patient/records', icon: FileText },
    { label: t.navAppointments, path: '/patient/appointments', icon: Calendar },
    { label: t.healthCardQR, path: '/patient/health-qr', icon: QrCode },
  ];

  const hospitalLinks = [
    { label: t.navHospitalCommand, path: '/hospital', icon: LayoutDashboard, exact: true },
    { label: 'CareSetu', path: '/hospital/caresetu', icon: QrCode },
    { label: t.navLiveQueue, path: '/hospital/queue', icon: Clock },
    { label: t.navPrescriptions, path: '/hospital/prescriptions', icon: Pill },
  ];

  const adminLinks = [
    { label: t.navDistrictCommand, path: '/district-admin', icon: LayoutDashboard, exact: true },
    { label: t.navHospitalNetwork, path: '/district-admin/hospitals', icon: Building2 },
    { label: t.navDistrictAnalytics, path: '/district-admin/analytics', icon: BarChart3 },
    { label: t.navEmergencyAlerts, path: '/district-admin/alerts', icon: AlertTriangle },
  ];

  const links = role === 'patient' 
    ? patientLinks 
    : role === 'hospital' 
    ? hospitalLinks 
    : adminLinks;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 shadow-dropdown safe-area-pb">
      <nav className="flex items-center justify-around">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.exact}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-health-700 font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
