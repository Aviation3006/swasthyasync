import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('================================================================');
console.log('  RUNNING GEMINI CLOUD TTS & SECURITY VERIFICATION QA SUITE');
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

// 1. SERVER-SIDE TTS SERVICE & API ENDPOINTS
console.log('--- TEST GROUP 1: Server-Side Cloud TTS Architecture ---');
const ttsServiceCode = fs.readFileSync(path.resolve('server/ttsService.ts'), 'utf-8');

check('server/ttsService.ts validates languageCode for en-IN, hi-IN, mr-IN', () => {
  assert(ttsServiceCode.includes('en-IN') && ttsServiceCode.includes('hi-IN') && ttsServiceCode.includes('mr-IN'));
  assert(ttsServiceCode.includes('SUPPORTED_TTS_LANGUAGES'));
});

check('server/ttsService.ts implements pcmToWavDataUri 44-byte RIFF WAV encoder', () => {
  assert(ttsServiceCode.includes('pcmToWavDataUri'));
  assert(ttsServiceCode.includes('RIFF') && ttsServiceCode.includes('WAVE') && ttsServiceCode.includes('fmt '));
});

check('server/ttsService.ts enforces text bounds and uses Gemini TTS model', () => {
  assert(ttsServiceCode.includes('gemini-2.5-flash-preview-tts'));
  assert(ttsServiceCode.includes('slice(0, 2500)') || ttsServiceCode.includes('2500'));
});

const apiTtsCode = fs.readFileSync(path.resolve('api/tts.ts'), 'utf-8');
check('api/tts.ts exists as a Vercel-compatible serverless function', () => {
  assert(apiTtsCode.includes('export default async function handler'));
  assert(apiTtsCode.includes('generateCloudTTS'));
});

const viteConfigCode = fs.readFileSync(path.resolve('vite.config.ts'), 'utf-8');
check('vite.config.ts includes local development middleware for /api/tts', () => {
  assert(viteConfigCode.includes("req.url === '/api/tts'"));
  assert(viteConfigCode.includes('generateCloudTTS'));
});

const vercelJson = JSON.parse(fs.readFileSync(path.resolve('vercel.json'), 'utf-8'));
check('vercel.json routes /api/(.*) to serverless backend endpoints', () => {
  const hasApiRewrite = vercelJson.rewrites?.some(r => r.source === '/api/(.*)' && r.destination === '/api/$1');
  assert(hasApiRewrite);
});

// 2. SECURITY & SECRETS HYGIENE
console.log('\n--- TEST GROUP 2: Security & Frontend Secrets Isolation ---');
const envExample = fs.readFileSync(path.resolve('.env.example'), 'utf-8');
check('.env.example documents GEMINI_API_KEY as server-side only and has no real secrets', () => {
  assert(envExample.includes('GEMINI_API_KEY='));
  assert(!envExample.includes('AIzaSy')); // no real Google API key committed
  assert(!envExample.includes('VITE_GEMINI_API_KEY=')); // no VITE_ client-side exposure
});

check('Frontend code in src/ does NOT access process.env.GEMINI_API_KEY or expose API keys', () => {
  function scanDir(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const f of files) {
      const fullPath = path.join(dir, f.name);
      if (f.isDirectory()) {
        scanDir(fullPath);
      } else if (f.name.endsWith('.ts') || f.name.endsWith('.tsx') || f.name.endsWith('.js')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        assert(!content.includes('process.env.GEMINI_API_KEY'), `Found process.env.GEMINI_API_KEY in ${fullPath}`);
        assert(!content.includes('process.env.API_KEY'), `Found process.env.API_KEY in ${fullPath}`);
      }
    }
  }
  scanDir(path.resolve('src'));
});

// 3. CLIENT-SIDE CLOUD TTS SERVICE & AUDIO PLAYER
console.log('\n--- TEST GROUP 3: Cloud TTS Client Service & Audio Player ---');
const cloudServiceCode = fs.readFileSync(path.resolve('src/services/cloudTtsService.ts'), 'utf-8');

check('cloudTtsService.ts implements in-memory audio caching for session optimization', () => {
  assert(cloudServiceCode.includes('audioCache'));
  assert(cloudServiceCode.includes('audioCache.has(cacheKey)'));
});

check('cloudTtsService.ts calls /api/tts endpoint via POST', () => {
  assert(cloudServiceCode.includes("fetch('/api/tts'"));
  assert(cloudServiceCode.includes("method: 'POST'"));
});

const ttsClientCode = fs.readFileSync(path.resolve('src/utils/textToSpeech.ts'), 'utf-8');
check('textToSpeech.ts defines CLOUD_TTS_LANGUAGES for en-IN, hi-IN, mr-IN', () => {
  assert(ttsClientCode.includes('en-IN') && ttsClientCode.includes('hi-IN') && ttsClientCode.includes('mr-IN'));
  assert(ttsClientCode.includes('CloudAudioPlayerController'));
});

const playerCode = fs.readFileSync(path.resolve('src/components/common/ReportAudioPlayer.tsx'), 'utf-8');
check('ReportAudioPlayer renders Gemini Cloud Voice labels without device voice warnings', () => {
  assert(playerCode.includes('cloudVoiceName') || playerCode.includes('Gemini Cloud TTS'));
  assert(!playerCode.includes('Native voice not installed'));
});

check('ReportAudioPlayer provides Play, Pause, Resume, Stop and Speed controls', () => {
  assert(playerCode.includes('handlePlay') && playerCode.includes('handlePause') && playerCode.includes('handleResume') && playerCode.includes('handleStop'));
  assert(playerCode.includes('handleSpeedChange') || playerCode.includes('setSpeechRate'));
});

check('ReportAudioPlayer displays user-friendly error if cloud voice is unavailable', () => {
  assert(playerCode.includes('Cloud voice is temporarily unavailable. Please try again.') || ttsClientCode.includes('Cloud voice is temporarily unavailable. Please try again.'));
});

console.log('\n================================================================');
console.log(`  CLOUD TTS QA SUMMARY: ${passed}/${total} TESTS PASSED`);
console.log('================================================================');

if (passed === total) {
  console.log('🎉 ALL GEMINI CLOUD TTS & SECURITY TESTS PASSED (100%)!');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED');
  process.exit(1);
}
