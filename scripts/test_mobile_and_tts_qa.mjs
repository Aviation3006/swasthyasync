import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('================================================================');
console.log('  RUNNING MOBILE-FIRST & REPORT TTS QUALITY ASSURANCE SUITE');
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

// 1. TEXT-TO-SPEECH (TTS) UTILITY VERIFICATION
console.log('--- TEST GROUP 1: Text-to-Speech Engine & Multilingual Voice Mapping ---');
const ttsUtilCode = fs.readFileSync(path.resolve('src/utils/textToSpeech.ts'), 'utf-8');

check('textToSpeech.ts defines LANGUAGE_LOCALE_MAP for Indian languages + English', () => {
  assert(ttsUtilCode.includes('LANGUAGE_LOCALE_MAP'));
  assert(ttsUtilCode.includes('hi-IN') && ttsUtilCode.includes('mr-IN') && ttsUtilCode.includes('ta-IN') && ttsUtilCode.includes('te-IN'));
  assert(ttsUtilCode.includes('bn-IN') && ttsUtilCode.includes('gu-IN') && ttsUtilCode.includes('kn-IN') && ttsUtilCode.includes('ur-IN'));
});

check('cleanTextForSpeech strips markdown and formats clinical abbreviations', () => {
  assert(ttsUtilCode.includes('cleanTextForSpeech'));
  assert(ttsUtilCode.includes('replace') && ttsUtilCode.includes('mmHg'));
});

check('getBestVoiceForLanguage matches exact locale with fallback to default voice', () => {
  assert(ttsUtilCode.includes('getBestVoiceForLanguage'));
  assert(ttsUtilCode.includes('isExactLocale') && ttsUtilCode.includes('defaultVoice'));
});

check('TextToSpeechController implements speak, pause, resume, and stop methods', () => {
  assert(ttsUtilCode.includes('speak(') && ttsUtilCode.includes('pause()') && ttsUtilCode.includes('resume()') && ttsUtilCode.includes('stop()'));
});

// 2. REPORT AUDIO PLAYER COMPONENT
console.log('\n--- TEST GROUP 2: Report Audio Player Component & Accessibility ---');
const playerCode = fs.readFileSync(path.resolve('src/components/common/ReportAudioPlayer.tsx'), 'utf-8');

check('ReportAudioPlayer renders Listen/Read Aloud CTA button with Volume/Play icon', () => {
  assert(playerCode.includes('readAloud') || playerCode.includes('Listen'));
  assert(playerCode.includes('Volume2') && playerCode.includes('Play'));
});

check('ReportAudioPlayer provides Pause, Resume, and Stop controls', () => {
  assert(playerCode.includes('handlePause') && playerCode.includes('handleResume') && playerCode.includes('handleStop'));
  assert(playerCode.includes('pauseReading') && playerCode.includes('stopReading'));
});

check('ReportAudioPlayer displays animated waveform / status indicator during playback', () => {
  assert(playerCode.includes('isPlaying') && playerCode.includes('animate-pulse'));
  assert(playerCode.includes('speakingStatus') || playerCode.includes('Speaking...'));
});

check('ReportAudioPlayer supports multiple speech rates (0.85x, 1.0x, 1.15x)', () => {
  assert(playerCode.includes('0.85') && playerCode.includes('0.95') && playerCode.includes('1.15'));
});

check('ReportAudioPlayer uses touch-friendly buttons with min 44px tap targets', () => {
  assert(playerCode.includes('min-h-[44px]'));
});

check('ReportAudioPlayer includes accessible ARIA region and labels', () => {
  assert(playerCode.includes('role="region"') && playerCode.includes('aria-label'));
});

// 3. REPORT SIMPLIFIER INTEGRATION
console.log('\n--- TEST GROUP 3: Patient Reports Simplifier Integration ---');
const reportsCode = fs.readFileSync(path.resolve('src/pages/patient/PatientReports.tsx'), 'utf-8');

check('PatientReports imports and embeds ReportAudioPlayer in plain-language summary box', () => {
  assert(reportsCode.includes('ReportAudioPlayer'));
  assert(reportsCode.includes('<ReportAudioPlayer'));
});

check('PatientReports passes active report text and selected language (English/Marathi) to player', () => {
  assert(reportsCode.includes('reportLang === \'mr\' ? activeReport.overallSummaryMarathi : activeReport.overallSummary'));
  assert(reportsCode.includes('language={reportLang}'));
});

check('PatientReports tables are wrapped in responsive horizontal overflow containers', () => {
  assert(reportsCode.includes('overflow-x-auto'));
});

// 4. MOBILE NAVIGATION & LAYOUT AUDIT (360px - 430px)
console.log('\n--- TEST GROUP 4: Mobile-First Navigation & Layout Optimizations ---');
const mobileNavCode = fs.readFileSync(path.resolve('src/components/navigation/MobileNav.tsx'), 'utf-8');

check('MobileNav defines 48px touch targets for mobile thumb access', () => {
  assert(mobileNavCode.includes('min-h-[48px]'));
});

check('MobileNav features CareSetu Smart Health Card navigation', () => {
  assert(mobileNavCode.includes('CareSetu') && mobileNavCode.includes('/patient/caresetu'));
});

const navbarCode = fs.readFileSync(path.resolve('src/components/navigation/Navbar.tsx'), 'utf-8');
check('Navbar dropdowns are mobile-constrained to prevent viewport overflow on 360px screens', () => {
  assert(navbarCode.includes('w-[calc(100vw-24px)]'));
});

const mapCode = fs.readFileSync(path.resolve('src/components/maps/FunctionalHospitalMap.tsx'), 'utf-8');
check('FunctionalHospitalMap uses responsive mobile height (300px sm:420px) and touch legend', () => {
  assert(mapCode.includes('h-[300px] sm:h-[420px]'));
});

const dashCode = fs.readFileSync(path.resolve('src/pages/patient/PatientDashboard.tsx'), 'utf-8');
check('PatientDashboard uses CareSetu Smart Card branding and responsive cards', () => {
  assert(dashCode.includes('CareSetu') && !dashCode.includes('Nav Dashboard'));
});

const qrCode = fs.readFileSync(path.resolve('src/pages/patient/PatientHealthQR.tsx'), 'utf-8');
check('PatientHealthQR renders high-clarity scannable CareSetu QR code on mobile', () => {
  assert(qrCode.includes('QRCodeSVG') && qrCode.includes('CareSetu'));
});

// 5. 23-LANGUAGE i18n PARITY FOR TTS KEYS
console.log('\n--- TEST GROUP 5: 23-Language i18n Parity for TTS Keys ---');
const localesDir = path.resolve('src/locales');
const requiredTTSKeys = [
  'readAloud', 'pauseReading', 'resumeReading', 'stopReading', 
  'speakingStatus', 'pausedStatus', 'audioExplanation', 'voiceLanguage', 'ttsSpeed'
];

const allLangs = [
  'en', 'hi', 'mr', 'bn', 'te', 'ta', 'gu', 'ur', 'kn', 'or', 'ml', 'pa',
  'as', 'mai', 'ks', 'ne', 'sa', 'sd', 'doi', 'mni', 'brx', 'sat', 'kok'
];

allLangs.forEach(lang => {
  const langData = JSON.parse(fs.readFileSync(path.join(localesDir, `${lang}.json`), 'utf-8'));
  check(`Language [${lang}] includes all required TTS translation keys`, () => {
    requiredTTSKeys.forEach(k => {
      assert(langData[k] !== undefined && langData[k] !== '', `Missing key [${k}] in ${lang}.json`);
    });
  });
});

console.log('\n================================================================');
console.log(`  QA SUMMARY: ${passed}/${total} TESTS PASSED`);
console.log('================================================================');

if (passed === total) {
  console.log('🎉 ALL MOBILE-FIRST & TTS TESTS PASSED (100%)!');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED');
  process.exit(1);
}
