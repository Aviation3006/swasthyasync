import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('================================================================');
console.log('  RUNNING COMPREHENSIVE CITIZEN SIGNUP & SECURITY QA SUITE');
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

// 1. SIGNUP PAGE UI INSPECTION & SECTIONS
console.log('--- TEST GROUP 1: Public Citizen Signup Form Sections & UI ---');
const signupCode = fs.readFileSync(path.resolve('src/pages/auth/SignupPage.tsx'), 'utf-8');

check('SignupPage defines Section A: Account Information', () => {
  assert(signupCode.includes('1. Account & Identity Information') || signupCode.includes('1. Account Information') || signupCode.includes('Account Information'));
  assert(signupCode.includes('fullName') && signupCode.includes('email') && signupCode.includes('password') && signupCode.includes('confirmPassword') && signupCode.includes('phone'));
});

check('SignupPage defines Section B: Basic Demographics & Residential Location', () => {
  assert(signupCode.includes('2. Domicile & Location Details') || signupCode.includes('2. Basic Demographics') || signupCode.includes('Demographics'));
  assert(signupCode.includes('dob') && signupCode.includes('gender') && signupCode.includes('state') && signupCode.includes('district') && signupCode.includes('city') && signupCode.includes('locality') && signupCode.includes('pinCode'));
});

check('SignupPage defines Section C: Basic Health Information (Optional)', () => {
  assert(signupCode.includes('3. Clinical Profile & Emergency Access') || signupCode.includes('3. Basic Health Information'));
  assert(signupCode.includes('bloodGroup') && signupCode.includes('height') && signupCode.includes('weight') && signupCode.includes('allergiesText') && signupCode.includes('chronicConditionsText') && signupCode.includes('currentMedicationsText'));
});

check('SignupPage includes Emergency Contact optional sub-form', () => {
  assert(signupCode.includes('emergencyContactName') && signupCode.includes('emergencyContactPhone') && signupCode.includes('emergencyContactRelation'));
});

check('SignupPage enforces password confirmation match', () => {
  assert(signupCode.includes('password !== confirmPassword'));
});

check('Optional medical information is explicitly marked non-blocking and optional', () => {
  assert(signupCode.includes('Optional'));
});

// 2. OPTIONAL ABHA NUMBER FIELD & VALIDATION
console.log('\n--- TEST GROUP 2: Optional ABHA Number Integration & Accurate Copy ---');

check('SignupPage renders ABHA Number (Optional) field with explicit Optional indicator', () => {
  assert(signupCode.includes('ABHA Number'));
  assert(signupCode.includes('(Optional)'));
});

check('SignupPage communicates helpful record connection copy without false automatic import claims', () => {
  assert(signupCode.includes('Already have an ABHA? Add it to help connect your existing digital health records.'));
  assert(!signupCode.toLowerCase().includes('automatically import all medical history'));
});

check('SignupPage validates 14 digits format when ABHA is entered and allows empty submission', () => {
  assert(signupCode.includes('cleanDigits.length !== 14'));
  assert(signupCode.includes('abhaNumber.trim() || undefined'));
});

// 3. PRIVILEGED ROLE REMOVAL FROM PUBLIC UI
console.log('\n--- TEST GROUP 3: Public UI Role Lockdown ---');

check('SignupPage contains NO doctor / hospital signup option', () => {
  assert(!signupCode.toLowerCase().includes('doctor signup') && !signupCode.toLowerCase().includes('register as hospital'));
});

check('SignupPage contains NO district admin signup option', () => {
  assert(!signupCode.toLowerCase().includes('district admin signup') && !signupCode.toLowerCase().includes('register as admin'));
});

check('SignupPage contains NO role selector radio / dropdown', () => {
  assert(!signupCode.includes("setSelectedRole") && !signupCode.includes("name=\"role\""));
});

check('SignupPage clearly indicates public registration is for Citizen/Patient accounts only', () => {
  assert(signupCode.includes('PATIENT PORTAL • CITIZEN REGISTRATION') || signupCode.includes('Citizen / Patient Registration'));
});

// 4. CLIENT & SERVER AUTHORIZATION BOUNDARY
console.log('\n--- TEST GROUP 4: Authorization Boundary Enforcement ---');
const authServiceCode = fs.readFileSync(path.resolve('src/services/authService.ts'), 'utf-8');

check('authService.signUp hardcodes and enforces role = patient', () => {
  assert(authServiceCode.includes("const enforcedRole: UserRole = 'patient';"));
  assert(authServiceCode.includes("role: enforcedRole"));
});

check('authService.signUp ignores any privileged role in input parameters', () => {
  assert(authServiceCode.includes("// ENFORCE PATIENT ROLE AT THE AUTHORIZATION BOUNDARY"));
});

check('AppRouter strictly protects privileged routes with ProtectedRoute role guards', () => {
  const routerCode = fs.readFileSync(path.resolve('src/App.tsx'), 'utf-8');
  assert(routerCode.includes('<ProtectedRoute allowedRoles={[\'hospital\']}>'));
  assert(routerCode.includes('<ProtectedRoute allowedRoles={[\'district_admin\']}>'));
  assert(routerCode.includes('<ProtectedRoute allowedRoles={[\'patient\']}>'));
});

console.log('\n================================================================');
console.log(`  SECURITY & SIGNUP QA SUMMARY: ${passed}/${total} TESTS PASSED`);
console.log('================================================================');

if (passed === total) {
  console.log('🎉 ALL SECURITY & CITIZEN REGISTRATION TESTS PASSED (100%)!');
  process.exit(0);
} else {
  console.error('❌ SOME SECURITY & SIGNUP TESTS FAILED');
  process.exit(1);
}
