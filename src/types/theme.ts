import { UserRole } from './common';

export interface RoleThemeConfig {
  role: UserRole;
  name: string;
  primary: string;         // Primary action & brand accent
  primaryHover: string;    // Hover state
  primaryLight: string;    // Light accent (e.g. active tab bg, soft tag)
  primarySubtle: string;   // Extra soft surface background
  primaryBorder: string;   // Accent border
  textAccent: string;      // High-contrast accent text
  ringColor: string;       // Focus ring outline
  bannerGradient: string;  // Dashboard header gradient classes
  bannerBorder: string;    // Dashboard header border class
  badgeClass: string;      // Pill badge classes
  activeNavClass: string;  // Active sidebar navigation classes
  activeMobileNavClass: string; // Active mobile bottom navigation classes
  buttonPrimaryClass: string;   // Primary button classes
}

export const ROLE_THEMES: Record<UserRole, RoleThemeConfig> = {
  patient: {
    role: 'patient',
    name: 'Patient / Citizen (Pink & White)',
    primary: '#D9467A',          // Pink
    primaryHover: '#BE185D',     // Pink-700 / Dark Pink
    primaryLight: '#FCE7F3',     // Pink-100 / Soft Pink
    primarySubtle: '#FDF2F8',    // Pink-50
    primaryBorder: '#FBCFE8',    // Pink-200
    textAccent: '#9D174D',       // Pink-800
    ringColor: '#F472B6',        // Pink-400
    bannerGradient: 'from-pink-950 via-slate-900 to-navy-950',
    bannerBorder: 'border-pink-800/60',
    badgeClass: 'bg-pink-50 text-pink-800 border-pink-200',
    activeNavClass: 'bg-[#D9467A] text-white shadow-sm font-semibold',
    activeMobileNavClass: 'text-[#D9467A] font-extrabold bg-[#FCE7F3] shadow-xs',
    buttonPrimaryClass: 'bg-[#D9467A] hover:bg-[#BE185D] text-white focus:ring-[#F472B6]',
  },
  hospital: {
    role: 'hospital',
    name: 'Doctor / Hospital Staff (Dark Blue & White)',
    primary: '#155E9A',          // Dark Blue
    primaryHover: '#0C4A6E',     // Sky-900 / Deep Navy
    primaryLight: '#E0F2FE',     // Sky-100 / Soft Blue
    primarySubtle: '#F0F9FF',    // Sky-50
    primaryBorder: '#BAE6FD',    // Sky-200
    textAccent: '#075985',       // Sky-800
    ringColor: '#38BDF8',        // Sky-400
    bannerGradient: 'from-slate-900 via-sky-950 to-slate-900',
    bannerBorder: 'border-sky-800/60',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    activeNavClass: 'bg-[#155E9A] text-white shadow-sm font-semibold',
    activeMobileNavClass: 'text-[#155E9A] font-extrabold bg-[#E0F2FE] shadow-xs',
    buttonPrimaryClass: 'bg-[#155E9A] hover:bg-[#0C4A6E] text-white focus:ring-[#38BDF8]',
  },
  district_admin: {
    role: 'district_admin',
    name: 'District Admin (Dark Green & White)',
    primary: '#047857',          // Dark Green / Emerald-700
    primaryHover: '#065F46',     // Emerald-800 / Forest Green
    primaryLight: '#D1FAE5',     // Emerald-100 / Soft Green
    primarySubtle: '#ECFDF5',    // Emerald-50
    primaryBorder: '#A7F3D0',    // Emerald-200
    textAccent: '#065F46',       // Emerald-800
    ringColor: '#34D399',        // Emerald-400
    bannerGradient: 'from-slate-900 via-emerald-950 to-slate-900',
    bannerBorder: 'border-emerald-800/60',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    activeNavClass: 'bg-[#047857] text-white shadow-sm font-semibold',
    activeMobileNavClass: 'text-[#047857] font-extrabold bg-[#D1FAE5] shadow-xs',
    buttonPrimaryClass: 'bg-[#047857] hover:bg-[#065F46] text-white focus:ring-[#34D399]',
  },
};
