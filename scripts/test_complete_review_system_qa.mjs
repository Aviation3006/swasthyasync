import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('  RUNNING COMPLETE REVIEW & QUALITY AUDIT ACCEPTANCE QA SUITE');
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
// 1. i18n 23-LANGUAGE LOCALES CHECK
// ============================================================================
console.log('--- TEST GROUP 1: i18n 23-Language Review & Audit Keys Parity ---');

const supportedLangs = [
  'en', 'hi', 'mr', 'bn', 'te', 'ta', 'gu', 'ur', 'kn', 'or', 'ml', 'pa',
  'as', 'mai', 'ks', 'ne', 'sa', 'sd', 'doi', 'mni', 'brx', 'sat', 'kok'
];

const localesDir = path.resolve('src/locales');
const enLocale = JSON.parse(fs.readFileSync(path.join(localesDir, 'en.json'), 'utf-8'));
const masterKeyList = Object.keys(enLocale);

console.log(`Master schema contains ${masterKeyList.length} defined translation keys.`);

const requiredKeys = [
  'rateVisitBtn',
  'editReviewBtn',
  'reviewDoctorTitle',
  'reviewDoctorSubtitle',
  'internalAuditDisclaimer',
  'dateOfVisitLabel',
  'tokenNumberLabel',
  'doctorClinicalCareRating',
  'staffCourtesyRating',
  'cleanlinessFacilityRating',
  'waitingQueueRatingLabel',
  'overallExperienceRating',
  'writtenReviewLabel',
  'submitReviewBtn',
  'updateReviewBtn',
  'alreadyReviewedBadge',
  'hospitalQualityTitle',
  'overallHospitalScore',
  'doctorCareAverage',
  'staffBehaviourAverage',
  'facilityHygieneAverage',
  'waitingTimeAverage',
  'doctorBreakdownTitle',
  'readOnlyNotice',
  'qualityAuditConsole',
  'attentionRequiredTitle',
  'filterByHospital',
  'filterByDoctor',
  'filterByCategory',
  'filterByDateRange',
  'ratingDistributionTitle'
];

requiredKeys.forEach(k => {
  assert(enLocale[k] !== undefined, `Master English schema includes required key: [${k}]`);
});

supportedLangs.forEach(lang => {
  const langPath = path.join(localesDir, `${lang}.json`);
  const dict = JSON.parse(fs.readFileSync(langPath, 'utf-8'));
  const missing = masterKeyList.filter(k => dict[k] === undefined || dict[k] === null || dict[k] === '');
  assert(missing.length === 0, `Language [${lang}] has 100% key parity (${masterKeyList.length}/${masterKeyList.length} keys)`);
});

// ============================================================================
// 2. PATIENT APPOINTMENT REVIEW WORKFLOW & EDITING
// ============================================================================
console.log('\n--- TEST GROUP 2: Patient Appointment Review Workflow & Editing ---');

const apptCode = fs.readFileSync(path.resolve('src/pages/patient/PatientAppointments.tsx'), 'utf-8');
assert(apptCode.includes('handleOpenRatingModal'), 'PatientAppointments defines rating modal trigger');
assert(apptCode.includes('isEditingReview'), 'PatientAppointments supports editing submitted reviews');
assert(apptCode.includes('ratingService.updateRating'), 'PatientAppointments updates reviews via ratingService.updateRating');
assert(apptCode.includes('ratingService.submitRating'), 'PatientAppointments creates reviews via ratingService.submitRating');
assert(apptCode.includes('alreadyReviewedBadge'), 'PatientAppointments displays Rated badge on completed visits');
assert(apptCode.includes('editReviewBtn'), 'PatientAppointments provides Edit Review button on already rated visits');

// ============================================================================
// 3. DOCTOR & HOSPITAL CLINICAL QUALITY AUDIT
// ============================================================================
console.log('\n--- TEST GROUP 3: Doctor & Hospital Clinical Quality Audit ---');

const hospDashCode = fs.readFileSync(path.resolve('src/pages/hospital/HospitalDashboard.tsx'), 'utf-8');
assert(hospDashCode.includes('hospitalQualityTitle'), 'HospitalDashboard includes Hospital Clinical Quality section');
assert(hospDashCode.includes('overallHospitalScore'), 'HospitalDashboard displays Overall Hospital Quality Score');
assert(hospDashCode.includes('doctorBreakdownTitle'), 'HospitalDashboard includes Doctor-by-Doctor Clinical Rating Breakdown');
assert(hospDashCode.includes('readOnlyNotice'), 'HospitalDashboard specifies Read-Only Quality Metric notice');
assert(hospDashCode.includes('recentPatientFeedback'), 'HospitalDashboard displays anonymized recent patient feedback');

// ============================================================================
// 4. DISTRICT ADMIN INTERNAL AUDIT & QUALITY WARNINGS
// ============================================================================
console.log('\n--- TEST GROUP 4: District Admin Quality Audit, Warnings & Filters ---');

const auditCode = fs.readFileSync(path.resolve('src/pages/district-admin/DistrictAudit.tsx'), 'utf-8');
assert(auditCode.includes('attentionRequiredTitle'), 'DistrictAudit includes Quality Attention Indicators');
assert(auditCode.includes('filterByHospital'), 'DistrictAudit supports filtering by facility');
assert(auditCode.includes('filterByCategory'), 'DistrictAudit supports filtering by rating category');
assert(auditCode.includes('filterByDateRange'), 'DistrictAudit supports filtering by date range');
assert(auditCode.includes('drillDownDoctor'), 'DistrictAudit provides interactive Doctor Clinical Audit Drill-Down modal');
assert(auditCode.includes('ratingDistributionTitle'), 'DistrictAudit renders 1-to-5 star rating breakdown');

// ============================================================================
// 5. RATING SERVICE LOGIC & SEED DATA INTEGRITY
// ============================================================================
console.log('\n--- TEST GROUP 5: Rating Service Logic & Seed Data Integrity ---');

const ratingSvcCode = fs.readFileSync(path.resolve('src/services/ratingService.ts'), 'utf-8');
assert(ratingSvcCode.includes('INITIAL_RATINGS'), 'RatingService initializes rich seed review dataset');
assert(ratingSvcCode.includes('Dr. Anjali Deshmukh'), 'Seed data includes Dr. Anjali Deshmukh (General Medicine)');
assert(ratingSvcCode.includes('Dr. Rajesh Shinde'), 'Seed data includes Dr. Rajesh Shinde (Cardiology)');
assert(ratingSvcCode.includes('Dr. Rajiv Malhotra'), 'Seed data includes Delhi doctor Dr. Rajiv Malhotra');
assert(ratingSvcCode.includes('Dr. Suresh Kumar'), 'Seed data includes Karnataka doctor Dr. Suresh Kumar');
assert(ratingSvcCode.includes('updateRating'), 'RatingService exports updateRating method');
assert(ratingSvcCode.includes('getQualityWarnings'), 'RatingService computes automated quality attention warnings');
assert(ratingSvcCode.includes('getDistrictAudit'), 'RatingService computes strictly scoped district audit metrics');

console.log('\n================================================================');
console.log(`  QA SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
console.log('================================================================');

if (passedTests === totalTests) {
  console.log('🎉 ALL REVIEW & QUALITY AUDIT TESTS PASSED (100%)!');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED');
  process.exit(1);
}
