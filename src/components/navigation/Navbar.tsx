import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUserLocation } from '../../context/UserLocationContext';
import { useTranslation } from '../../i18n/useTranslation';
import { useTheme } from '../../context/ThemeContext';
import { notificationService } from '../../services/notificationService';
import { NotificationItem } from '../../types/notifications';
import { SUPPORTED_LANGUAGES } from '../../types/common';
import { 
  Activity, 
  Bell, 
  Globe, 
  Menu, 
  X, 
  LogOut, 
  User, 
  PhoneCall, 
  ShieldCheck, 
  QrCode, 
  ChevronDown,
  Check,
  CheckCheck,
  Search
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, role, logout } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Sync notifications
  useEffect(() => {
    if (!user) return;
    const currentNotifs = notificationService.getNotificationsForUser(user.id);
    setNotifications(currentNotifs);

    const unsubscribe = notificationService.subscribe((list) => {
      setNotifications(list.filter((n) => n.recipientId === user.id || n.recipientId === 'all'));
    });
    return unsubscribe;
  }, [user]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    if (user) {
      notificationService.markAllAsRead(user.id);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPortalTitle = () => {
    if (role === 'patient') return t.portalPatient;
    if (role === 'hospital') return t.portalHospital;
    return t.portalAdmin;
  };

  const { getLocationDisplay } = useUserLocation();

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(l => 
    l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  return (
    <header className={`sticky top-0 z-30 ${theme.topbarBg} ${theme.sidebarBorder} text-white shadow-md min-w-0 max-w-full transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-1.5 sm:gap-4 min-w-0">
          
          {/* Left: Hamburger Toggle and Brand */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 shrink">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-1.5 sm:p-2 -ml-1 sm:ml-0 rounded-lg text-white/80 hover:text-white hover:bg-white/15 lg:hidden shrink-0 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Toggle navigation menu"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <Link
              to={role === 'patient' ? '/patient' : role === 'hospital' ? '/hospital' : '/district-admin'}
              className="flex items-center gap-2 sm:gap-2.5 group min-w-0 shrink"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0 backdrop-blur-xs">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-black text-base sm:text-xl text-white tracking-tight shrink-0">
                    Swasthya<span className="text-white/85">Sync</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded bg-white/20 text-white border border-white/30 hidden sm:inline-block shrink-0 shadow-2xs">
                    {theme.role === 'patient' ? (t.portalPatient || 'PATIENT PORTAL') : theme.role === 'hospital' ? (t.portalHospital || 'DOCTOR PORTAL') : (t.portalAdmin || 'DISTRICT ADMIN PORTAL')}
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-white/80 hidden sm:inline truncate max-w-[200px] lg:max-w-none">
                  {getPortalTitle()} • {getLocationDisplay()}
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Actions (CareSetu QR button on tablet/desktop, Language, Notifications, Profile) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Emergency 108 Call Quick Link (Desktop) */}
            <a
              href="tel:108"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-600/80 text-rose-200 text-xs font-bold hover:bg-rose-900 transition-colors shrink-0 shadow-xs"
              title="National Emergency Health Helpline"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>{t.emergency108}</span>
            </a>

            {/* CareSetu Quick Button for Patient (visible on >= sm screens) */}
            {role === 'patient' && (
              <Link
                to="/patient/health-qr"
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shrink-0 ${
                  location.pathname === '/patient/health-qr' || location.pathname === '/patient/caresetu'
                    ? 'bg-white text-[#DB2777] border-white shadow-sm'
                    : 'bg-white/15 border-white/25 text-white hover:bg-white/25'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>CareSetu</span>
              </Link>
            )}

            {/* Scan CareSetu Quick Button for Hospital Staff (visible on >= sm screens) */}
            {role === 'hospital' && (
              <Link
                to="/hospital/caresetu"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-[#1D4ED8] hover:bg-blue-50 shadow-sm transition-all shrink-0"
                title="Scan CareSetu Smart Health Card"
              >
                <QrCode className="w-4 h-4 text-[#1D4ED8]" />
                <span>{t.scanCareSetuBtn || 'Scan CareSetu'}</span>
              </Link>
            )}

            {/* 23 Indian Languages Selector Dropdown */}
            <div className="relative shrink-0" ref={langMenuRef}>
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold bg-black/30 text-white hover:bg-black/40 border border-white/25 transition-colors shrink-0 backdrop-blur-xs"
                aria-label="Select Language (23 Languages)"
              >
                <Globe className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="uppercase font-black text-white text-[11px] sm:text-xs">{language}</span>
                <span className="hidden sm:inline text-white/90 text-[11px]">
                  ({SUPPORTED_LANGUAGES.find(l => l.code === language)?.nativeName || 'English'})
                </span>
                <ChevronDown className="w-3 h-3 text-white/70 shrink-0" />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-xs sm:w-72 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-scale-up">
                  <div className="px-3 pb-2 border-b border-slate-100">
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                      23 Official Indian Languages
                    </span>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search language..."
                        value={langSearch}
                        onChange={(e) => setLangSearch(e.target.value)}
                        className="w-full pl-8 pr-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-theme-ring"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                    {filteredLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-left hover:bg-slate-50 transition-colors ${
                          language === lang.code ? 'text-theme-primary font-bold bg-theme-primary-subtle' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">{lang.nativeName}</span>
                          <span className="text-[10px] text-slate-500">{lang.name} • {lang.region}</span>
                        </div>
                        {language === lang.code && <Check className="w-4 h-4 text-theme-primary flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative shrink-0" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-1.5 sm:p-2 rounded-lg text-white/90 hover:text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white transition-colors shrink-0"
                aria-label={`Notifications (${unreadCount} unread)`}
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-rose-500 text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center ring-2 ring-black/40">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-sm sm:w-96 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-scale-up">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900">{t.notifications}</h4>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-theme-primary-light text-theme-text-accent">
                          {unreadCount} {t.pending}
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-theme-primary hover:text-theme-primary-hover font-medium flex items-center gap-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        {t.markAllRead}
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            notificationService.markAsRead(notif.id);
                            if (notif.actionUrl) {
                              navigate(notif.actionUrl);
                              setIsNotifOpen(false);
                            }
                          }}
                          className={`p-3.5 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                            !notif.isRead ? 'bg-theme-primary-subtle' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-slate-900">{notif.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-1">{notif.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-xs text-slate-500">
                        {t.noNotifications}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <div className="relative shrink-0" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-xl hover:bg-white/15 transition-colors shrink-0"
                aria-label="User account menu"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 border border-white/30 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-white/70 hidden sm:block shrink-0" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 py-1.5 z-50 animate-scale-up">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Citizen'}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-theme-primary-subtle text-theme-text-accent border border-theme-primary-border">
                      {user?.roleTitle || theme.portalBadgeText}
                    </span>
                  </div>

                  <Link
                    to={role === 'patient' ? '/patient/profile' : role === 'hospital' ? '/hospital' : '/district-admin'}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.navProfile}</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-100 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t.signOut}</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
