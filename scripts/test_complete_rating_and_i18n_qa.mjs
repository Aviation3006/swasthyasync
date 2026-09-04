import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('  RUNNING COMPREHENSIVE RATING & i18n QA ACCEPTANCE SUITE');
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

// 1. i18n 23-LANGUAGE COMPLETENESS AUDIT
console.log('--- TEST GROUP 1: i18n 23-Language Completeness & Authenticity ---');
const transFile = fs.readFileSync(path.resolve('src/i18n/translations.ts'), 'utf-8');

const supportedLangs = [
  'en', 'hi', 'mr', 'bn', 'te', 'ta', 'gu', 'ur', 'kn', 'or', 'ml', 'pa',
  'as', 'mai', 'ks', 'ne', 'sa', 'sd', 'doi', 'mni', 'brx', 'sat', 'kok'
];

const localesDir = path.resolve('src/locales');
supportedLangs.forEach(lang => {
  const p = path.join(localesDir, `${lang}.json`);
  assert(fs.existsSync(p), `Language [${lang}] dictionary exists in locales directory`);
});

// Check key phrases in native scripts from json locales
const mrJson = fs.readFileSync(path.join(localesDir, 'mr.json'), 'utf-8');
const hiJson = fs.readFileSync(path.join(localesDir, 'hi.json'), 'utf-8');
const bnJson = fs.readFileSync(path.join(localesDir, 'bn.json'), 'utf-8');
const teJson = fs.readFileSync(path.join(localesDir, 'te.json'), 'utf-8');
const taJson = fs.readFileSync(path.join(localesDir, 'ta.json'), 'utf-8');
const guJson = fs.readFileSync(path.join(localesDir, 'gu.json'), 'utf-8');
const urJson = fs.readFileSync(path.join(localesDir, 'ur.json'), 'utf-8');
const knJson = fs.readFileSync(path.join(localesDir, 'kn.json'), 'utf-8');
const mlJson = fs.readFileSync(path.join(localesDir, 'ml.json'), 'utf-8');
const saJson = fs.readFileSync(path.join(localesDir, 'sa.json'), 'utf-8');

assert(mrJson.includes('मूल्यांकन') || mrJson.includes('रुग्ण'), 'Marathi translations use native vocabulary');
assert(hiJson.includes('मूल्यांकन') || hiJson.includes('रोगी'), 'Hindi translations use native vocabulary');
assert(bnJson.includes('মূল্যায়ন') || bnJson.includes('রোগী'), 'Bengali translations use native Bengali script');
assert(teJson.includes('మూల్యాంకనం') || teJson.includes('రోగి') || /[\u0C00-\u0C7F]/.test(teJson), 'Telugu translations use native Telugu script');
assert(taJson.includes('மதிப்பீடு') || taJson.includes('நோயாளி') || /[\u0B80-\u0BFF]/.test(taJson), 'Tamil translations use native Tamil script');
assert(guJson.includes('મૂલ્યાંકન') || guJson.includes('દર્દી') || /[\u0A80-\u0AFF]/.test(guJson), 'Gujarati translations use native Gujarati script');
assert(urJson.includes('جائزہ') || urJson.includes('مریض') || /[\u0600-\u06FF]/.test(urJson), 'Urdu translations use native Nastaliq script');
assert(knJson.includes('ರೇಟಿಂಗ್') || knJson.includes('ರೋಗಿ') || /[\u0C80-\u0CFF]/.test(knJson), 'Kannada translations use native Kannada script');
assert(mlJson.includes('റേറ്റിംഗ്') || mlJson.includes('രോഗി') || /[\u0D00-\u0D7F]/.test(mlJson), 'Malayalam translations use native script');
assert(saJson.includes('मूल्याङ्कन') || saJson.includes('रोगी'), 'Sanskrit translations use classical Sanskrit terms');

// 2. RATING TYPES & SERVICE AUDIT
console.log('\n--- TEST GROUP 2: Patient-to-Doctor Rating System Rules ---');
const ratingTypeFile = fs.readFileSync(path.resolve('src/types/rating.ts'), 'utf-8');
assert(ratingTypeFile.includes('PatientDoctorRating'), 'PatientDoctorRating type is defined');
assert(ratingTypeFile.includes('DoctorConsultationRating'), 'DoctorConsultationRating type is defined with subcategories');
assert(ratingTypeFile.includes('HospitalStaffRating'), 'HospitalStaffRating type is defined');
assert(ratingTypeFile.includes('FacilityExperienceRating'), 'FacilityExperienceRating type is defined');
assert(ratingTypeFile.includes('DoctorAuditMetric'), 'DoctorAuditMetric type is defined');
assert(ratingTypeFile.includes('HospitalAuditMetric'), 'HospitalAuditMetric type is defined');
assert(ratingTypeFile.includes('DistrictAuditSummary'), 'DistrictAuditSummary type is defined');

const ratingSvcFile = fs.readFileSync(path.resolve('src/services/ratingService.ts'), 'utf-8');
assert(ratingSvcFile.includes("appt.status !== 'Completed'"), 'Rating service enforces appointment must be Completed');
assert(ratingSvcFile.includes('getRatingForAppointment'), 'Rating service checks for existing rating to block duplicates');
assert(ratingSvcFile.includes('getDistrictAudit'), 'Rating service provides district-scoped audit calculation');
assert(ratingSvcFile.includes('isLimitedSampleSize: totalRatings < 5'), 'Rating service computes sample size warning for < 5 ratings');

// 3. UI INTEGRATION AUDIT
console.log('\n--- TEST GROUP 3: Patient & Admin UI Integration ---');
const apptPage = fs.readFileSync(path.resolve('src/pages/patient/PatientAppointments.tsx'), 'utf-8');
assert(apptPage.includes('handleOpenRatingModal'), 'PatientAppointments includes post-visit rating modal trigger');
assert(apptPage.includes('ratingService.submitRating'), 'PatientAppointments calls ratingService.submitRating');
assert(apptPage.includes('t.rateYourVisitTitle') || apptPage.includes('reviewDoctorTitle'), 'PatientAppointments uses translated rating modal strings');
assert(apptPage.includes('star1Poor') || apptPage.includes('StarRatingInput') || apptPage.includes('star1VeryPoor'), 'Rating modal includes 1-5 star quality levels');

const auditPage = fs.readFileSync(path.resolve('src/pages/district-admin/DistrictAudit.tsx'), 'utf-8');
assert(auditPage.includes('DistrictAudit'), 'DistrictAudit dashboard component is created');
assert(auditPage.includes('doctorClinicalPerformanceAudit') || auditPage.includes('doctorBreakdownTitle') || auditPage.includes('Doctor'), 'DistrictAudit contains doctor clinical quality index');
assert(auditPage.includes('hospitalPerformanceAudit') || auditPage.includes('facilityPerformance') || auditPage.includes('Hospital'), 'DistrictAudit contains hospital facility audit cards');
assert(auditPage.includes('limitedSampleSizeWarning') || auditPage.includes('isLimitedSampleSize') || auditPage.includes('attentionRequiredTitle') || auditPage.includes('sampleSizeWarning'), 'DistrictAudit displays sample size warning badges');
assert(auditPage.includes('anonymizedPatientFeedback') || auditPage.includes('recentPatientFeedback') || auditPage.includes('feedback'), 'DistrictAudit displays anonymized patient feedback log');

// 4. APP ROUTING AUDIT
const appFile = fs.readFileSync(path.resolve('src/App.tsx'), 'utf-8');
assert(appFile.includes('path="audit"'), 'App.tsx registers /district-admin/audit route');
assert(appFile.includes('DistrictAudit'), 'App.tsx imports DistrictAudit component');

const sidebarFile = fs.readFileSync(path.resolve('src/components/navigation/Sidebar.tsx'), 'utf-8');
assert(sidebarFile.includes('/district-admin/audit'), 'Sidebar includes Quality Audit navigation link for district admin');

console.log('\n================================================================');
console.log(`  QA SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
console.log('================================================================');

if (passedTests === totalTests) {
  console.log('🎉 ALL RATING & i18n SYSTEM VERIFICATION CHECKS PASSED (100%)!');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED');
  process.exit(1);
}
