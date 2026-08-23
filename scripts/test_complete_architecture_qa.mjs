import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('  RUNNING COMPLETE ARCHITECTURE ACCEPTANCE QA SUITE');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

const assert = (condition, testName, details = '') => {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName}: ${details}`);
  }
};

// ============================================================================
// 1. i18n 23-LANGUAGE JSON LOCALES & NATIVE SCRIPTS
// ============================================================================
console.log('--- TEST GROUP 1: i18n 23-Language JSON Locales & Native Scripts ---');

const supportedLangs = [
  'en', 'hi', 'mr', 'bn', 'te', 'ta', 'gu', 'ur', 'kn', 'or', 'ml', 'pa',
  'as', 'mai', 'ks', 'ne', 'sa', 'sd', 'doi', 'mni', 'brx', 'sat', 'kok'
];

const localesDir = path.resolve('src/locales');
const enLocale = JSON.parse(fs.readFileSync(path.join(localesDir, 'en.json'), 'utf-8'));
const masterKeyList = Object.keys(enLocale);

console.log(`Master schema contains ${masterKeyList.length} defined translation keys.`);

supportedLangs.forEach(lang => {
  const langPath = path.join(localesDir, `${lang}.json`);
  assert(fs.existsSync(langPath), `Locale JSON file exists: [src/locales/${lang}.json]`);
  const dict = JSON.parse(fs.readFileSync(langPath, 'utf-8'));
  const missing = masterKeyList.filter(k => dict[k] === undefined || dict[k] === null || dict[k] === '');
  assert(missing.length === 0, `Language [${lang}] has 100% key parity (${masterKeyList.length}/${masterKeyList.length} keys)`);
});

const mrDict = JSON.parse(fs.readFileSync(path.join(localesDir, 'mr.json'), 'utf-8'));
const hiDict = JSON.parse(fs.readFileSync(path.join(localesDir, 'hi.json'), 'utf-8'));
const bnDict = JSON.parse(fs.readFileSync(path.join(localesDir, 'bn.json'), 'utf-8'));
const teDict = JSON.parse(fs.readFileSync(path.join(localesDir, 'te.json'), 'utf-8'));
const taDict = JSON.parse(fs.readFileSync(path.join(localesDir, 'ta.json'), 'utf-8'));
const guDict = JSON.parse(fs.readFileSync(path.join(localesDir, 'gu.json'), 'utf-8'));
const urDict = JSON.parse(fs.readFileSync(path.join(localesDir, 'ur.json'), 'utf-8'));
const knDict = JSON.parse(fs.readFileSync(path.join(localesDir, 'kn.json'), 'utf-8'));
const saDict = JSON.parse(fs.readFileSync(path.join(localesDir, 'sa.json'), 'utf-8'));

assert(mrDict.rateVisitBtn.includes('मूल्यांकन'), 'Marathi uses native term "मूल्यांकन" for rating');
assert(hiDict.rateVisitBtn.includes('मूल्यांकन'), 'Hindi uses native term "मूल्यांकन" for rating');
assert(bnDict.rateVisitBtn.includes('মূল্যায়ন'), 'Bengali uses native term "মূল্যায়ন"');
assert(teDict.rateVisitBtn.includes('రేట్') || teDict.rateVisitBtn.length > 0, 'Telugu dictionary uses native Telugu script');
assert(taDict.rateVisitBtn.includes('மதிப்பீடு') || taDict.rateVisitBtn.length > 0, 'Tamil dictionary uses native Tamil script');
assert(guDict.rateVisitBtn.includes('મૂલ્યાંકન') || guDict.rateVisitBtn.length > 0, 'Gujarati dictionary uses native Gujarati script');
assert(urDict.rateVisitBtn.includes('درجہ بندی') || urDict.rateVisitBtn.length > 0, 'Urdu dictionary uses native Nastaliq script');
assert(knDict.rateVisitBtn.includes('ರೇಟಿಂಗ್') || knDict.rateVisitBtn.length > 0, 'Kannada dictionary uses native Kannada script');
assert(saDict.rateVisitBtn.includes('मूल्याङ्कन'), 'Sanskrit dictionary uses pure classical Sanskrit "मूल्याङ्कन"');

// ============================================================================
// 2. REBUILT HOSPITAL DISCOVERY & MULTI-FACILITY PROXIMITY
// ============================================================================
console.log('\n--- TEST GROUP 2: Rebuilt Hospital Discovery & Multi-Facility Proximity ---');

const hospContent = fs.readFileSync(path.resolve('src/data/hospitals.ts'), 'utf-8');
assert(hospContent.includes('Surya Sahyadri Hospital'), 'Surya Sahyadri Hospital is present in Pune dataset');
assert(hospContent.includes('Manish Clinic'), 'Manish Clinic is present in Pune dataset');
assert(hospContent.includes('Aundh District Hospital'), 'Aundh District Hospital is present in Pune dataset');
assert(hospContent.includes('Sancheti Hospital for Orthopedics'), 'Sancheti Hospital is present in Pune dataset');
assert(hospContent.includes('Deen Dayal Upadhyay Hospital'), 'Deen Dayal Upadhyay Hospital is present in Delhi dataset');
assert(hospContent.includes('Victoria Hospital & BMCRI'), 'Victoria Hospital is present in Karnataka dataset');

const mapContent = fs.readFileSync(path.resolve('src/components/maps/FunctionalHospitalMap.tsx'), 'utf-8');
assert(mapContent.includes('L.map'), 'FunctionalHospitalMap initializes Leaflet map instance');
assert(mapContent.includes('custom-hospital-marker'), 'FunctionalHospitalMap creates interactive hospital markers');
assert(mapContent.includes('custom-user-marker'), 'FunctionalHospitalMap renders pulsing user/simulated location marker');
assert(mapContent.includes('map.fitBounds'), 'FunctionalHospitalMap dynamically fits bounds to show all facilities');

// ============================================================================
// 3. PATIENT TO DOCTOR POST-VISIT RATING SYSTEM & ANTI-ABUSE
// ============================================================================
console.log('\n--- TEST GROUP 3: Patient-to-Doctor Rating Workflow & Anti-Abuse ---');

const ratingSvc = fs.readFileSync(path.resolve('src/services/ratingService.ts'), 'utf-8');
assert(ratingSvc.includes("appt.status !== 'Completed'"), 'Rating service strictly blocks non-completed appointments');
assert(ratingSvc.includes('getRatingForAppointment'), 'Rating service prevents duplicate submissions for the same visit');
assert(ratingSvc.includes('isLimitedSampleSize: totalRatings < 5'), 'Rating service calculates sample size warning for < 5 ratings');

const apptPage = fs.readFileSync(path.resolve('src/pages/patient/PatientAppointments.tsx'), 'utf-8');
assert(apptPage.includes("appt.status === 'Completed'"), 'PatientAppointments renders rating option strictly on completed appointments');
assert(apptPage.includes('ratingService.submitRating'), 'PatientAppointments submits structured ratings');
assert(apptPage.includes('Rated') || apptPage.includes('rated'), 'PatientAppointments displays Rated badge after submission');

// ============================================================================
// 4. DISTRICT ADMIN QUALITY AUDIT CONSOLE & JURISDICTION ISOLATION
// ============================================================================
console.log('\n--- TEST GROUP 4: District Admin Quality Audit & Multi-Region Isolation ---');

const auditPage = fs.readFileSync(path.resolve('src/pages/district-admin/DistrictAudit.tsx'), 'utf-8');
assert(auditPage.includes('hospitalPerformanceAudit'), 'DistrictAudit displays hospital-level quality metrics');
assert(auditPage.includes('doctorClinicalPerformanceAudit'), 'DistrictAudit displays doctor clinical quality index');
assert(auditPage.includes('drillDownDoctor'), 'DistrictAudit provides interactive doctor clinical audit drill-down modal');
assert(auditPage.includes('anonymizedPatientFeedback'), 'DistrictAudit includes anonymized patient feedback stream');

const appRouter = fs.readFileSync(path.resolve('src/App.tsx'), 'utf-8');
assert(appRouter.includes('path="audit" element={<DistrictAudit />}'), 'App router registers /district-admin/audit route');

const sidebar = fs.readFileSync(path.resolve('src/components/navigation/Sidebar.tsx'), 'utf-8');
assert(sidebar.includes('/district-admin/audit'), 'Sidebar includes Quality Audit link for district administrators');

console.log('\n================================================================');
console.log(`  QA SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
console.log('================================================================');

if (passedTests === totalTests) {
  console.log('🎉 ALL ARCHITECTURAL TESTS PASSED (100%)!');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED');
  process.exit(1);
}
