import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('================================================================');
console.log('  RUNNING CARESETU PROPRIETARY SMART HEALTH CARD QA SUITE');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function check(desc, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ [PASS] ${desc}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] ${desc}: ${err.message}`);
  }
}

// 1. DATA CONTRACT & SEEDED CARESETU IDENTITY
console.log('--- TEST GROUP 1: Proprietary CareSetu Identity & Seed Data ---');

const patientTypes = fs.readFileSync(path.resolve('src/types/patient.ts'), 'utf-8');
check('Patient interface defines careSetuId', () => {
  assert(patientTypes.includes('careSetuId?: string'));
});
check('Patient interface defines careSetuStatus', () => {
  assert(patientTypes.includes('careSetuStatus?:'));
});

const patientsData = fs.readFileSync(path.resolve('src/data/patients.ts'), 'utf-8');
check('Rameshwar B. Jadhav has CareSetu ID CSU-IND-PUN-00018427', () => {
  assert(patientsData.includes("careSetuId: 'CSU-IND-PUN-00018427'"));
});
check('Priya Shinde has CareSetu ID CSU-IND-PUN-00024190', () => {
  assert(patientsData.includes("careSetuId: 'CSU-IND-PUN-00024190'"));
});

const patientSvc = fs.readFileSync(path.resolve('src/services/patientService.ts'), 'utf-8');
check('patientService exports getPatientByCareSetuId', () => {
  assert(patientSvc.includes('getPatientByCareSetuId'));
});
check('patientService exports ensureCareSetuId', () => {
  assert(patientSvc.includes('ensureCareSetuId'));
});

// 2. PATIENT CARESETU SMART HEALTH CARD UI
console.log('\n--- TEST GROUP 2: CareSetu Smart Health Card Page & Presentation ---');

const cardPage = fs.readFileSync(path.resolve('src/pages/patient/PatientHealthQR.tsx'), 'utf-8');
check('Card page uses title "CareSetu"', () => {
  assert(cardPage.includes('title="CareSetu"'));
});
check('Card page presents CareSetu ID', () => {
  assert(cardPage.includes('careSetuId'));
});
check('Card page renders CareSetu Secure QR Gateway', () => {
  assert(cardPage.includes('CareSetu Secure QR') || cardPage.includes('secureQrPayload'));
});
check('Card page includes "How CareSetu Works" guide', () => {
  assert(cardPage.includes('howCareSetuWorks') || cardPage.includes('How CareSetu Works'));
});
check('Card page includes Privacy & Emergency Access Controls', () => {
  assert(cardPage.includes('CareSetu Privacy & Access Controls') || cardPage.includes('ToggleSwitch'));
});

// 3. DOCTOR & HOSPITAL STAFF RECORD EXPERIENCE
console.log('\n--- TEST GROUP 3: Doctor Scan & Dedicated Patient Record Experience ---');

const hospDash = fs.readFileSync(path.resolve('src/pages/hospital/HospitalDashboard.tsx'), 'utf-8');
check('Hospital Dashboard provides "Scan CareSetu QR" action', () => {
  assert(hospDash.includes('scanCareSetuBtn') || hospDash.includes('Scan CareSetu QR'));
});
check('Hospital Dashboard includes CareSetu Scanner & Demo Modal', () => {
  assert(hospDash.includes('scanCareSetuTitle') || hospDash.includes('Scan CareSetu Smart Health Card'));
  assert(hospDash.includes('CSU-IND-PUN-00018427'));
});

const recordPage = fs.readFileSync(path.resolve('src/pages/hospital/CareSetuPatientRecord.tsx'), 'utf-8');
check('Dedicated CareSetuPatientRecord component exists', () => {
  assert(recordPage.includes('CareSetuPatientRecord'));
});
check('CareSetuPatientRecord enforces Authorized Healthcare Access Notice', () => {
  assert(recordPage.includes('Authorized Healthcare Access Only'));
});
check('CareSetuPatientRecord displays session audit details', () => {
  assert(recordPage.includes('auditTimestamp') || recordPage.includes('SES-2026-0823-842'));
});
check('CareSetuPatientRecord renders clinical tabs (Overview, History, Reports, Prescriptions, Visits, Emergency)', () => {
  assert(recordPage.includes('overview') && recordPage.includes('history') && recordPage.includes('reports') && recordPage.includes('prescriptions') && recordPage.includes('appointments') && recordPage.includes('emergency'));
});

// 4. ROUTER & NAVIGATION
console.log('\n--- TEST GROUP 4: Routes & Portal Navigation ---');

const appRouter = fs.readFileSync(path.resolve('src/App.tsx'), 'utf-8');
check('Router registers /patient/health-qr route', () => {
  assert(appRouter.includes('path="health-qr" element={<PatientHealthQR />}'));
});
check('Router registers /patient/caresetu alias route', () => {
  assert(appRouter.includes('path="caresetu" element={<PatientHealthQR />}'));
});
check('Router registers /hospital/caresetu route', () => {
  assert(appRouter.includes('path="caresetu" element={<CareSetuPatientRecord />}'));
});
check('Router registers /hospital/caresetu-record/:careSetuId route', () => {
  assert(appRouter.includes('path="caresetu-record/:careSetuId" element={<CareSetuPatientRecord />}'));
});

const sidebar = fs.readFileSync(path.resolve('src/components/navigation/Sidebar.tsx'), 'utf-8');
check('Sidebar includes CareSetu navigation for patient and hospital', () => {
  assert(sidebar.includes('navHealthQR') && sidebar.includes('/hospital/caresetu'));
});

// 5. 23-LANGUAGE i18n & REBRANDING
console.log('\n--- TEST GROUP 5: i18n 23-Language CareSetu Parity ---');

const localesDir = path.resolve('src/locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const caresetuKeys = [
  'navHealthQR',
  'smartHealthCard',
  'smartHealthCardQR',
  'careSetuId',
  'careSetuCard',
  'scanCareSetuBtn',
  'scanCareSetuTitle',
  'howCareSetuWorks',
  'openDemoCareSetuRecord'
];

files.forEach(f => {
  const lang = f.replace('.json', '');
  const data = JSON.parse(fs.readFileSync(path.join(localesDir, f), 'utf-8'));
  check(`Language [${lang}] has synchronized CareSetu keys`, () => {
    caresetuKeys.forEach(k => {
      assert(data[k] !== undefined && data[k] !== null && data[k] !== '', `Missing key [${k}] in ${lang}`);
    });
  });
});

console.log('\n================================================================');
console.log(`  QA SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
console.log('================================================================');

if (passedTests === totalTests) {
  console.log('🎉 ALL CARESETU SMART HEALTH CARD TESTS PASSED (100%)!');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED');
  process.exit(1);
}
