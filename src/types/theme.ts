import { UserRole } from './common';

export interface RoleThemeConfig {
  role: UserRole;
  name: string;
  portalBadgeText: string;
  primary: string;            // Primary action & brand accent
  primaryHover: string;       // Hover state
  primaryLight: string;       // Light accent (e.g. active tab bg, soft tag)
  primarySubtle: string;      // Extra soft surface background
  primaryBorder: string;      // Accent border
  textAccent: string;         // High-contrast accent text
  ringColor: string;          // Focus ring outline
  pageBackground: string;     // Full page background tint
  sidebarBg: string;          // Sidebar background style/gradient
  sidebarBorder: string;      // Sidebar border class
  sidebarHover: string;       // Sidebar item hover class
  sidebarActive: string;      // Sidebar item active class
  topbarBg: string;           // Top session banner gradient
  topbarBadge: string;        // Top session banner badge class
  bannerGradient: string;     // Dashboard header gradient classes
  bannerBorder: string;       // Dashboard header border class
  cardBorder: string;         // Card border class
  badgeClass: string;         // Pill badge classes
  activeNavClass: string;     // Active sidebar navigation classes
  activeMobileNavClass: string; // Active mobile bottom navigation classes
  buttonPrimaryClass: string; // Primary button classes
}

export const ROLE_THEMES: Record<UserRole, RoleThemeConfig> = {
  patient: {
    role: 'patient',
    name: 'Patient / Citizen (Pink & White)',
    portalBadgeText: 'PATIENT PORTAL',
    primary: '#DB2777',          // Pink
    primaryHover: '#BE185D',     // Pink-700 / Dark Pink
    primaryLight: '#FCE7F3',     // Pink-100 / Soft Pink
    primarySubtle: '#FDF2F8',    // Pink-50
    primaryBorder: '#FBCFE8',    // Pink-200
    textAccent: '#9D174D',       // Pink-800
    ringColor: '#F472B6',        // Pink-400
    pageBackground: '#FFF5F8',   // Soft Pink-White
    sidebarBg: 'bg-gradient-to-b from-[#4A0420] via-[#5C0628] to-[#360317]',
    sidebarBorder: 'border-pink-900/60',
    sidebarHover: 'hover:bg-pink-500/20 hover:text-white',
    sidebarActive: 'bg-[#DB2777] text-white shadow-md font-semibold ring-1 ring-pink-400/40',
    topbarBg: 'bg-gradient-to-r from-[#4A0420] via-[#66072D] to-[#360317] border-b border-pink-900/80',
    topbarBadge: 'bg-pink-500/20 text-pink-200 border-pink-400/40',
    bannerGradient: 'from-pink-950 via-slate-900 to-navy-950',
    bannerBorder: 'border-pink-800/60',
    cardBorder: 'border-pink-100',
    badgeClass: 'bg-pink-50 text-pink-800 border-pink-200',
    activeNavClass: 'bg-[#DB2777] text-white shadow-sm font-semibold',
    activeMobileNavClass: 'text-[#DB2777] font-extrabold bg-[#FCE7F3] shadow-xs border-b-2 border-[#DB2777]',
    buttonPrimaryClass: 'bg-[#DB2777] hover:bg-[#BE185D] text-white focus:ring-[#F472B6]',
  },
  hospital: {
    role: 'hospital',
    name: 'Doctor / Hospital Staff (Dark Blue & White)',
    portalBadgeText: 'DOCTOR PORTAL',
    primary: '#1D4ED8',          // Deep Blue
    primaryHover: '#1E40AF',     // Blue-800
    primaryLight: '#EFF6FF',     // Blue-50 / Sky-100
    primarySubtle: '#F0F9FF',    // Sky-50
    primaryBorder: '#BAE6FD',    // Sky-200
    textAccent: '#1E40AF',       // Blue-800
    ringColor: '#38BDF8',        // Sky-400
    pageBackground: '#F4F8FC',   // Soft Blue-White
    sidebarBg: 'bg-gradient-to-b from-[#0A192F] via-[#0D213F] to-[#081326]',
    sidebarBorder: 'border-sky-950/80',
    sidebarHover: 'hover:bg-blue-500/20 hover:text-white',
    sidebarActive: 'bg-[#1D4ED8] text-white shadow-md font-semibold ring-1 ring-sky-400/40',
    topbarBg: 'bg-gradient-to-r from-[#0A192F] via-[#0E274D] to-[#071325] border-b border-sky-950',
    topbarBadge: 'bg-sky-500/20 text-sky-200 border-sky-400/40',
    bannerGradient: 'from-slate-900 via-sky-950 to-slate-900',
    bannerBorder: 'border-sky-800/60',
    cardBorder: 'border-sky-100',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    activeNavClass: 'bg-[#1D4ED8] text-white shadow-sm font-semibold',
    activeMobileNavClass: 'text-[#1D4ED8] font-extrabold bg-[#EFF6FF] shadow-xs border-b-2 border-[#1D4ED8]',
    buttonPrimaryClass: 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white focus:ring-[#38BDF8]',
  },
  district_admin: {
    role: 'district_admin',
    name: 'District Admin (Dark Green & White)',
    portalBadgeText: 'ADMIN PORTAL',
    primary: '#047857',          // Dark Green / Emerald-700
    primaryHover: '#065F46',     // Forest Green
    primaryLight: '#D1FAE5',     // Emerald-100 / Soft Green
    primarySubtle: '#ECFDF5',    // Emerald-50
    primaryBorder: '#A7F3D0',    // Emerald-200
    textAccent: '#065F46',       // Emerald-800
    ringColor: '#34D399',        // Emerald-400
    pageBackground: '#F2F9F5',   // Soft Green-White
    sidebarBg: 'bg-gradient-to-b from-[#042F24] via-[#064E3B] to-[#022119]',
    sidebarBorder: 'border-emerald-950/80',
    sidebarHover: 'hover:bg-emerald-500/20 hover:text-white',
    sidebarActive: 'bg-[#047857] text-white shadow-md font-semibold ring-1 ring-emerald-400/40',
    topbarBg: 'bg-gradient-to-r from-[#042F24] via-[#064E3B] to-[#022119] border-b border-emerald-950',
    topbarBadge: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
    bannerGradient: 'from-slate-900 via-emerald-950 to-slate-900',
    bannerBorder: 'border-emerald-800/60',
    cardBorder: 'border-emerald-100',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    activeNavClass: 'bg-[#047857] text-white shadow-sm font-semibold',
    activeMobileNavClass: 'text-[#047857] font-extrabold bg-[#D1FAE5] shadow-xs border-b-2 border-[#047857]',
    buttonPrimaryClass: 'bg-[#047857] hover:bg-[#065F46] text-white focus:ring-[#34D399]',
  },
};
