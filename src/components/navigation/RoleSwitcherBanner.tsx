import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/useTranslation';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut } from 'lucide-react';

export const RoleSwitcherBanner: React.FC = () => {
  const { user, role, logout } = useAuth();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSwitchAccount = async () => {
    await logout();
    navigate('/login');
  };

  const roleLabel = role === 'patient'
    ? t.portalPatient
    : role === 'hospital'
    ? t.portalHospital
    : t.portalAdmin;

  return (
    <aside aria-label="Authenticated environment banner" className={`${theme.topbarBg} text-white text-xs px-2.5 sm:px-6 py-1.5 sm:py-2 min-w-0 max-w-full shadow-xs`}>
      <div className="max-w-7xl mx-auto flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 sm:gap-2 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 overflow-hidden">
          <span className={`flex items-center gap-1 font-bold ${theme.topbarBadge} px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] shrink-0 uppercase tracking-wider`}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{theme.portalBadgeText}</span>
          </span>
          <span className="text-white/90 text-[10px] sm:text-xs truncate">
            {t.departmentName || "Ayushman Bharat Digital Health Mission"} • <strong className="text-white">{roleLabel}</strong>
          </span>
        </div>

        <div className="flex items-center justify-between xs:justify-end gap-2 shrink-0 min-w-0">
          <span className="text-white/80 text-[11px] hidden md:inline truncate max-w-[200px]">
            {t.loggedInAs} <strong className="text-white">{user?.name || user?.email || 'User'}</strong>
          </span>
          <button
            onClick={handleSwitchAccount}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-black/30 hover:bg-rose-900/80 text-white/90 hover:text-white border border-white/20 hover:border-rose-500 text-[10px] sm:text-[11px] font-medium transition-colors shrink-0 backdrop-blur-xs"
          >
            <LogOut className="w-3 h-3" />
            <span>{t.switchAccount}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
