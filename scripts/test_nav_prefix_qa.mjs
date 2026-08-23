import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('================================================================');
console.log('  VERIFYING REMOVAL OF "NAV " PREFIX BUG ACROSS ALL 23 LANGUAGES');
console.log('================================================================\n');

const localesDir = path.resolve('src/locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

let passed = 0;
let total = 0;

const testKeys = [
  'navDashboard',
  'navProfile',
  'navRecords',
  'navAppointments',
  'navSymptoms',
  'navReports',
  'navHealthQR',
  'navNotifications',
  'navSettings',
  'navHospitalCommand',
  'navPatientDirectory',
  'navHospitalAppointments',
  'navLiveQueue',
  'navPrescriptions',
  'navDiagnosticReports',
  'navDistrictCommand',
  'navHospitalNetwork',
  'navDistrictAnalytics',
  'navAudit',
  'navHealthReports',
  'navEmergencyAlerts'
];

files.forEach(f => {
  const lang = f.replace('.json', '');
  const data = JSON.parse(fs.readFileSync(path.join(localesDir, f), 'utf-8'));
  
  testKeys.forEach(k => {
    total++;
    const val = data[k];
    const hasNavPrefix = typeof val === 'string' && (val.startsWith('Nav ') || val.includes('Nav '));
    if (!hasNavPrefix && val && val.trim().length > 0) {
      passed++;
    } else {
      console.error(`❌ [FAIL] ${lang}.${k} has unwanted prefix or is empty: "${val}"`);
    }
  });
});

console.log(`\nChecked ${total} navigation translations across ${files.length} languages.`);
console.log(`Passed: ${passed}/${total}`);

if (passed === total) {
  console.log('🎉 ZERO "NAV " PREFIXES FOUND! All navigation labels are clean and authentic.');
} else {
  process.exit(1);
}
