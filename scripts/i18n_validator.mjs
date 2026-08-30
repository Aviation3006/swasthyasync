import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('  RUNNING SWASTHYASYNC HARD BUILD-TIME i18n VALIDATION SUITE');
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

console.log(`📋 Master English Schema: ${masterKeys.length} canonical translation keys.\n`);

const SUPPORTED_LANGUAGES = [
  'en', 'hi', 'mr', 'bn', 'te', 'ta', 'gu', 'ur', 'kn', 'or', 'ml', 'pa',
  'as', 'mai', 'ks', 'ne', 'sa', 'sd', 'doi', 'mni', 'brx', 'sat', 'kok'
];

let totalErrors = 0;
let totalWarnings = 0;

// Test 1: Canonical English Quality & Placeholder Audit
console.log('--- TEST 1: Canonical English Quality & Placeholder Audit ---');
masterKeys.forEach(k => {
  const val = enDict[k];
  // Value cannot be empty
  if (!val || val.trim() === '') {
    console.error(`❌ [FAIL] Key [${k}] in en.json is empty.`);
    totalErrors++;
  }
  // Value cannot equal key name if camelCase
  if (/^[a-z]+[A-Z]/.test(k) && val === k) {
    console.error(`❌ [FAIL] Key [${k}] in en.json has value equal to key name: "${val}"`);
    totalErrors++;
  }
  // Value cannot be raw camelCase ending with Title/Subtitle/Desc/Label/Tab/Btn/Col
  if (/^[a-z]+[A-Z][A-Za-z0-9]*(Title|Subtitle|Desc|Label|Tab|Col|Btn)$/.test(val)) {
    console.error(`❌ [FAIL] Key [${k}] in en.json has raw camelCase placeholder value: "${val}"`);
    totalErrors++;
  }
});
if (totalErrors === 0) {
  console.log(`✅ [PASS] All ${masterKeys.length} English keys contain real, production-quality copy.\n`);
}

// Test 2: Multi-Language Parity & Integrity (23 Locales)
console.log('--- TEST 2: Multi-Language Parity & Integrity (23 Locales) ---');
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

  const langKeys = Object.keys(langDict);
  const missingKeys = [];
  const emptyKeys = [];
  const rawKeyValues = [];
  const unexpectedKeys = langKeys.filter(k => !(k in enDict));

  masterKeys.forEach(k => {
    if (!(k in langDict)) {
      missingKeys.push(k);
    } else {
      const val = langDict[k];
      if (val === null || val === undefined || val === '') {
        emptyKeys.push(k);
      } else if (/^[a-z]+[A-Z]/.test(k) && val === k) {
        rawKeyValues.push(k);
      }
    }
  });

  if (missingKeys.length > 0) {
    console.error(`❌ [FAIL] Language [${langCode}] is missing ${missingKeys.length} keys: ${missingKeys.slice(0, 5).join(', ')}...`);
    totalErrors += missingKeys.length;
  }

  if (emptyKeys.length > 0) {
    console.error(`❌ [FAIL] Language [${langCode}] has ${emptyKeys.length} empty values: ${emptyKeys.slice(0, 5).join(', ')}...`);
    totalErrors += emptyKeys.length;
  }

  if (rawKeyValues.length > 0) {
    console.error(`❌ [FAIL] Language [${langCode}] has ${rawKeyValues.length} values equal to key names: ${rawKeyValues.slice(0, 5).join(', ')}...`);
    totalErrors += rawKeyValues.length;
  }

  if (unexpectedKeys.length > 0) {
    console.error(`❌ [FAIL] Language [${langCode}] has ${unexpectedKeys.length} unexpected keys: ${unexpectedKeys.slice(0, 5).join(', ')}...`);
    totalErrors += unexpectedKeys.length;
  }

  if (missingKeys.length === 0 && emptyKeys.length === 0 && rawKeyValues.length === 0 && unexpectedKeys.length === 0) {
    console.log(`✅ [PASS] Language [${langCode}]: 100% Complete & Synchronized (${langKeys.length}/${masterKeys.length} keys)`);
  }
});

// Test 3: Interpolation variable consistency check
console.log('\n--- TEST 3: Interpolation Variable Validation ---');
const interpolationKeys = masterKeys.filter(k => /\{[a-zA-Z0-9_]+\}/.test(enDict[k]));
console.log(`Auditing ${interpolationKeys.length} interpolation template keys...`);

SUPPORTED_LANGUAGES.forEach(langCode => {
  const langPath = path.join(localesDir, `${langCode}.json`);
  if (!fs.existsSync(langPath)) return;
  const langDict = JSON.parse(fs.readFileSync(langPath, 'utf-8'));

  interpolationKeys.forEach(k => {
    const enVars = (enDict[k].match(/\{[a-zA-Z0-9_]+\}/g) || []).sort();
    const locVal = langDict[k] || '';
    const locVars = (locVal.match(/\{[a-zA-Z0-9_]+\}/g) || []).sort();

    if (locVars.length > 0 && JSON.stringify(enVars) !== JSON.stringify(locVars)) {
      console.warn(`⚠️ [WARN] Language [${langCode}] key [${k}] variables mismatch: expected ${enVars.join(',')} but found ${locVars.join(',')}`);
      totalWarnings++;
    }
  });
});
console.log(`✅ Interpolation variable check complete.`);

console.log('\n================================================================');
console.log(`  VALIDATION SUMMARY: ${totalErrors} Errors, ${totalWarnings} Warnings`);
console.log('================================================================');

if (totalErrors > 0) {
  console.error(`❌ i18n Validation FAILED with ${totalErrors} errors.`);
  process.exit(1);
} else {
  console.log(`🎉 ALL 23 JSON LOCALE CATALOGS ARE 100% VALIDATED & PRODUCTION-READY!`);
  process.exit(0);
}
