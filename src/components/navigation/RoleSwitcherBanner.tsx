import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/useTranslation';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut } from 'lucide-react';

export const RoleSwitcherBanner: React.FC = () => {
  const { user, role, logout } = useAuth();
  const { t } = useTranslation();
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
    <aside aria-label="Authenticated environment banner" className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 text-white text-xs border-b border-slate-800 px-3 sm:px-6 py-2">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="flex items-center gap-1.5 font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" /> {t.secureSession}
          </span>
          <span className="text-slate-300 text-xs">
            {t.departmentName} • <strong>{roleLabel}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-[11px] hidden md:inline">
            {t.loggedInAs} <strong className="text-slate-200">{user?.name || user?.email || 'User'}</strong>
          </span>
          <button
            onClick={handleSwitchAccount}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-rose-900/80 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-700 text-[11px] font-medium transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span>{t.switchAccount}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
