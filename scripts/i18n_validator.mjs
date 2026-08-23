import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('  RUNNING SWASTHYASYNC JSON LOCALES (i18n) VALIDATOR');
console.log('================================================================\n');

const localesDir = path.resolve('src/locales');
if (!fs.existsSync(localesDir)) {
  console.error(`❌ Locales directory not found at ${localesDir}`);
  process.exit(1);
}

const enPath = path.join(localesDir, 'en.json');
if (!fs.existsSync(enPath)) {
  console.error(`❌ Master English locale file not found at ${enPath}`);
  process.exit(1);
}

const enDict = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
const masterKeys = Object.keys(enDict);

console.log(`📋 Master English Schema: ${masterKeys.length} defined translation keys.\n`);

const SUPPORTED_LANGUAGES = [
  'en', 'hi', 'mr', 'bn', 'te', 'ta', 'gu', 'ur', 'kn', 'or', 'ml', 'pa',
  'as', 'mai', 'ks', 'ne', 'sa', 'sd', 'doi', 'mni', 'brx', 'sat', 'kok'
];

let totalErrors = 0;
let totalChecked = 0;

SUPPORTED_LANGUAGES.forEach(langCode => {
  const langPath = path.join(localesDir, `${langCode}.json`);
  if (!fs.existsSync(langPath)) {
    console.error(`❌ [FAIL] Missing locale JSON file: [${langCode}.json]`);
    totalErrors++;
    return;
  }

  let langDict;
  try {
    langDict = JSON.parse(fs.readFileSync(langPath, 'utf-8'));
  } catch (e) {
    console.error(`❌ [FAIL] Corrupted JSON in [${langCode}.json]: ${e.message}`);
    totalErrors++;
    return;
  }

  const missingKeys = [];
  masterKeys.forEach(key => {
    totalChecked++;
    if (langDict[key] === undefined || langDict[key] === null || langDict[key] === '') {
      missingKeys.push(key);
    }
  });

  if (missingKeys.length > 0) {
    console.error(`❌ [FAIL] Language [${langCode}] is missing ${missingKeys.length} keys: ${missingKeys.slice(0, 5).join(', ')}...`);
    totalErrors += missingKeys.length;
  } else {
    console.log(`✅ [PASS] Language [${langCode}]: 100% Complete (${masterKeys.length}/${masterKeys.length} keys)`);
  }
});

console.log('\n================================================================');
console.log(`  VALIDATION SUMMARY: ${SUPPORTED_LANGUAGES.length} Languages Checked (${totalChecked} key tests)`);
console.log('================================================================');

if (totalErrors === 0) {
  console.log('🎉 ALL 23 JSON LOCALE DICTIONARIES ARE 100% COMPLETE & SYNCHRONIZED!');
  process.exit(0);
} else {
  console.error(`❌ VALIDATION FAILED with ${totalErrors} translation errors.`);
  process.exit(1);
}
