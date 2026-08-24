import React, { useState, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Activity, ShieldCheck, HeartHandshake, Globe, ChevronDown, Check, Search } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { SUPPORTED_LANGUAGES } from '../types/common';

export const AuthLayout: React.FC = () => {
  const { language, setLanguage } = useTranslation();
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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-health-600 selection:text-white max-w-full overflow-x-hidden">
      {/* Top Header with 23-Language Selector - Mobile First & Zero Overflow */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 sticky top-0 z-40 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left Brand Container */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Logo Icon */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-health-700 to-emerald-600 flex items-center justify-center text-white shadow-md shrink-0">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>

            {/* Brand Title & Badges */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="font-black text-lg sm:text-xl text-white tracking-tight truncate">
                  Swasthya<span className="text-health-400">Sync</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-800/80 hidden xs:inline-flex items-center shrink-0">
                  DIGITAL HEALTH
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block truncate">
                Unified Health Records & Hospital OPD Network
              </p>
            </div>
          </div>

          {/* Right Action Container: Verified Badges (Desktop) + Language Selector */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="hidden lg:flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Digital Health ID</span>
              </div>
              <div className="h-4 w-px bg-slate-800" />
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-health-400 shrink-0" />
                <span>Empaneled Healthcare Network</span>
              </div>
            </div>

            {/* Language Selector Dropdown (23 Indian Languages) */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 min-h-[38px] rounded-xl text-xs font-semibold bg-slate-800/90 text-white border border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-all shadow-sm shrink-0"
                aria-label="Select Language (23 Indian Languages)"
              >
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="uppercase font-extrabold text-emerald-400">{language}</span>
                <span className="hidden sm:inline text-slate-300 text-[11px]">
                  ({SUPPORTED_LANGUAGES.find(l => l.code === language)?.nativeName || 'English'})
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-xs sm:w-72 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 py-2.5 z-50 animate-scale-up text-white">
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
                        className="w-full pl-8 pr-2 py-1.5 text-xs bg-slate-900 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-health-500 placeholder:text-slate-500"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-700/50 mt-1">
                    {filteredLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-left hover:bg-slate-700/80 transition-colors ${
                          language === lang.code ? 'text-emerald-400 font-bold bg-slate-700' : 'text-slate-200'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{lang.nativeName}</span>
                          <span className="text-[10px] text-slate-400">{lang.name} • {lang.region}</span>
                        </div>
                        {language === lang.code && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8 w-full max-w-full">
        <Outlet />
      </main>

      {/* Bottom Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 text-slate-400 text-xs py-4 px-3 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© 2026 SwasthyaSync. Unified Digital Health Platform. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400 text-[11px] sm:text-xs">
            <span>24x7 Health Support: <strong className="text-white">104</strong></span>
            <span>Emergency Ambulance: <strong className="text-white">108</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
};
