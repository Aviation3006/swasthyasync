import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { analyzeVoiceSymptomTranscript } from '../server/geminiService.ts';

console.log('================================================================');
console.log('  RUNNING VOICE SYMPTOM LOGGER DASHBOARD & GEMINI AI QA SUITE');
console.log('================================================================\n');

let passed = 0;
let total = 0;

async function check(title, fn) {
  total++;
  try {
    await fn();
    console.log(`✅ [PASS] ${title}`);
    passed++;
  } catch (err) {
    console.error(`❌ [FAIL] ${title}: ${err.message}`);
  }
}

async function runTests() {
  // 1. ROUTING & NAVIGATION
  console.log('--- TEST GROUP 1: Routing & App Navigation ---');
  const appCode = fs.readFileSync(path.resolve('src/App.tsx'), 'utf-8');
  await check('App router imports VoiceSymptomDashboard component', () => {
    assert(appCode.includes('VoiceSymptomDashboard'));
  });
  await check('App router registers dedicated /patient/symptoms/voice route', () => {
    assert(appCode.includes('path="symptoms/voice" element={<VoiceSymptomDashboard />}'));
  });

  const patSymptoms = fs.readFileSync(path.resolve('src/pages/patient/PatientSymptoms.tsx'), 'utf-8');
  await check('PatientSymptoms page provides direct link to Voice Symptom Logger Dashboard', () => {
    assert(patSymptoms.includes('/patient/symptoms/voice'));
  });

  const patDash = fs.readFileSync(path.resolve('src/pages/patient/PatientDashboard.tsx'), 'utf-8');
  await check('PatientDashboard quick actions links to Voice Symptom Logger', () => {
    assert(patDash.includes('/patient/symptoms/voice'));
  });

  // 2. COMPONENT ARCHITECTURE & CLEAN DECOUPLING
  console.log('\n--- TEST GROUP 2: Component Architecture ---');
  const dashboardCode = fs.readFileSync(path.resolve('src/pages/patient/VoiceSymptomDashboard.tsx'), 'utf-8');
  await check('VoiceSymptomDashboard integrates PageHeader with exact user-requested title and subtitle', () => {
    assert(dashboardCode.includes('Voice Symptom Logger'));
    assert(dashboardCode.includes("Describe how you're feeling naturally"));
  });

  await check('VoiceSymptomDashboard integrates all modular symptom presentation components', () => {
    assert(dashboardCode.includes('SpeechRecognitionButton'));
    assert(dashboardCode.includes('SymptomTranscriptEditor'));
    assert(dashboardCode.includes('ClinicalOverviewCard'));
    assert(dashboardCode.includes('StructuredSymptomsList'));
    assert(dashboardCode.includes('SuggestedQuestionsCard'));
    assert(dashboardCode.includes('MissingInformationCard'));
  });

  // 3. SPEECH RECOGNITION & MULTI-LANGUAGE
  console.log('\n--- TEST GROUP 3: Multi-Language Speech Recognition & Fallbacks ---');
  const speechBtnCode = fs.readFileSync(path.resolve('src/components/symptoms/SpeechRecognitionButton.tsx'), 'utf-8');
  await check('SpeechRecognitionButton supports English (India), Hindi, and Marathi selectors', () => {
    assert(speechBtnCode.includes('en-IN') && speechBtnCode.includes('English (India)'));
    assert(speechBtnCode.includes('hi-IN') && speechBtnCode.includes('हिन्दी'));
    assert(speechBtnCode.includes('mr-IN') && speechBtnCode.includes('मराठी'));
  });

  await check('SpeechRecognitionButton provides clear fallback notice when speech recognition is unsupported', () => {
    assert(speechBtnCode.includes("Voice input isn't supported on this device. You can type your symptoms"));
  });

  // 4. TRANSCRIPT REVIEW & EDITING
  console.log('\n--- TEST GROUP 4: Transcript Review & Edit Capabilities ---');
  const editorCode = fs.readFileSync(path.resolve('src/components/symptoms/SymptomTranscriptEditor.tsx'), 'utf-8');
  await check('SymptomTranscriptEditor includes editable textarea with character counter and Clear action', () => {
    assert(editorCode.includes('Your Symptom Description'));
    assert(editorCode.includes('charCount'));
    assert(editorCode.includes('Clear'));
    assert(editorCode.includes('Analyze Symptoms'));
  });

  // 5. GEMINI STRUCTURED EXTRACTION & NON-HALLUCINATION
  console.log('\n--- TEST GROUP 5: Gemini Structured AI Extraction & Truthfulness ---');
  const aiTypes = fs.readFileSync(path.resolve('src/types/ai.ts'), 'utf-8');
  await check('src/types/ai.ts declares VoiceSymptomAnalysisOutput and StructuredSymptomItem', () => {
    assert(aiTypes.includes('export interface VoiceSymptomAnalysisOutput'));
    assert(aiTypes.includes('export interface StructuredSymptomItem'));
  });

  const geminiCode = fs.readFileSync(path.resolve('server/geminiService.ts'), 'utf-8');
  await check('server/geminiService.ts enforces "Not mentioned" default for unstated fields', () => {
    assert(geminiCode.includes('Not mentioned'));
    assert(geminiCode.includes('DO NOT invent, assume, or hallucinate'));
  });

  // Test actual execution of analyzeVoiceSymptomTranscript
  await check('analyzeVoiceSymptomTranscript extracts structured schema without throwing', async () => {
    const output = await analyzeVoiceSymptomTranscript({
      transcript: 'I have had a headache since yesterday and I feel slightly dizzy.',
      language: 'en-IN'
    });
    assert(output.clinicalOverview, 'Must have clinicalOverview');
    assert(Array.isArray(output.symptoms) && output.symptoms.length > 0, 'Must have extracted symptoms');
    assert(Array.isArray(output.suggestedQuestions) && output.suggestedQuestions.length > 0, 'Must have suggested questions');
    assert(Array.isArray(output.missingInformation), 'Must have missingInformation');
    assert(output.disclaimer, 'Must have safety disclaimer');
  });

  // 6. HEALTH RECORDS INTEGRATION & SAVING
  console.log('\n--- TEST GROUP 6: Health Records & Diary Persistence ---');
  await check('VoiceSymptomDashboard saves structured symptoms to symptomService and recordService', () => {
    assert(dashboardCode.includes('symptomService.logSymptom'));
    assert(dashboardCode.includes('recordService.addRecord'));
    assert(dashboardCode.includes('Save to My Health Records'));
  });

  // 7. MOBILE RESPONSIVENESS (320px–430px)
  console.log('\n--- TEST GROUP 7: Mobile Responsiveness Verification ---');
  await check('VoiceSymptomDashboard uses responsive column grid and min-w-0 containers', () => {
    assert(dashboardCode.includes('min-w-0'));
    assert(dashboardCode.includes('grid-cols-1 lg:grid-cols-12'));
  });

  console.log('\n================================================================');
  console.log(`  VOICE SYMPTOM LOGGER QA SUMMARY: ${passed}/${total} TESTS PASSED`);
  console.log('================================================================');

  if (passed === total) {
    console.log('🎉 ALL VOICE SYMPTOM LOGGER DASHBOARD TESTS PASSED (100%)!');
    process.exit(0);
  } else {
    console.error('❌ SOME TESTS FAILED');
    process.exit(1);
  }
}

runTests();
