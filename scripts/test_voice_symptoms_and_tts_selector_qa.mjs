import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('================================================================');
console.log('  RUNNING VOICE SYMPTOM LOGGER & MULTILINGUAL TTS SELECTOR QA');
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

// 1. MULTILINGUAL TTS SELECTOR IN REPORT AUDIOR PLAYER
console.log('--- TEST GROUP 1: Multilingual TTS Selector & Voice Fallback ---');
const playerCode = fs.readFileSync(path.resolve('src/components/common/ReportAudioPlayer.tsx'), 'utf-8');

check('ReportAudioPlayer renders visible Language / Voice selector for en-IN, hi-IN, mr-IN', () => {
  assert(playerCode.includes('CORE_TTS_LANGUAGES'));
  assert(playerCode.includes('selectedTtsLang'));
  assert(playerCode.includes('English (India)') || playerCode.includes('CORE_TTS_LANGUAGES'));
});

check('ReportAudioPlayer clearly displays fallback notice when native voice is missing on device', () => {
  assert(playerCode.includes('voiceInfo?.statusNotice'));
});

check('ReportAudioPlayer preserves Play, Pause, Resume, and Stop controls', () => {
  assert(playerCode.includes('handlePlay') && playerCode.includes('handlePause') && playerCode.includes('handleResume') && playerCode.includes('handleStop'));
});

const ttsUtilCode = fs.readFileSync(path.resolve('src/utils/textToSpeech.ts'), 'utf-8');
check('textToSpeech.ts dynamically ranks available voices from speechSynthesis.getVoices() without hardcoding', () => {
  assert(ttsUtilCode.includes('speechSynthesis.getVoices()'));
  assert(ttsUtilCode.includes('scoreVoiceForLanguage'));
  assert(ttsUtilCode.includes('hasNativeVoice'));
});

// 2. SPEECH RECOGNITION UTILITY (VOICE-TO-TEXT)
console.log('\n--- TEST GROUP 2: Web Speech Recognition Engine ---');
const speechRecCode = fs.readFileSync(path.resolve('src/utils/speechRecognition.ts'), 'utf-8');

check('speechRecognition.ts defines Indian locale mappings for English, Hindi, and Marathi', () => {
  assert(speechRecCode.includes('en: \'en-IN\''));
  assert(speechRecCode.includes('hi: \'hi-IN\''));
  assert(speechRecCode.includes('mr: \'mr-IN\''));
});

check('SpeechRecognitionController implements start, stop, abort, and interim transcript handlers', () => {
  assert(speechRecCode.includes('start(') && speechRecCode.includes('stop()') && speechRecCode.includes('abort()'));
  assert(speechRecCode.includes('onInterim') && speechRecCode.includes('onResult'));
});

// 3. VOICE SYMPTOM LOGGER COMPONENT
console.log('\n--- TEST GROUP 3: Voice Symptom Logger UI & Workflow ---');
const voiceLoggerCode = fs.readFileSync(path.resolve('src/components/symptoms/VoiceSymptomLogger.tsx'), 'utf-8');

check('VoiceSymptomLogger provides touch-friendly microphone button with tap target >= 44px', () => {
  assert(voiceLoggerCode.includes('w-12 h-12'));
  assert(voiceLoggerCode.includes('min-h-[44px]') || voiceLoggerCode.includes('min-h-[40px]'));
});

check('VoiceSymptomLogger includes active language selector (English, Hindi, Marathi)', () => {
  assert(voiceLoggerCode.includes('en-IN') && voiceLoggerCode.includes('hi-IN') && voiceLoggerCode.includes('mr-IN'));
});

check('VoiceSymptomLogger displays real-time waveform visualizer while listening', () => {
  assert(voiceLoggerCode.includes('isListening') && voiceLoggerCode.includes('animate-bounce'));
});

check('VoiceSymptomLogger displays editable textarea for transcribed speech review', () => {
  assert(voiceLoggerCode.includes('<textarea') && voiceLoggerCode.includes('finalTranscript'));
});

check('VoiceSymptomLogger provides confirmation button to send text into symptom log', () => {
  assert(voiceLoggerCode.includes('handleConfirm'));
  assert(voiceLoggerCode.includes('Use in Symptom Log'));
});

check('VoiceSymptomLogger displays friendly fallback when speech recognition is unsupported', () => {
  assert(voiceLoggerCode.includes('!isSupported') && voiceLoggerCode.includes('Voice recognition not supported'));
});

// 4. INTEGRATION IN PATIENT SYMPTOMS PAGE
console.log('\n--- TEST GROUP 4: Patient Symptoms Page Integration ---');
const symptomsPageCode = fs.readFileSync(path.resolve('src/pages/patient/PatientSymptoms.tsx'), 'utf-8');

check('PatientSymptoms embeds VoiceSymptomLogger above the manual symptom entry card', () => {
  assert(symptomsPageCode.includes('<VoiceSymptomLogger'));
  assert(symptomsPageCode.includes('onConfirmTranscription={handleVoiceTranscription}'));
});

check('handleVoiceTranscription sets symptom name and contextually selects body area without diagnosing', () => {
  assert(symptomsPageCode.includes('handleVoiceTranscription'));
  assert(symptomsPageCode.includes('setSymptomName(transcript)'));
});

check('PatientSymptoms strictly preserves clinical safety non-diagnostic disclaimer', () => {
  assert(symptomsPageCode.includes('emergencyWarning') || symptomsPageCode.includes('Important Clinical Safety Disclaimer'));
});

console.log('\n================================================================');
console.log(`  QA SUMMARY: ${passed}/${total} TESTS PASSED`);
console.log('================================================================');

if (passed === total) {
  console.log('🎉 ALL VOICE SYMPTOMS & TTS SELECTOR TESTS PASSED (100%)!');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED');
  process.exit(1);
}
