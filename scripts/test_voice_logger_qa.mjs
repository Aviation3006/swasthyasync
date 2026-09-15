import { chromium } from 'playwright';
import { spawn } from 'child_process';
import http from 'http';

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

function waitForServer(url, timeout = 25000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http.get(url, (res) => {
        if (res.statusCode) return resolve();
        setTimeout(check, 300);
      }).on('error', () => {
        if (Date.now() - start > timeout) return reject(new Error('Server timeout'));
        setTimeout(check, 300);
      });
    };
    check();
  });
}

async function runQA() {
  console.log('--- Starting Vite Preview Server ---');
  const previewProcess = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    shell: true,
    stdio: 'pipe'
  });

  previewProcess.stderr.on('data', (d) => console.error(`[preview stderr] ${d}`));

  try {
    await waitForServer(BASE_URL);
    console.log(`Preview server is live at ${BASE_URL}\n`);

    const browser = await chromium.launch({
      headless: true,
      args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
    });

    const context = await browser.newContext({
      permissions: ['microphone'],
      viewport: { width: 1280, height: 800 }
    });

    const page = await context.newPage();

    let passed = 0;
    let failed = 0;

    function assert(name, condition, detail = '') {
      if (condition) {
        console.log(`✅ [PASS] ${name}`);
        passed++;
      } else {
        console.error(`❌ [FAIL] ${name} ${detail ? '(' + detail + ')' : ''}`);
        failed++;
      }
    }

    // --- 1. Login as Demo Patient ---
    console.log('\n--- 1. Authenticate Demo Patient ---');
    await page.goto(BASE_URL + '/login', { waitUntil: 'networkidle' });
    const patientTab = page.locator('button:has-text("Citizen"), button:has-text("Patient")').first();
    if (await patientTab.isVisible()) {
      await patientTab.click();
      await page.waitForTimeout(200);
    }
    await page.locator('form input[type="text"]').first().fill('patient.test@swasthasync.com');
    await page.locator('form input[type="password"]').first().fill('Patient@123');
    await page.locator('form button[type="submit"]').first().click();
    await page.waitForURL('**/patient', { timeout: 15000 });
    assert('Patient logged in and routed to /patient', page.url().includes('/patient'));

    // --- 2. Verify Duplicate Voice Logger is Removed from Main Patient Page ---
    console.log('\n--- 2. Verify Patient Portal Clean Navigation & Removal of Duplicate Widget ---');
    const duplicateLoggerCard = await page.locator('div:has-text("Clinical Speech AI"):has(button:has-text("Record Symptoms"))').count();
    assert('Duplicate Voice Symptom Logger widget card removed from Patient Dashboard', duplicateLoggerCard === 0);

    await page.locator('section[aria-label="Clinical Services & Actions"]').waitFor({ state: 'visible', timeout: 10000 });
    const recordsNav = await page.locator('section[aria-label="Clinical Services & Actions"] a[href="/patient/records"]').first().isVisible();
    const reportsNav = await page.locator('section[aria-label="Clinical Services & Actions"] a[href="/patient/reports"]').first().isVisible();
    const symptomsNav = await page.locator('section[aria-label="Clinical Services & Actions"] a[href="/patient/symptoms"]').first().isVisible();
    const voiceNav = await page.locator('section[aria-label="Clinical Services & Actions"] a[href="/patient/symptoms/voice"]').first().isVisible();
    assert('Clean navigation card to Records present', recordsNav);
    assert('Clean navigation card to Reports present', reportsNav);
    assert('Clean navigation card to Symptom Diary present', symptomsNav);
    assert('Clean navigation card to Voice Symptom Logger present', voiceNav);

    // --- 3. Verify PatientSymptoms page (/patient/symptoms) Disclaimer Banner ---
    console.log('\n--- 3. Verify PatientSymptoms (/patient/symptoms) Emergency Alert Fix ---');
    await page.goto(BASE_URL + '/patient/symptoms', { waitUntil: 'networkidle' });
    const symptomsPageText = await page.innerText('main');
    const hasEmergencyTriageHeading = symptomsPageText.includes('Emergency Triage Assessment');
    assert('Page does NOT display "Emergency Triage Assessment" on load', !hasEmergencyTriageHeading);

    const hasSafetyDisclaimer = symptomsPageText.includes('Non-Diagnostic Informational Disclaimer') || symptomsPageText.includes('Important Clinical Safety Notice') || symptomsPageText.includes('Important Clinical Safety Disclaimer');
    assert('Page displays proper non-diagnostic clinical safety disclaimer heading', hasSafetyDisclaimer);

    // --- 4. Dedicated Voice Symptom Dashboard (/patient/symptoms/voice) ---
    console.log('\n--- 4. Verify Dedicated Voice Symptom Dashboard (/patient/symptoms/voice) ---');
    await page.goto(BASE_URL + '/patient/symptoms/voice', { waitUntil: 'networkidle' });
    await page.waitForSelector('main');

    const voicePageText = await page.innerText('main');
    assert('Voice Dashboard does NOT display "Emergency Triage Assessment"', !voicePageText.includes('Emergency Triage Assessment'));
    assert('Fresh session shows "No Symptoms Analyzed Yet" empty placeholder', voicePageText.includes('No Symptoms Analyzed Yet'));

    // Check Speech Recognition Button initial idle state
    assert('Page does NOT automatically initialize or activate microphone on load', !voicePageText.includes('Initializing microphone...') && !voicePageText.includes('Listening to your voice...'));
    assert('Voice Dashboard displays idle CTA "Tap microphone to speak symptoms"', voicePageText.includes('Tap microphone to speak symptoms'));

    const micButton = page.locator('button[aria-label="Tap microphone to speak symptoms"], button[aria-label="Start Speaking"]').first();
    const micBtnVisible = await micButton.isVisible();
    assert('Microphone CTA button is visible and actionable in idle state', micBtnVisible);

    // Check language selector options
    const langSelect = page.locator('#voice-lang-select');
    const langSelectVisible = await langSelect.isVisible();
    assert('Voice language selector is present', langSelectVisible);

    const langOptions = await page.locator('#voice-lang-select option').allTextContents();
    assert('Language selector includes English (India)', langOptions.some(o => o.includes('English (India)')));
    assert('Language selector includes Hindi', langOptions.some(o => o.includes('Hindi') || o.includes('हिन्दी')));
    assert('Language selector includes Marathi', langOptions.some(o => o.includes('Marathi') || o.includes('मराठी')));

    // --- 5. Test Language Selection ---
    console.log('\n--- 5. Test Recognition Language Switching ---');
    await langSelect.selectOption('hi-IN');
    let selectedVal = await langSelect.inputValue();
    assert('Successfully selected Hindi (hi-IN)', selectedVal === 'hi-IN');

    await langSelect.selectOption('mr-IN');
    selectedVal = await langSelect.inputValue();
    assert('Successfully selected Marathi (mr-IN)', selectedVal === 'mr-IN');

    await langSelect.selectOption('en-IN');
    selectedVal = await langSelect.inputValue();
    assert('Successfully selected English (India) (en-IN)', selectedVal === 'en-IN');

    // --- 5B. Test Microphone Activation & Stop/Cancel Lifecycle ---
    console.log('\n--- 5B. Test Microphone Activation & Stop/Cancel Lifecycle ---');
    await micButton.click();
    await page.waitForTimeout(300);
    const micActiveState = await page.locator('button[aria-label="Stop Listening"], button[aria-label*="Click to cancel"]').first().isVisible();
    assert('Clicking microphone transitions out of idle (into starting or listening)', micActiveState);

    // Click to cancel or stop
    const stopOrCancelBtn = page.locator('button[aria-label="Stop Listening"], button[aria-label*="Click to cancel"]').first();
    await stopOrCancelBtn.click();
    await page.waitForTimeout(400);

    const micRevertedIdle = await page.locator('button[aria-label="Tap microphone to speak symptoms"]').first().isVisible();
    assert('Stopping/cancelling microphone cleanly returns to idle state', micRevertedIdle);

    // --- 6. Test Manual Typing & Symptom Analysis ---
    console.log('\n--- 6. Test Manual Typing and Symptom Analysis ---');
    const textarea = page.locator('textarea').first();
    const testSymptom = 'I have a mild headache and tiredness since yesterday evening.';
    await textarea.fill(testSymptom);

    const charCountText = await page.locator('#charCount').innerText();
    assert('Character counter updates dynamically', charCountText.includes(String(testSymptom.length)));

    // Click Analyze Symptoms
    const analyzeBtn = page.locator('button:has-text("Analyze Symptoms")').first();
    assert('Analyze Symptoms button is enabled when text is entered', await analyzeBtn.isEnabled());
    await analyzeBtn.click();

    // Wait for analysis output
    await page.waitForSelector('text=Structured Clinical Analysis Ready', { timeout: 10000 });
    assert('Structured clinical analysis output rendered successfully', true);

    const analysisContent = await page.innerText('main');
    assert('Clinical Overview card renders objective summary', analysisContent.includes('Clinical Overview'));
    assert('Routine symptoms do NOT trigger an Emergency 108 triage alert', !analysisContent.includes('Urgent Medical Notice'));
    assert('Suggested doctor questions are provided', analysisContent.includes('Questions to Ask Doctor') || analysisContent.includes('Doctor'));

    // --- 7. Test Clear Action and Fresh Session Reset ---
    console.log('\n--- 7. Test Clear Action & State Reset ---');
    const clearBtn = page.locator('button:has-text("Clear")').first();
    await clearBtn.click();
    await page.waitForTimeout(500);

    const textareaAfterClear = await textarea.inputValue();
    assert('Transcript textarea is empty after clear', textareaAfterClear === '');

    const voiceTextAfterClear = await page.innerText('main');
    assert('Analysis result is cleared and empty state returns', voiceTextAfterClear.includes('No Symptoms Analyzed Yet'));
    assert('No emergency alert appears after clearing session', !voiceTextAfterClear.includes('Urgent Medical Notice') && !voiceTextAfterClear.includes('Emergency Triage Assessment'));

    // --- 8. Reload Test ---
    console.log('\n--- 8. Page Reload Freshness Test ---');
    await page.reload({ waitUntil: 'networkidle' });
    const textAfterReload = await page.innerText('main');
    assert('Reloaded page stays clean with no spontaneous emergency alert', !textAfterReload.includes('Emergency Triage Assessment') && !textAfterReload.includes('Urgent Medical Notice'));
    assert('Reloaded page shows empty state placeholder', textAfterReload.includes('No Symptoms Analyzed Yet'));

    console.log('\n================================================================');
    console.log(`  QA SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('================================================================');

    await browser.close();
    process.exit(failed > 0 ? 1 : 0);
  } finally {
    previewProcess.kill();
  }
}

runQA().catch((err) => {
  console.error('Fatal QA script error:', err);
  process.exit(1);
});
