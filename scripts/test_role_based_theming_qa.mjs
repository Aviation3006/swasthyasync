import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('================================================================');
console.log('  RUNNING SWASTHYASYNC FULL ROLE-BASED COLOR THEMING QA SUITE');
console.log('  Testing Role Themes: Patient (Pink) | Doctor (Dark Blue) | Admin (Dark Green)');
console.log('================================================================\n');

let passed = 0;
let total = 0;

function check(title, fn) {
  total++;
  try {
    fn();
    console.log(`✅ [PASS] ${title}`);
    passed++;
  } catch (err) {
    console.error(`❌ [FAIL] ${title}: ${err.message}`);
  }
}

// 1. THEME ARCHITECTURE & CENTRALIZED TOKENS
console.log('--- TEST GROUP 1: Centralized Theme Architecture & Token Schema ---');
const themeTypes = fs.readFileSync(path.resolve('src/types/theme.ts'), 'utf-8');
check('src/types/theme.ts defines RoleThemeConfig and ROLE_THEMES map', () => {
  assert(themeTypes.includes('export interface RoleThemeConfig'));
  assert(themeTypes.includes('export const ROLE_THEMES: Record<UserRole, RoleThemeConfig>'));
});

check('Patient Theme specifies Primary #DB2777, Light Accent #FCE7F3, and Background #FFF5F8', () => {
  assert(themeTypes.includes('#DB2777'));
  assert(themeTypes.includes('#FCE7F3'));
  assert(themeTypes.includes('#BE185D'));
  assert(themeTypes.includes('#9D174D'));
  assert(themeTypes.includes('#FFF5F8'));
  assert(themeTypes.includes('PATIENT PORTAL'));
});

check('Doctor/Hospital Theme specifies Primary #1D4ED8, Light Accent #EFF6FF, and Background #F4F8FC', () => {
  assert(themeTypes.includes('#1D4ED8'));
  assert(themeTypes.includes('#EFF6FF'));
  assert(themeTypes.includes('#1E40AF'));
  assert(themeTypes.includes('#F4F8FC'));
  assert(themeTypes.includes('DOCTOR PORTAL'));
});

check('District Admin Theme specifies Primary #047857, Light Accent #D1FAE5, and Background #F2F9F5', () => {
  assert(themeTypes.includes('#047857'));
  assert(themeTypes.includes('#D1FAE5'));
  assert(themeTypes.includes('#065F46'));
  assert(themeTypes.includes('#F2F9F5'));
  assert(themeTypes.includes('ADMIN PORTAL'));
});

const themeContext = fs.readFileSync(path.resolve('src/context/ThemeContext.tsx'), 'utf-8');
check('ThemeContext provides ThemeProvider and useTheme() hook bound to AuthContext role', () => {
  assert(themeContext.includes('export const ThemeProvider: React.FC'));
  assert(themeContext.includes('export const useTheme = ()'));
  assert(themeContext.includes('root.setAttribute(\'data-theme\', currentRole)'));
  assert(themeContext.includes('root.style.setProperty(\'--theme-primary\', theme.primary)'));
  assert(themeContext.includes('root.style.setProperty(\'--theme-background\', theme.pageBackground)'));
});

const appCode = fs.readFileSync(path.resolve('src/App.tsx'), 'utf-8');
check('App.tsx wraps application routes in ThemeProvider', () => {
  assert(appCode.includes('<ThemeProvider>'));
  assert(appCode.includes('</ThemeProvider>'));
});

// 2. CSS VARIABLES, TAILWIND CONFIGURATION & FULL PAGE BACKGROUNDS
console.log('\n--- TEST GROUP 2: CSS Variables, Tailwind Config & Page Layout Backgrounds ---');
const indexCss = fs.readFileSync(path.resolve('src/index.css'), 'utf-8');
check('index.css contains CSS variables for :root and [data-theme] selectors', () => {
  assert(indexCss.includes('[data-theme=\'patient\']'));
  assert(indexCss.includes('[data-theme=\'hospital\']'));
  assert(indexCss.includes('[data-theme=\'district_admin\']'));
  assert(indexCss.includes('--theme-primary: #DB2777'));
  assert(indexCss.includes('--theme-primary: #1D4ED8'));
  assert(indexCss.includes('--theme-primary: #047857'));
  assert(indexCss.includes('--theme-background: #FFF5F8'));
  assert(indexCss.includes('--theme-background: #F4F8FC'));
  assert(indexCss.includes('--theme-background: #F2F9F5'));
});

const twConfig = fs.readFileSync(path.resolve('tailwind.config.js'), 'utf-8');
check('tailwind.config.js maps theme color tokens to CSS variables', () => {
  assert(twConfig.includes('primary: \'var(--theme-primary)\''));
  assert(twConfig.includes('\'primary-light\': \'var(--theme-primary-light)\''));
  assert(twConfig.includes('background: \'var(--theme-background)\''));
  assert(twConfig.includes('border: \'var(--theme-border)\''));
});

const ptLayout = fs.readFileSync(path.resolve('src/layouts/PatientLayout.tsx'), 'utf-8');
const hospLayout = fs.readFileSync(path.resolve('src/layouts/HospitalLayout.tsx'), 'utf-8');
const adminLayout = fs.readFileSync(path.resolve('src/layouts/DistrictAdminLayout.tsx'), 'utf-8');
check('Layouts apply bg-theme-background for full-page role theme tint', () => {
  assert(ptLayout.includes('bg-theme-background'));
  assert(hospLayout.includes('bg-theme-background'));
  assert(adminLayout.includes('bg-theme-background'));
});

// 3. CORE UI COMPONENTS THEME APPLICATION
console.log('\n--- TEST GROUP 3: Core UI Primitives Theme Application ---');
const btnCode = fs.readFileSync(path.resolve('src/components/common/Button.tsx'), 'utf-8');
check('Button component uses theme-primary and theme-ring for primary variant', () => {
  assert(btnCode.includes('bg-theme-primary hover:bg-theme-primary-hover'));
  assert(btnCode.includes('focus:ring-theme-ring'));
});

const tabsCode = fs.readFileSync(path.resolve('src/components/common/Tabs.tsx'), 'utf-8');
check('Tabs component highlights active tab with theme-primary and theme-primary-light', () => {
  assert(tabsCode.includes('text-theme-primary'));
  assert(tabsCode.includes('border-theme-primary'));
  assert(tabsCode.includes('bg-theme-primary-light'));
});

const cardCode = fs.readFileSync(path.resolve('src/components/common/Card.tsx'), 'utf-8');
check('Card uses border-theme-border and icon container uses bg-theme-primary-subtle', () => {
  assert(cardCode.includes('border border-theme-border'));
  assert(cardCode.includes('bg-theme-primary-subtle text-theme-primary'));
});

const badgeCode = fs.readFileSync(path.resolve('src/components/common/StatusBadge.tsx'), 'utf-8');
check('StatusBadge includes theme variant using theme CSS tokens', () => {
  assert(badgeCode.includes('theme: \'bg-theme-primary-subtle text-theme-text-accent border-theme-primary-border\''));
  assert(badgeCode.includes('theme: \'bg-theme-primary\''));
});

const inputCode = fs.readFileSync(path.resolve('src/components/forms/Input.tsx'), 'utf-8');
const selectCode = fs.readFileSync(path.resolve('src/components/forms/Select.tsx'), 'utf-8');
const searchCode = fs.readFileSync(path.resolve('src/components/forms/SearchInput.tsx'), 'utf-8');
const toggleCode = fs.readFileSync(path.resolve('src/components/forms/ToggleSwitch.tsx'), 'utf-8');
check('Form inputs and switches adapt focus ring and active state to role theme', () => {
  assert(inputCode.includes('focus:border-theme-primary focus:ring-theme-primary-light'));
  assert(selectCode.includes('focus:border-theme-primary focus:ring-theme-primary-light'));
  assert(searchCode.includes('focus:border-theme-primary') && searchCode.includes('focus:ring-theme-primary-light'));
  assert(toggleCode.includes('bg-theme-primary'));
});

// 4. NAVIGATION, SIDEBAR & GLOBAL HEADER THEME INTEGRATION
console.log('\n--- TEST GROUP 4: Navigation, Distinct Sidebar & Header Integration ---');
const sidebarCode = fs.readFileSync(path.resolve('src/components/navigation/Sidebar.tsx'), 'utf-8');
check('Sidebar uses distinct role gradient background (theme.sidebarBg) and active styling', () => {
  assert(sidebarCode.includes('${theme.sidebarBg}'));
  assert(sidebarCode.includes('${theme.sidebarBorder}'));
  assert(sidebarCode.includes('theme.portalBadgeText'));
  assert(sidebarCode.includes('theme.sidebarActive'));
});

const mobileNavCode = fs.readFileSync(path.resolve('src/components/navigation/MobileNav.tsx'), 'utf-8');
check('MobileNav highlights active tab with text-theme-primary and bg-theme-primary-light', () => {
  assert(mobileNavCode.includes('text-theme-primary font-extrabold bg-theme-primary-light'));
});

const navbarCode = fs.readFileSync(path.resolve('src/components/navigation/Navbar.tsx'), 'utf-8');
check('Navbar brand icon, portal badge, user avatar, and border adapt to role theme', () => {
  assert(navbarCode.includes('from-theme-primary to-theme-primary-hover'));
  assert(navbarCode.includes('theme.portalBadgeText'));
  assert(navbarCode.includes('bg-theme-primary text-white'));
  assert(navbarCode.includes('border-b border-theme-border'));
});

const topbarCode = fs.readFileSync(path.resolve('src/components/navigation/RoleSwitcherBanner.tsx'), 'utf-8');
check('RoleSwitcherBanner applies theme.topbarBg and theme.topbarBadge', () => {
  assert(topbarCode.includes('${theme.topbarBg}'));
  assert(topbarCode.includes('theme.portalBadgeText'));
});

// 5. ROLE-SPECIFIC DASHBOARD IDENTITIES
console.log('\n--- TEST GROUP 5: Role-Specific Dashboard Identities ---');
const ptDash = fs.readFileSync(path.resolve('src/pages/patient/PatientDashboard.tsx'), 'utf-8');
check('PatientDashboard banner uses pink theme scheme (from-pink-950 border-pink-800/50)', () => {
  assert(ptDash.includes('from-pink-950') && ptDash.includes('border-pink-800/50'));
});

const hospDash = fs.readFileSync(path.resolve('src/pages/hospital/HospitalDashboard.tsx'), 'utf-8');
check('HospitalDashboard banner uses dark blue clinical theme scheme (from-slate-900 via-sky-950)', () => {
  assert(hospDash.includes('via-sky-950') && hospDash.includes('border-sky-800/50'));
});

const adminDash = fs.readFileSync(path.resolve('src/pages/district-admin/DistrictDashboard.tsx'), 'utf-8');
check('DistrictDashboard banner uses dark green administrative theme scheme (from-slate-900 via-emerald-950)', () => {
  assert(adminDash.includes('via-emerald-950') && adminDash.includes('border-emerald-800/50'));
});

console.log('\n================================================================');
console.log(`  ROLE-BASED THEMING QA SUMMARY: ${passed}/${total} TESTS PASSED`);
console.log('================================================================');

if (passed === total) {
  console.log('🎉 ALL FULL ROLE-BASED COLOR THEMING TESTS PASSED (100%)!');
  process.exit(0);
} else {
  console.error('❌ SOME ROLE-BASED THEMING TESTS FAILED');
  process.exit(1);
}
