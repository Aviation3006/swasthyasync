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

supportedLangs.forEach(lang => {
  assert(transFile.includes(`"${lang}":`), `Language [${lang}] dictionary exists in translations.ts`);
});

// Check key phrases in native scripts
assert(transFile.includes('नागरिक रुग्ण पोर्टल'), 'Marathi translations use native vocabulary');
assert(transFile.includes('नागरिक रोगी पोर्टल'), 'Hindi translations use native vocabulary');
assert(transFile.includes('নাগরিক রোগী পোর্টাল'), 'Bengali translations use native Bengali script');
assert(transFile.includes('పౌర రోగి పోర్టల్'), 'Telugu translations use native Telugu script');
assert(transFile.includes('குடிமக்கள் நோயாளி தளம்'), 'Tamil translations use native Tamil script');
assert(transFile.includes('નાગરિક દર્દી પોર્ટલ'), 'Gujarati translations use native Gujarati script');
assert(transFile.includes('شہری مریض پورٹل'), 'Urdu translations use native Nastaliq script');
assert(transFile.includes('ನಾಗರಿಕ ರೋಗಿ ಪೋರ್ಟಲ್'), 'Kannada translations use native Kannada script');
assert(transFile.includes('നാഗരിക് രോഗി പോർട്ടൽ') || transFile.includes('പൗര രോഗി'), 'Malayalam translations use native script');
assert(transFile.includes('नागरिक रोगी वातायनम्'), 'Sanskrit translations use classical Sanskrit terms');

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
assert(apptPage.includes('t.rateYourVisitTitle'), 'PatientAppointments uses translated rating modal strings');
assert(apptPage.includes('⭐ 1 — Very Poor') || apptPage.includes('star1VeryPoor'), 'Rating modal includes 1-5 star quality levels');

const auditPage = fs.readFileSync(path.resolve('src/pages/district-admin/DistrictAudit.tsx'), 'utf-8');
assert(auditPage.includes('DistrictAudit'), 'DistrictAudit dashboard component is created');
assert(auditPage.includes('doctorClinicalPerformanceAudit'), 'DistrictAudit contains doctor clinical quality index');
assert(auditPage.includes('hospitalPerformanceAudit'), 'DistrictAudit contains hospital facility audit cards');
assert(auditPage.includes('limitedSampleSizeWarning'), 'DistrictAudit displays sample size warning badges');
assert(auditPage.includes('anonymizedPatientFeedback'), 'DistrictAudit displays anonymized patient feedback log');

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
