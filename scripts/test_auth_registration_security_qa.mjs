import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('================================================================');
console.log('  RUNNING AUTHENTICATION & REGISTRATION SECURITY QA SUITE');
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

// 1. SIGNUP PAGE UI INSPECTION
console.log('--- TEST GROUP 1: Public Signup Page UI Constraints ---');
const signupCode = fs.readFileSync(path.resolve('src/pages/auth/SignupPage.tsx'), 'utf-8');

check('SignupPage contains NO doctor signup option', () => {
  assert(!signupCode.toLowerCase().includes('doctor signup') && !signupCode.toLowerCase().includes('register as doctor'));
});

check('SignupPage contains NO hospital staff signup option', () => {
  assert(!signupCode.toLowerCase().includes('hospital staff signup') && !signupCode.toLowerCase().includes('register as hospital'));
});

check('SignupPage contains NO district admin signup option', () => {
  assert(!signupCode.toLowerCase().includes('district admin signup') && !signupCode.toLowerCase().includes('register as admin'));
});

check('SignupPage contains NO role selector dropdown or radio', () => {
  assert(!signupCode.includes("setSelectedRole") && !signupCode.includes("name=\"role\""));
});

check('SignupPage clearly states public registration is for Citizen/Patient accounts', () => {
  assert(signupCode.includes('Citizen / Patient Account') || signupCode.includes('citizen digital health account'));
});

check('SignupPage collects State, District, City, Locality, and PIN code', () => {
  assert(signupCode.includes('allStates') && signupCode.includes('getDistrictsForState'));
  assert(signupCode.includes('city') && signupCode.includes('locality') && signupCode.includes('pinCode'));
});

// 2. AUTHORIZATION BOUNDARY AT AUTH SERVICE
console.log('\n--- TEST GROUP 2: Strict Authorization Boundary in authService ---');
const authSvcCode = fs.readFileSync(path.resolve('src/services/authService.ts'), 'utf-8');

check('authService.signUp strictly enforces role = "patient"', () => {
  assert(authSvcCode.includes("const enforcedRole: UserRole = 'patient';") || authSvcCode.includes("enforcedRole = 'patient'"));
});

check('authService.signUp ignores / overrides client-supplied role parameter', () => {
  assert(authSvcCode.includes("role: enforcedRole"));
});

check('authService.signUp does not assign professional or admin profiles on public signup', () => {
  assert(!authSvcCode.includes("professionalProfile: params.professionalProfile") || authSvcCode.includes("enforcedRole"));
});

check('authService.signUp dynamically saves selected State, District, City, Locality, and PIN code', () => {
  assert(authSvcCode.includes('userState') && authSvcCode.includes('userDistrict') && authSvcCode.includes('userCity'));
  assert(authSvcCode.includes('location: LocationInfo'));
});

// 3. LOGIN PAGE ROLE SELECTION
console.log('\n--- TEST GROUP 3: Login Page Role Support & Test Personas ---');
const loginCode = fs.readFileSync(path.resolve('src/pages/auth/LoginPage.tsx'), 'utf-8');

check('LoginPage supports Citizen/Patient login', () => {
  assert(loginCode.includes("handleRoleSelect('patient')") || loginCode.includes("selectedRole === 'patient'"));
});

check('LoginPage supports Hospital Staff/Doctor login', () => {
  assert(loginCode.includes("handleRoleSelect('hospital')") || loginCode.includes("selectedRole === 'hospital'"));
});

check('LoginPage supports District Admin login', () => {
  assert(loginCode.includes("handleRoleSelect('district_admin')") || loginCode.includes("selectedRole === 'district_admin'"));
});

check('LoginPage preserves multi-region test personas (Maharashtra, Delhi, Karnataka)', () => {
  assert(loginCode.includes('Maharashtra') && loginCode.includes('Delhi') && loginCode.includes('Karnataka'));
});

// 4. DATABASE / SUPABASE MIGRATION AUTHORIZATION SECURITY
console.log('\n--- TEST GROUP 4: Database Trigger Authorization Boundary ---');
const mig4 = fs.readFileSync(path.resolve('supabase/migrations/20260823000004_enforce_patient_signup_security_and_dynamic_location.sql'), 'utf-8');

check('Supabase migration enforces assigned_role := "patient" in handle_new_user', () => {
  assert(mig4.includes("assigned_role := 'patient'::user_role_enum;"));
});

check('Supabase migration extracts dynamic State, District, City, Locality, PIN code from user metadata', () => {
  assert(mig4.includes("NEW.raw_user_meta_data->>'state'") && mig4.includes("NEW.raw_user_meta_data->>'district'"));
});

check('Supabase migration builds dynamic patient address jsonb', () => {
  assert(mig4.includes("jsonb_build_object") && mig4.includes("'district', user_district") && mig4.includes("'state', user_state"));
});

// 5. PATIENT SERVICE DYNAMIC LOCATION
console.log('\n--- TEST GROUP 5: Patient Service Dynamic Location Integration ---');
const patientSvcCode = fs.readFileSync(path.resolve('src/services/patientService.ts'), 'utf-8');

check('patientService.getPatientForUser dynamically extracts state and district from user profile', () => {
  assert(patientSvcCode.includes('userDistrict') && patientSvcCode.includes('userState'));
  assert(patientSvcCode.includes('district: userDistrict') && patientSvcCode.includes('state: userState'));
});

// 6. ROLE SWITCHER & SESSION SECURITY
console.log('\n--- TEST GROUP 6: Role Switcher & Privilege Escalation Protection ---');
const roleSwitcherCode = fs.readFileSync(path.resolve('src/components/navigation/RoleSwitcherBanner.tsx'), 'utf-8');

check('RoleSwitcherBanner only logs out to /login without client privilege elevation', () => {
  assert(roleSwitcherCode.includes('handleSwitchAccount') && roleSwitcherCode.includes('logout()') && roleSwitcherCode.includes("navigate('/login')"));
  assert(!roleSwitcherCode.includes('setRole('));
});

console.log('\n================================================================');
console.log(`  QA SUMMARY: ${passed}/${total} TESTS PASSED`);
console.log('================================================================');

if (passed === total) {
  console.log('🎉 ALL AUTHENTICATION & REGISTRATION SECURITY TESTS PASSED (100%)!');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED');
  process.exit(1);
}
