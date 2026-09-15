import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('================================================================');
console.log('  TESTING HOSPITAL DASHBOARD, SWITCH ACCOUNT, & AUTH RELOAD QA');
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

// ---------------------------------------------------------
// TEST GROUP 1: Hospital Dashboard Queue Removal
// ---------------------------------------------------------
console.log('--- TEST GROUP 1: Hospital Dashboard Layout & Queue ---');
const hospDashCode = fs.readFileSync(path.resolve('src/pages/hospital/HospitalDashboard.tsx'), 'utf-8');

check('HospitalDashboard does NOT contain Active Queue Triage Widget table', () => {
  assert(!hospDashCode.includes('Active Queue Triage Widget'));
  assert(!hospDashCode.includes('Real-time patient flow and clinical consultation caller'));
  assert(!hospDashCode.includes('handleCallNextPatient'));
  assert(!hospDashCode.includes('handleCompleteConsultation'));
});

check('HospitalDashboard retains OPD Patients Today KPI card with waiting/in-consult breakdown', () => {
  assert(hospDashCode.includes('t.opdPatientsToday'));
  assert(hospDashCode.includes('{queue.length}'));
  assert(hospDashCode.includes('{waitingCount} waiting'));
  assert(hospDashCode.includes('{inConsultCount} in consult'));
});

check('HospitalDashboard retains Quick Action link to dedicated /hospital/queue', () => {
  assert(hospDashCode.includes('to="/hospital/queue"'));
  assert(hospDashCode.includes('{t.navLiveQueue}'));
});

check('HospitalDashboard retains Clinical Department Overview and Doctors on Duty', () => {
  assert(hospDashCode.includes('Clinical Department Overview'));
  assert(hospDashCode.includes('hospital.departments.map'));
  assert(hospDashCode.includes('t.doctorsOnDuty'));
  assert(hospDashCode.includes('hospital.doctors.map'));
});

check('Dedicated HospitalQueue page exists intact', () => {
  const hospQueueCode = fs.readFileSync(path.resolve('src/pages/hospital/HospitalQueue.tsx'), 'utf-8');
  assert(hospQueueCode.includes('HospitalQueue'));
  assert(hospQueueCode.includes('hospitalService.getQueue()'));
  assert(hospQueueCode.includes('handleStatusChange'));
  assert(hospQueueCode.includes('handleAddWalkIn'));
});

// ---------------------------------------------------------
// TEST GROUP 2: Navigation Switch Account Removal
// ---------------------------------------------------------
console.log('\n--- TEST GROUP 2: Switch Account Removal from Navigation ---');
const navbarCode = fs.readFileSync(path.resolve('src/components/navigation/Navbar.tsx'), 'utf-8');

check('Navbar contains NO desktop Switch Account button', () => {
  assert(!navbarCode.includes('Fast Switch Account/Role for Demo Mode'));
  assert(!navbarCode.includes('handleSwitchAccount'));
  assert(!navbarCode.includes('ArrowLeftRight'));
});

check('Navbar user dropdown contains Profile and Sign Out, but NO Switch Account item', () => {
  assert(navbarCode.includes('{t.navProfile}'));
  assert(navbarCode.includes('{t.signOut}'));
  assert(!navbarCode.includes('{t.switchAccount}'));
});

const bannerCode = fs.readFileSync(path.resolve('src/components/navigation/RoleSwitcherBanner.tsx'), 'utf-8');
check('RoleSwitcherBanner uses Sign Out ({t.signOut}) instead of Switch Account', () => {
  assert(!bannerCode.includes('{t.switchAccount}'));
  assert(bannerCode.includes('{t.signOut}'));
  assert(bannerCode.includes('handleLogout'));
});

// ---------------------------------------------------------
// TEST GROUP 3: Authentication Reload & Entry Point Logic
// ---------------------------------------------------------
console.log('\n--- TEST GROUP 3: Authentication Reload & Entry Point Logic ---');
const authContextCode = fs.readFileSync(path.resolve('src/context/AuthContext.tsx'), 'utf-8');

check('AuthContext checks swasthyasync_auth_status and session_user before restoring active role', () => {
  assert(authContextCode.includes("localStorage.getItem('swasthyasync_auth_status') === 'true'"));
  assert(authContextCode.includes('swasthyasync_session_user'));
});

check('AuthContext checkSession resets role to patient and purges stale session if unauthenticated', () => {
  assert(authContextCode.includes("setRole('patient')"));
  assert(authContextCode.includes("localStorage.removeItem('swasthyasync_session_user')"));
  assert(authContextCode.includes("localStorage.removeItem('swasthyasync_active_role')"));
});

check('AuthContext signOut clears session and resets role to patient', () => {
  assert(authContextCode.includes("setRole('patient');"));
  assert(authContextCode.includes("localStorage.setItem('swasthyasync_auth_status', 'false');"));
  assert(authContextCode.includes("localStorage.removeItem('swasthyasync_session_user');"));
  assert(authContextCode.includes("localStorage.removeItem('swasthyasync_active_role');"));
});

check('AuthContext persists session_user on signInWithEmail, signUpWithEmail, and signInWithPersona', () => {
  assert(authContextCode.includes("localStorage.setItem('swasthyasync_session_user', JSON.stringify(appUser))"));
  assert(authContextCode.includes("localStorage.setItem('swasthyasync_session_user', JSON.stringify(persona.user))"));
});

const loginPageCode = fs.readFileSync(path.resolve('src/pages/auth/LoginPage.tsx'), 'utf-8');
check('LoginPage defaults to patient role tab unless URL query specifies ?role=', () => {
  assert(loginPageCode.includes("const search = new URLSearchParams(location.search);"));
  assert(loginPageCode.includes("return 'patient';"));
  assert(!loginPageCode.includes("return currentThemeRole || 'patient';"));
});

check('LoginPage redirects already-authenticated users to their designated role portal', () => {
  assert(loginPageCode.includes("if (isAuthenticated)"));
  assert(loginPageCode.includes("navigate('/hospital'"));
  assert(loginPageCode.includes("navigate('/district-admin'"));
  assert(loginPageCode.includes("navigate('/patient'"));
});

const themeContextCode = fs.readFileSync(path.resolve('src/context/ThemeContext.tsx'), 'utf-8');
check('ThemeContext prevents unauthenticated role leaking into theme or state', () => {
  assert(themeContextCode.includes("const { role: authRole, isAuthenticated } = useAuth();"));
  assert(themeContextCode.includes("if (isAuthenticated && authRole) return authRole;"));
  assert(themeContextCode.includes("path === '/login'"));
});

console.log('\n================================================================');
console.log(`  TARGETED FIX QA SUMMARY: ${passed}/${total} TESTS PASSED`);
console.log('================================================================');

if (passed === total) {
  console.log('🎉 ALL TARGETED FIX QA TESTS PASSED (100%)!');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED');
  process.exit(1);
}
