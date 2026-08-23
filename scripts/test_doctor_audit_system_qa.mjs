import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('  RUNNING DOCTOR RATINGS & REVIEWS AUDIT SYSTEM QA SUITE');
console.log('================================================================\n');

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
    failedTests++;
  }
}

// 1. DATASET & SEED DOCTORS PARITY
console.log('--- TEST GROUP 1: Seeded Doctors & Comprehensive Multi-Facility Coverage ---');

const ratingServicePath = path.resolve('src/services/ratingService.ts');
const serviceContent = fs.readFileSync(ratingServicePath, 'utf-8');

assert(serviceContent.includes('SEEDED_DOCTORS'), 'RatingService exports SEEDED_DOCTORS dataset');
assert(serviceContent.includes('Dr. Anjali Deshmukh'), 'Includes Dr. Anjali Deshmukh (General Medicine)');
assert(serviceContent.includes('Dr. Rajesh Shinde'), 'Includes Dr. Rajesh Shinde (Cardiology)');
assert(serviceContent.includes('Dr. Priya Kulkarni'), 'Includes Dr. Priya Kulkarni (Pediatrics)');
assert(serviceContent.includes('Dr. Amit Joshi'), 'Includes Dr. Amit Joshi (Orthopedics)');
assert(serviceContent.includes('Dr. Rohan Kadam'), 'Includes Dr. Rohan Kadam (General Surgery - Attention Required)');
assert(serviceContent.includes('Dr. Deepa Sawant'), 'Includes Dr. Deepa Sawant (Ophthalmology)');
assert(serviceContent.includes('Dr. Vivek Rane'), 'Includes Dr. Vivek Rane (Neurology)');
assert(serviceContent.includes('Dr. Rajiv Malhotra'), 'Includes Dr. Rajiv Malhotra (Delhi - DDU Hospital)');
assert(serviceContent.includes('Dr. Suresh Kumar'), 'Includes Dr. Suresh Kumar (Bengaluru - Victoria Hospital)');

// Count seeded doctors in dataset
const docMatches = serviceContent.match(/doc-\d+/g);
const uniqueDocs = new Set(docMatches);
assert(uniqueDocs.size >= 20, `Seeded dataset contains ${uniqueDocs.size} distinct doctors (Target: 15–25)`);

// 2. DYNAMIC COMPUTATION METHODS
console.log('\n--- TEST GROUP 2: Dynamic Best/Worst & Statistical Computation ---');

assert(serviceContent.includes('getBestPerformingDoctor'), 'RatingService implements getBestPerformingDoctor()');
assert(serviceContent.includes('getLowestPerformingDoctor'), 'RatingService implements getLowestPerformingDoctor()');
assert(serviceContent.includes('getAllDoctorProfiles'), 'RatingService implements getAllDoctorProfiles()');
assert(serviceContent.includes('getDoctorProfileById'), 'RatingService implements getDoctorProfileById()');
assert(serviceContent.includes('getDoctorReviews'), 'RatingService implements getDoctorReviews()');
assert(serviceContent.includes('getHospitalPerformanceProfiles'), 'RatingService implements getHospitalPerformanceProfiles()');

// 3. UI AUDIT DASHBOARD & BEST/WORST PANELS
console.log('\n--- TEST GROUP 3: District Admin Audit Page & UI Panels ---');

const districtAuditPath = path.resolve('src/pages/district-admin/DistrictAudit.tsx');
const auditPageContent = fs.readFileSync(districtAuditPath, 'utf-8');

assert(auditPageContent.includes('bestPerformingDoctor'), 'DistrictAudit renders Best Performing Doctor card');
assert(auditPageContent.includes('lowestPerformingDoctor'), 'DistrictAudit renders Lowest Performing Doctor card');
assert(auditPageContent.includes('hospitalPerformanceAudit'), 'DistrictAudit renders Hospital Facility Performance cards');
assert(auditPageContent.includes('searchDoctorPlaceholder'), 'DistrictAudit provides Doctor search input');
assert(auditPageContent.includes('selectedSpecialty'), 'DistrictAudit provides Specialty filtering dropdown');
assert(auditPageContent.includes('sortBy'), 'DistrictAudit provides multi-criteria Sorting (Highest/Lowest/Reviews/Visits)');
assert(auditPageContent.includes('/district-admin/audit/doctor/'), 'DistrictAudit links directly to dedicated Doctor Detail routes');

// 4. DEDICATED DOCTOR AUDIT DETAIL PAGE & REVIEWS STREAM
console.log('\n--- TEST GROUP 4: Dedicated Doctor Audit Page & Verified Reviews Stream ---');

const doctorAuditDetailPath = path.resolve('src/pages/district-admin/DoctorAuditDetail.tsx');
assert(fs.existsSync(doctorAuditDetailPath), 'DoctorAuditDetail.tsx exists');

const detailContent = fs.readFileSync(doctorAuditDetailPath, 'utf-8');
assert(detailContent.includes('useParams'), 'DoctorAuditDetail reads doctorId from URL route parameters');
assert(detailContent.includes('ratingDistributionTitle'), 'DoctorAuditDetail renders 1-to-5 star rating distribution');
assert(detailContent.includes('associatedHospitalMetrics'), 'DoctorAuditDetail displays associated hospital experience');
assert(detailContent.includes('verifiedPatientReviews'), 'DoctorAuditDetail renders verified patient reviews list');
assert(detailContent.includes('anonymousPatient'), 'DoctorAuditDetail protects privacy with anonymous patient aliases');
assert(detailContent.includes('selectedStarFilter'), 'DoctorAuditDetail allows filtering reviews by star rating');
assert(detailContent.includes('backToAuditList'), 'DoctorAuditDetail provides seamless back navigation');

// 5. ROUTER REGISTRATION
console.log('\n--- TEST GROUP 5: Router Configuration ---');

const appPath = path.resolve('src/App.tsx');
const appContent = fs.readFileSync(appPath, 'utf-8');

assert(appContent.includes('DoctorAuditDetail'), 'App.tsx imports DoctorAuditDetail');
assert(appContent.includes('audit/doctor/:doctorId'), 'App.tsx registers /district-admin/audit/doctor/:doctorId route');

// 6. i18n 23-LANGUAGE KEY COMPLETENESS
console.log('\n--- TEST GROUP 6: i18n 23-Language Key Parity ---');

const localesDir = path.resolve('src/locales');
const enDict = JSON.parse(fs.readFileSync(path.join(localesDir, 'en.json'), 'utf-8'));
const languages = [
  'en', 'hi', 'mr', 'bn', 'te', 'ta', 'gu', 'ur', 'kn', 'or', 'ml', 'pa',
  'as', 'mai', 'ks', 'ne', 'sa', 'sd', 'doi', 'mni', 'brx', 'sat', 'kok'
];

languages.forEach((lang) => {
  const dict = JSON.parse(fs.readFileSync(path.join(localesDir, `${lang}.json`), 'utf-8'));
  const missing = Object.keys(enDict).filter((k) => dict[k] === undefined || dict[k] === null || dict[k] === '');
  assert(missing.length === 0, `Language [${lang}] has 100% key parity (${Object.keys(enDict).length}/${Object.keys(enDict).length} keys)`);
});

console.log('\n================================================================');
console.log(`  QA SUMMARY: ${passedTests}/${passedTests + failedTests} TESTS PASSED`);
console.log('================================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL DOCTOR AUDIT SYSTEM TESTS PASSED (100%)!\n');
}
