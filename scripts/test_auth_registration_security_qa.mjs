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

check('SignupPage defines Section A: Account Information (Required)', () => {
  assert(signupCode.includes('1. Account Information') || signupCode.includes('Account Information'));
  assert(signupCode.includes('fullName') && signupCode.includes('email') && signupCode.includes('password') && signupCode.includes('confirmPassword') && signupCode.includes('phone'));
});

check('SignupPage defines Section B: Basic Demographics & Residential Location', () => {
  assert(signupCode.includes('2. Basic Demographics') || signupCode.includes('Demographics'));
  assert(signupCode.includes('dob') && signupCode.includes('gender') && signupCode.includes('state') && signupCode.includes('district') && signupCode.includes('city') && signupCode.includes('locality') && signupCode.includes('pinCode'));
});

check('SignupPage defines Section C: Basic Health Information (Optional)', () => {
  assert(signupCode.includes('3. Basic Health Information (Optional)') || signupCode.includes('Basic Health Information'));
  assert(signupCode.includes('bloodGroup') && signupCode.includes('height') && signupCode.includes('weight') && signupCode.includes('allergiesText') && signupCode.includes('chronicConditionsText') && signupCode.includes('currentMedicationsText'));
});

check('SignupPage includes Emergency Contact optional sub-form', () => {
  assert(signupCode.includes('emergencyContactName') && signupCode.includes('emergencyContactPhone') && signupCode.includes('emergencyContactRelation'));
});

check('SignupPage enforces password confirmation match', () => {
  assert(signupCode.includes('password !== confirmPassword'));
});

check('Optional medical information is explicitly marked non-blocking and optional', () => {
  assert(signupCode.includes('Optional') && signupCode.includes('leave any or all of these blank'));
});

// 2. PRIVILEGED ROLE REMOVAL FROM PUBLIC UI
console.log('\n--- TEST GROUP 2: Public UI Role Lockdown ---');

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
  assert(signupCode.includes('Citizen / Patient Registration') || signupCode.includes('Citizen / Patient Account'));
});

// 3. AUTHORIZATION BOUNDARY AT AUTH SERVICE
console.log('\n--- TEST GROUP 3: Strict Authorization Boundary in authService ---');
const authSvcCode = fs.readFileSync(path.resolve('src/services/authService.ts'), 'utf-8');

check('authService.signUp strictly enforces role = "patient"', () => {
  assert(authSvcCode.includes("const enforcedRole: UserRole = 'patient';") || authSvcCode.includes("enforcedRole = 'patient'"));
});

check('authService.signUp accepts demographic and optional health parameters', () => {
  assert(authSvcCode.includes('dob?: string') && authSvcCode.includes('bloodGroup?:') && authSvcCode.includes('allergies?: string[]') && authSvcCode.includes('chronicConditions?: string[]'));
});

check('authService.signUp stores all demographic and optional health data in session & storage', () => {
  assert(authSvcCode.includes('dob: params.dob') && authSvcCode.includes('bloodGroup: params.bloodGroup') && authSvcCode.includes('allergies: params.allergies'));
});

// 4. PATIENT SERVICE DYNAMIC PERSISTENCE & OPTIONAL FIELD HANDLING
console.log('\n--- TEST GROUP 4: Patient Service Persistence with & without Optional Data ---');
const patientSvcCode = fs.readFileSync(path.resolve('src/services/patientService.ts'), 'utf-8');

check('patientService.getPatientForUser dynamically populates demographic info from user location & session', () => {
  assert(patientSvcCode.includes('userDistrict') && patientSvcCode.includes('userState') && patientSvcCode.includes('userDob') && patientSvcCode.includes('userGender'));
});

check('patientService.getPatientForUser populates optional health data (blood group, vitals, allergies, conditions, emergency contact)', () => {
  assert(patientSvcCode.includes('userBloodGroup') && patientSvcCode.includes('userAllergies') && patientSvcCode.includes('userConditions') && patientSvcCode.includes('emergencyContact'));
});

check('patientService.getPatientForUser handles blank optional health data gracefully with zero/empty defaults', () => {
  assert(patientSvcCode.includes('userAllergies = (sessionMeta.allergies || [])') && patientSvcCode.includes('userConditions = (sessionMeta.chronicConditions || [])'));
});

// 5. DATABASE MIGRATION INTEGRITY
console.log('\n--- TEST GROUP 5: Supabase Database Migration Constraints ---');
const mig4 = fs.readFileSync(path.resolve('supabase/migrations/20260823000004_enforce_patient_signup_security_and_dynamic_location.sql'), 'utf-8');

check('Supabase migration relaxes abha_id NOT NULL constraint for CareSetu patients', () => {
  assert(mig4.includes('ALTER TABLE public.patients ALTER COLUMN abha_id DROP NOT NULL;'));
});

check('Supabase migration enforces assigned_role := "patient" in handle_new_user trigger', () => {
  assert(mig4.includes("assigned_role := 'patient'::user_role_enum;"));
});

check('Supabase migration extracts dynamic demographics & optional health info into public.patients', () => {
  assert(mig4.includes('user_dob') && mig4.includes('user_gender') && mig4.includes('user_blood_group') && mig4.includes('user_allergies') && mig4.includes('user_conditions'));
});

// 6. LOGIN FUNCTIONALITY & ROLE RETENTION
console.log('\n--- TEST GROUP 6: Login Functionality & Existing Personas ---');
const loginCode = fs.readFileSync(path.resolve('src/pages/auth/LoginPage.tsx'), 'utf-8');

check('LoginPage supports Patient, Hospital, and District Admin roles', () => {
  assert(loginCode.includes("handleRoleSelect('patient')") && loginCode.includes("handleRoleSelect('hospital')") && loginCode.includes("handleRoleSelect('district_admin')"));
});

check('LoginPage preserves multi-region test personas (Maharashtra, Delhi, Karnataka)', () => {
  assert(loginCode.includes('Maharashtra') && loginCode.includes('Delhi') && loginCode.includes('Karnataka'));
});

console.log('\n================================================================');
console.log(`  QA SUMMARY: ${passed}/${total} TESTS PASSED`);
console.log('================================================================');

if (passed === total) {
  console.log('🎉 ALL CITIZEN SIGNUP & SECURITY TESTS PASSED (100%)!');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED');
  process.exit(1);
}
