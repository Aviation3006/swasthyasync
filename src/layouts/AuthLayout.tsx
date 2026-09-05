import React, { useState, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Activity, ShieldCheck, HeartHandshake, Globe, ChevronDown, Check, Search } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useTheme } from '../context/ThemeContext';
import { SUPPORTED_LANGUAGES } from '../types/common';

export const AuthLayout: React.FC = () => {
  const { language, setLanguage, t } = useTranslation();
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
    <div className="min-h-screen bg-theme-background text-slate-900 flex flex-col justify-between selection:bg-theme-primary selection:text-white max-w-full overflow-x-hidden transition-colors duration-200">
      {/* Top Header with Dynamic Role Solid Background & Hairline Border */}
      <header className={`${theme.topbarBg} border-b ${theme.sidebarBorder} text-white px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 sticky top-0 z-40 w-full shadow-xs transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          
          {/* Left Brand Container */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Logo Icon */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-white/20 border border-white/25 flex items-center justify-center text-white shadow-xs shrink-0">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>

            {/* Brand Title & Badges */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="font-bold text-base sm:text-lg text-white tracking-tight truncate">
                  Swasthya<span className="text-white/80 font-normal">Sync</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/20 text-white border border-white/25 hidden xs:inline-flex items-center shrink-0">
                  {theme.role === 'patient' ? (t.portalPatient || 'PATIENT PORTAL') : theme.role === 'hospital' ? (t.portalHospital || 'DOCTOR PORTAL') : (t.portalAdmin || 'DISTRICT ADMIN PORTAL')}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-white/80 hidden md:block truncate">
                {t.appTagline || "SwasthyaSync • Connected Healthcare Platform"}
              </p>
            </div>
          </div>

          {/* Right Action Container: Verified Badges (Desktop) + Language Selector */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="hidden lg:flex items-center gap-3 text-xs text-white/85">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-white/90 shrink-0" />
                <span>{t.abdmCompliant || "Secure Digital Health Records"}</span>
              </div>
              <div className="h-3.5 w-px bg-white/20" />
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-white/90 shrink-0" />
                <span>{t.empaneledNetwork || "Partner Healthcare Network"}</span>
              </div>
            </div>

            {/* Language Selector Dropdown (23 Indian Languages) */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 min-h-[38px] rounded-md text-xs font-semibold bg-black/20 text-white border border-white/20 hover:bg-black/30 transition-colors shadow-xs shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Select Language (23 Indian Languages)"
              >
                <Globe className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="uppercase font-bold text-white text-[11px] sm:text-xs">{language}</span>
                <span className="hidden sm:inline text-white/90 text-[11px]">
                  ({SUPPORTED_LANGUAGES.find(l => l.code === language)?.nativeName || 'English'})
                </span>
                <ChevronDown className="w-3 h-3 text-white/70 shrink-0" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-xs sm:w-72 bg-white rounded-xl shadow-dropdown border border-slate-200 py-2 z-50 animate-scale-up text-slate-900">
                  <div className="px-3 pb-2 border-b border-slate-100">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      Select Preferred Language (23 Languages)
                    </span>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search language or region..."
                        value={langSearch}
                        onChange={(e) => setLangSearch(e.target.value)}
                        className="w-full pl-8 pr-2 py-1 text-xs bg-white border border-slate-200 text-slate-900 rounded-md focus:outline-none focus:ring-1 focus:ring-theme-ring placeholder:text-slate-400"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-50 mt-1">
                    {filteredLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
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

          </div>
        </div>
      </header>

      {/* Main Content Area with Role Background */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8 min-w-0">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-3 px-3 sm:px-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500 transition-colors">
        <p>
          SwasthyaSync • Connected healthcare for patients, clinics, and care teams
        </p>
      </footer>
    </div>
  );
};
