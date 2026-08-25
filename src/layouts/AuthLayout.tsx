import React, { useState, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Activity, ShieldCheck, HeartHandshake, Globe, ChevronDown, Check, Search } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useTheme } from '../context/ThemeContext';
import { SUPPORTED_LANGUAGES } from '../types/common';

export const AuthLayout: React.FC = () => {
  const { language, setLanguage } = useTranslation();
  const { theme } = useTheme();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(l => 
    l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-theme-background text-slate-900 flex flex-col justify-between selection:bg-theme-primary selection:text-white max-w-full overflow-x-hidden transition-colors duration-300">
      {/* Top Header with Dynamic Role Gradient Banner */}
      <header className={`${theme.sidebarBg} border-b ${theme.sidebarBorder} text-white px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 sticky top-0 z-40 w-full shadow-md transition-all duration-300`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          
          {/* Left Brand Container */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Logo Icon */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white shadow-sm shrink-0 backdrop-blur-xs">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>

            {/* Brand Title & Badges */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="font-black text-lg sm:text-xl text-white tracking-tight truncate">
                  Swasthya<span className="text-white/85">Sync</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 text-white border border-white/30 hidden xs:inline-flex items-center shrink-0 shadow-2xs">
                  {theme.portalBadgeText}
                </span>
              </div>
              <p className="text-[11px] text-white/80 hidden md:block truncate">
                Ayushman Bharat Digital Health Platform • Unified Health Locker
              </p>
            </div>
          </div>

          {/* Right Action Container: Verified Badges (Desktop) + Language Selector */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="hidden lg:flex items-center gap-4 text-xs text-white/80">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                <span>ABDM Compliant</span>
              </div>
              <div className="h-4 w-px bg-white/20" />
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-white shrink-0" />
                <span>Empaneled Network</span>
              </div>
            </div>

            {/* Language Selector Dropdown (23 Indian Languages) */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 min-h-[38px] rounded-xl text-xs font-bold bg-black/30 text-white border border-white/25 hover:bg-black/40 hover:border-white/40 transition-all shadow-sm shrink-0 backdrop-blur-xs"
                aria-label="Select Language (23 Indian Languages)"
              >
                <Globe className="w-4 h-4 text-white shrink-0" />
                <span className="uppercase font-black text-white">{language}</span>
                <span className="hidden sm:inline text-white/90 text-[11px]">
                  ({SUPPORTED_LANGUAGES.find(l => l.code === language)?.nativeName || 'English'})
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-white/70 shrink-0" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-xs sm:w-72 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 py-2.5 z-50 animate-scale-up text-white">
                  <div className="px-3 pb-2 border-b border-slate-700">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                      Select Preferred Language (23 Languages)
                    </span>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search language or region..."
                        value={langSearch}
                        onChange={(e) => setLangSearch(e.target.value)}
                        className="w-full pl-8 pr-2 py-1.5 text-xs bg-slate-950 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-white placeholder:text-slate-500"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-800 mt-1">
                    {filteredLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-left hover:bg-slate-800 transition-colors ${
                          language === lang.code ? 'text-white font-bold bg-white/15' : 'text-slate-300'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{lang.nativeName}</span>
                          <span className="text-[10px] text-slate-400">{lang.name} • {lang.region}</span>
                        </div>
                        {language === lang.code && <Check className="w-4 h-4 text-white flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area with Role Background */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8 min-w-0">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-4 px-3 sm:px-6 border-t border-slate-200/80 bg-white/70 backdrop-blur-xs text-center text-xs text-slate-600 transition-colors">
        <p>
          SwasthyaSync • National Health Authority & Ministry of Health and Family Welfare Compliant
        </p>
      </footer>
    </div>
  );
};
