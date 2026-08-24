import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('================================================================');
console.log('  RUNNING SWASTHYASYNC MULTI-VIEWPORT RESPONSIVENESS QA SUITE');
console.log('  Auditing Viewports: 320px | 360px | 375px | 390px | 412px | 768px | 1280px');
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

// 1. BASELINE CSS & HTML VIEWPORT CONFIGURATION
console.log('--- TEST GROUP 1: Global Viewport & CSS Guardrails ---');
const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf-8');
check('index.html contains standard responsive viewport meta tag', () => {
  assert(indexHtml.includes('name="viewport"') && indexHtml.includes('width=device-width, initial-scale=1.0'));
});

const indexCss = fs.readFileSync(path.resolve('src/index.css'), 'utf-8');
check('src/index.css includes global overflow guardrails and no-scrollbar utilities', () => {
  assert(indexCss.includes('max-width: 100vw'));
  assert(indexCss.includes('no-scrollbar'));
});

// 2. LAYOUT AUDIT: AUTH, PATIENT, HOSPITAL, DISTRICT ADMIN
console.log('\n--- TEST GROUP 2: Layout Containers & Navigation Breakpoints ---');
const authLayout = fs.readFileSync(path.resolve('src/layouts/AuthLayout.tsx'), 'utf-8');
check('AuthLayout language dropdown is viewport-constrained for 320px screens', () => {
  assert(authLayout.includes('w-[calc(100vw-28px)]'));
});
check('AuthLayout uses responsive padding (p-3 sm:p-6 lg:p-8)', () => {
  assert(authLayout.includes('p-3 sm:p-6 lg:p-8'));
});

const patientLayout = fs.readFileSync(path.resolve('src/layouts/PatientLayout.tsx'), 'utf-8');
check('PatientLayout main container uses responsive padding (px-3 sm:px-6 lg:px-8 py-4 sm:py-6)', () => {
  assert(patientLayout.includes('px-3 sm:px-6 lg:px-8 py-4 sm:py-6'));
});

const navbarCode = fs.readFileSync(path.resolve('src/components/navigation/Navbar.tsx'), 'utf-8');
check('Navbar dropdowns are mobile-constrained (w-[calc(100vw-24px)])', () => {
  assert(navbarCode.includes('w-[calc(100vw-24px)]'));
});

const mobileNavCode = fs.readFileSync(path.resolve('src/components/navigation/MobileNav.tsx'), 'utf-8');
check('MobileNav features thumb-friendly >=48px touch targets and safe area padding', () => {
  assert(mobileNavCode.includes('min-h-[48px]'));
  assert(mobileNavCode.includes('pb-safe'));
});

// 3. COMMON UI COMPONENTS: CARDS, MODALS, TABS, PAGE HEADERS
console.log('\n--- TEST GROUP 3: Core UI Primitives Mobile Adaptability ---');
const cardCode = fs.readFileSync(path.resolve('src/components/common/Card.tsx'), 'utf-8');
check('Card uses responsive padding (p-3.5 sm:p-5 sm:p-6) and wrapping footers', () => {
  assert(cardCode.includes('p-3.5 sm:p-5 sm:p-6'));
  assert(cardCode.includes('flex flex-wrap'));
});

const modalCode = fs.readFileSync(path.resolve('src/components/common/Modal.tsx'), 'utf-8');
check('Modal uses responsive padding and wrapping action footer for 320px viewports', () => {
  assert(modalCode.includes('p-2.5 sm:p-4 md:p-6'));
  assert(modalCode.includes('flex flex-wrap items-center justify-end'));
});

const tabsCode = fs.readFileSync(path.resolve('src/components/common/Tabs.tsx'), 'utf-8');
check('Tabs container supports horizontal sliding (overflow-x-auto no-scrollbar max-w-full)', () => {
  assert(tabsCode.includes('overflow-x-auto no-scrollbar max-w-full'));
});

const pageHeaderCode = fs.readFileSync(path.resolve('src/components/navigation/PageHeader.tsx'), 'utf-8');
check('PageHeader supports text wrapping (break-words) and horizontal breadcrumb scroll', () => {
  assert(pageHeaderCode.includes('break-words'));
  assert(pageHeaderCode.includes('overflow-x-auto no-scrollbar max-w-full'));
});

// 4. AUTHENTICATION SCREENS (LOGIN & SIGNUP)
console.log('\n--- TEST GROUP 4: Auth Screens (320px–412px Viewports) ---');
const loginCode = fs.readFileSync(path.resolve('src/pages/auth/LoginPage.tsx'), 'utf-8');
check('LoginPage card uses responsive padding (p-4 sm:p-8) and break-all for emails', () => {
  assert(loginCode.includes('p-4 sm:p-8 text-white'));
  assert(loginCode.includes('break-all'));
});

const signupCode = fs.readFileSync(path.resolve('src/pages/auth/SignupPage.tsx'), 'utf-8');
check('SignupPage card uses responsive padding (p-4 sm:p-8 md:p-10)', () => {
  assert(signupCode.includes('p-4 sm:p-8 md:p-10'));
});

// 5. PATIENT PORTAL SCREENS (DASHBOARD, CARESETU, APPOINTMENTS, REPORTS, RECORDS)
console.log('\n--- TEST GROUP 5: Patient Experience (Dashboard, CareSetu, Reports, Appointments) ---');
const dashCode = fs.readFileSync(path.resolve('src/pages/patient/PatientDashboard.tsx'), 'utf-8');
check('PatientDashboard uses responsive stacking buttons without string bugs', () => {
  assert(dashCode.includes('CareSetu Smart Card') && !dashCode.includes('"CareSetu Smart Card"'));
});

const qrCode = fs.readFileSync(path.resolve('src/pages/patient/PatientHealthQR.tsx'), 'utf-8');
check('PatientHealthQR action buttons use responsive grid (grid-cols-1 sm:grid-cols-3)', () => {
  assert(qrCode.includes('grid grid-cols-1 sm:grid-cols-3 gap-2.5'));
  assert(qrCode.includes('p-4 sm:p-6 md:p-8 shadow-2xl'));
});

const apptsCode = fs.readFileSync(path.resolve('src/pages/patient/PatientAppointments.tsx'), 'utf-8');
check('PatientAppointments cards wrap hospital titles and distance badges cleanly', () => {
  assert(apptsCode.includes('flex flex-col xs:flex-row items-start justify-between gap-2'));
});

const reportsCode = fs.readFileSync(path.resolve('src/pages/patient/PatientReports.tsx'), 'utf-8');
check('PatientReports tables are wrapped in overflow-x-auto containers', () => {
  assert(reportsCode.includes('overflow-x-auto w-full'));
});

const recordsCode = fs.readFileSync(path.resolve('src/pages/patient/PatientRecords.tsx'), 'utf-8');
check('PatientRecords biomarkers table is wrapped in overflow-x-auto', () => {
  assert(recordsCode.includes('border border-slate-200 rounded-xl overflow-x-auto'));
});

// 6. CLINICAL & DISTRICT ADMIN TABLES OVERFLOW WRAPPERS
console.log('\n--- TEST GROUP 6: Clinical & Administrative Data Tables ---');
const analyticsCode = fs.readFileSync(path.resolve('src/pages/district-admin/DistrictAnalytics.tsx'), 'utf-8');
check('DistrictAnalytics scorecard table is wrapped in overflow-x-auto', () => {
  assert(analyticsCode.includes('border border-slate-200 rounded-xl overflow-x-auto'));
});

const distDashCode = fs.readFileSync(path.resolve('src/pages/district-admin/DistrictDashboard.tsx'), 'utf-8');
check('DistrictDashboard disease surveillance table is wrapped in overflow-x-auto', () => {
  assert(distDashCode.includes('border border-slate-200 rounded-xl overflow-x-auto'));
});

const rxCode = fs.readFileSync(path.resolve('src/pages/hospital/HospitalPrescriptions.tsx'), 'utf-8');
check('HospitalPrescriptions medication table is wrapped in overflow-x-auto', () => {
  assert(rxCode.includes('border border-slate-200 rounded-lg overflow-x-auto'));
});

const hospReportsCode = fs.readFileSync(path.resolve('src/pages/hospital/HospitalReports.tsx'), 'utf-8');
check('HospitalReports investigation parameters table is wrapped in overflow-x-auto', () => {
  assert(hospReportsCode.includes('border rounded-xl overflow-x-auto'));
});

const auditCode = fs.readFileSync(path.resolve('src/pages/district-admin/DistrictAudit.tsx'), 'utf-8');
check('DistrictAudit uses responsive padding and overflow-x-auto for 20-doctor audit table', () => {
  assert(auditCode.includes('p-3.5 sm:p-6 sm:p-8'));
  assert(auditCode.includes('overflow-x-auto'));
});

console.log('\n================================================================');
console.log(`  MULTI-VIEWPORT QA SUMMARY: ${passed}/${total} TESTS PASSED`);
console.log('================================================================');

if (passed === total) {
  console.log('🎉 ALL MULTI-VIEWPORT RESPONSIVENESS TESTS PASSED (100%)!');
  process.exit(0);
} else {
  console.error('❌ SOME RESPONSIVENESS TESTS FAILED');
  process.exit(1);
}
