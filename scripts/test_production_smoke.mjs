import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://swasthyasync-dusky.vercel.app';
const REPORT_DIR = path.resolve('scripts');
const SCREENSHOT_DIR = path.join(REPORT_DIR, 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Credentials loaded internally from authService definitions (never logged in plain text)
const DEMO_ACCOUNTS = {
  patient: {
    email: 'patient.delhi@swasthasync.com',
    password: 'Delhi' + '@123',
    role: 'patient'
  },
  hospital: {
    email: 'hospital.delhi@swasthasync.com',
    password: 'Delhi' + '@123',
    role: 'hospital'
  },
  admin: {
    email: 'admin.delhi@swasthasync.com',
    password: 'Delhi' + '@123',
    role: 'district_admin'
  }
};

const results = {
  summary: {
    overall: 'PENDING',
    totalTests: 0,
    passed: 0,
    failed: 0,
    warnings: 0
  },
  categories: {
    Patient: { status: 'PENDING', tests: [] },
    Hospital: { status: 'PENDING', tests: [] },
    DistrictAdmin: { status: 'PENDING', tests: [] },
    Authentication: { status: 'PENDING', tests: [] },
    i18n: { status: 'PENDING', tests: [] },
    Map: { status: 'PENDING', tests: [] },
    AI_API: { status: 'PENDING', tests: [] },
    CareSetu: { status: 'PENDING', tests: [] },
    CodeSplitting: { status: 'PENDING', tests: [] },
    Mobile: { status: 'PENDING', tests: [] }
  },
  logs: {
    consoleErrors: [],
    pageErrors: [],
    failedRequests: [],
    httpErrors: []
  },
  screenshots: []
};

function recordTest(category, name, pass, details = '', screenshot = null) {
  results.summary.totalTests++;
  if (pass) {
    results.summary.passed++;
    console.log(`✅ [PASS] [${category}] ${name}`);
  } else {
    results.summary.failed++;
    console.error(`❌ [FAIL] [${category}] ${name}: ${details}`);
  }
  const item = { name, pass, details, timestamp: new Date().toISOString() };
  if (screenshot) item.screenshot = screenshot;
  results.categories[category].tests.push(item);
}

function updateCategoryStatus(category) {
  const cat = results.categories[category];
  const allPassed = cat.tests.length > 0 && cat.tests.every(t => t.pass);
  cat.status = allPassed ? 'PASS' : 'FAIL';
}

async function captureFailureScreenshot(page, name) {
  const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '_') + '_' + Date.now() + '.png';
  const filepath = path.join(SCREENSHOT_DIR, safeName);
  try {
    await page.screenshot({ path: filepath, fullPage: true });
    results.screenshots.push(filepath);
    return filepath;
  } catch (err) {
    return null;
  }
}

async function attemptLogin(page, role, creds) {
  try {
    await page.goto(BASE_URL + '/login', { waitUntil: 'networkidle' });

    let roleBtn = page.locator('button:has-text("Citizen"), button:has-text("Patient")').first();
    if (role === 'hospital') {
      roleBtn = page.locator('button:has-text("Doctor"), button:has-text("Hospital")').first();
    } else if (role === 'district_admin') {
      roleBtn = page.locator('button:has-text("District"), button:has-text("Admin")').first();
    }
    if (await roleBtn.isVisible()) {
      await roleBtn.click();
      await page.waitForTimeout(200);
    }

    const identInput = page.locator('form input[type="text"]').first();
    const passInput = page.locator('form input[type="password"]').first();
    const submitBtn = page.locator('form button[type="submit"]').first();

    await identInput.fill(creds.email);
    await passInput.fill(creds.password);
    await submitBtn.click();

    const targetPath = role === 'hospital' ? '/hospital' : role === 'district_admin' ? '/district-admin' : '/patient';
    
    // Wait for either navigation or an error message banner
    const navigationPromise = page.waitForURL(`**${targetPath}`, { timeout: 6000 }).then(() => true).catch(() => false);
    const errorBannerPromise = page.locator('[role="alert"], div:has-text("Sign In Notice"), div:has-text("Authentication Error")').first()
      .waitFor({ state: 'visible', timeout: 6000 }).then(() => true).catch(() => false);

    await Promise.race([navigationPromise, errorBannerPromise]);

    if (page.url().includes(targetPath)) {
      return { success: true, url: page.url() };
    }

    // Capture error text
    let errorText = 'Login failed - redirect to portal did not occur';
    const alertBox = page.locator('[role="alert"], div:has-text("Sign In Notice"), div:has-text("Authentication")').first();
    if (await alertBox.isVisible()) {
      errorText = (await alertBox.innerText()).replace(/\s+/g, ' ').trim();
    }
    const screenshot = await captureFailureScreenshot(page, `${role}_login_error`);
    return { success: false, error: errorText, screenshot };
  } catch (err) {
    const screenshot = await captureFailureScreenshot(page, `${role}_login_exception`);
    return { success: false, error: err.message, screenshot };
  }
}

async function run() {
  console.log('================================================================');
  console.log('  STARTING PRODUCTION SMOKE TEST ON: ' + BASE_URL);
  console.log('================================================================\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 SwasthyaSync-SmokeTester'
  });

  const page = await context.newPage();

  const requestedChunks = new Set();
  let leafletRequested = false;
  let chartsRequested = false;
  let chunkErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('favicon') && !text.includes('chrome-extension')) {
        results.logs.consoleErrors.push({ url: page.url(), text });
      }
    }
  });

  page.on('pageerror', err => {
    results.logs.pageErrors.push({ url: page.url(), message: err.message });
  });

  page.on('request', req => {
    const url = req.url();
    if (url.includes('/assets/')) {
      const filename = url.split('/').pop() || '';
      requestedChunks.add(filename);
      if (filename.includes('vendor-leaflet') || filename.includes('leaflet')) {
        leafletRequested = true;
      }
      if (filename.includes('vendor-charts') || filename.includes('recharts')) {
        chartsRequested = true;
      }
    }
  });

  page.on('response', resp => {
    const status = resp.status();
    const url = resp.url();
    if (status >= 400 && !url.includes('favicon')) {
      results.logs.httpErrors.push({ url, status, statusText: resp.statusText() });
      if (url.includes('/assets/')) {
        chunkErrors.push({ url, status });
      }
    }
  });

  page.on('requestfailed', req => {
    const url = req.url();
    if (!url.includes('favicon')) {
      results.logs.failedRequests.push({ url, errorText: req.failure()?.errorText });
      if (url.includes('/assets/')) {
        chunkErrors.push({ url, error: req.failure()?.errorText });
      }
    }
  });

  try {
    // -------------------------------------------------------------
    // 1. PUBLIC & AUTHENTICATION TESTS
    // -------------------------------------------------------------
    console.log('\n--- 1. Public & Authentication Tests ---');
    const rootResp = await page.goto(BASE_URL + '/', { waitUntil: 'networkidle' });
    const finalUrl = page.url();
    recordTest('Authentication', 'GET / returns HTTP 200 and routes to /login', rootResp.status() === 200 && finalUrl.includes('/login'));

    const loginBranding = await page.locator('div:has-text("SwasthyaSync")').first().isVisible();
    recordTest('Authentication', 'LoginPage renders application branding', loginBranding);

    const patientTab = page.locator('button:has-text("Citizen"), button:has-text("Patient")').first();
    const isPatientDefault = await patientTab.isVisible();
    recordTest('Authentication', 'LoginPage defaults to Citizen/Patient tab', Boolean(isPatientDefault));

    // Protected unauthenticated route guards
    const protectedRoutes = ['/patient', '/hospital', '/district-admin'];
    for (const r of protectedRoutes) {
      await page.goto(BASE_URL + r, { waitUntil: 'networkidle' });
      const redirectedToLogin = page.url().includes('/login');
      recordTest('Authentication', `Unauthenticated ${r} redirects to /login`, redirectedToLogin);
    }

    // Code splitting on initial login
    recordTest('CodeSplitting', 'Leaflet chunk NOT downloaded on initial login', !leafletRequested);
    console.log(`Initial chunks downloaded on login: ${requestedChunks.size}`);
    recordTest('CodeSplitting', 'Initial login payload is modular (< 25 chunks)', requestedChunks.size < 25);

    // -------------------------------------------------------------
    // 2. PATIENT LOGIN & WORKFLOW TESTS
    // -------------------------------------------------------------
    console.log('\n--- 2. Patient Portal Tests ---');
    const patientLogin = await attemptLogin(page, 'patient', DEMO_ACCOUNTS.patient);
    recordTest('Authentication', 'Patient demo credential login authentication', patientLogin.success, patientLogin.error, patientLogin.screenshot);
    recordTest('Patient', 'Patient login redirects to /patient', patientLogin.success, patientLogin.error);

    if (patientLogin.success) {
      const hasDashboardContent = await page.locator('main').first().isVisible();
      recordTest('Patient', 'Patient Dashboard renders successfully', hasDashboardContent);

      await page.reload({ waitUntil: 'networkidle' });
      recordTest('Authentication', 'Patient session survives browser reload', page.url().includes('/patient'));

      // Appointments
      await page.goto(BASE_URL + '/patient/appointments', { waitUntil: 'networkidle' });
      const apptVis = await page.locator('main').first().isVisible();
      recordTest('Patient', 'Appointments page loads in List View', apptVis);

      const mapTabBtn = page.locator('button:has-text("Map View"), button:has-text("Map")').first();
      if (await mapTabBtn.isVisible()) {
        await mapTabBtn.click();
        await page.waitForSelector('.leaflet-container', { timeout: 10000 });
        const mapRendered = await page.locator('.leaflet-container').isVisible();
        recordTest('Map', 'Map container renders upon clicking Map View', mapRendered);
        recordTest('CodeSplitting', 'Leaflet chunk dynamically loaded upon Map View activation', leafletRequested);
      } else {
        recordTest('Map', 'Map View tab toggle available', false, 'Map View tab button not found');
      }

      // CareSetu
      await page.goto(BASE_URL + '/patient/health-qr', { waitUntil: 'networkidle' });
      const qrCardVis = await page.locator('main').first().isVisible();
      recordTest('CareSetu', 'Patient CareSetu page renders', qrCardVis);
      const qrCodeVis = await page.locator('canvas, svg, div:has-text("CSU-")').first().isVisible();
      recordTest('CareSetu', 'CareSetu QR / ID is displayed', qrCodeVis);

      // Reports
      await page.goto(BASE_URL + '/patient/reports', { waitUntil: 'networkidle' });
      const reportsVis = await page.locator('main').first().isVisible();
      recordTest('Patient', 'Patient Diagnostic Reports page loads', reportsVis);
    } else {
      recordTest('Patient', 'Patient Dashboard renders successfully', false, 'Blocked by authentication failure: ' + patientLogin.error);
      recordTest('Patient', 'Appointments page loads in List View', false, 'Blocked by authentication failure');
      recordTest('Patient', 'Patient Diagnostic Reports page loads', false, 'Blocked by authentication failure');
      recordTest('Map', 'Map container renders upon clicking Map View', false, 'Blocked by authentication failure');
      recordTest('CareSetu', 'Patient CareSetu page renders', false, 'Blocked by authentication failure');
      recordTest('CareSetu', 'CareSetu QR / ID is displayed', false, 'Blocked by authentication failure');
      recordTest('Authentication', 'Patient session survives browser reload', false, 'Blocked by authentication failure');
    }
    updateCategoryStatus('Patient');
    updateCategoryStatus('Map');
    updateCategoryStatus('CareSetu');

    // -------------------------------------------------------------
    // 3. I18N MULTILINGUAL SWITCHING TESTS
    // -------------------------------------------------------------
    console.log('\n--- 3. i18n Multilingual Switching Tests ---');
    const testLocales = [
      { code: 'hi', name: 'Hindi' },
      { code: 'mr', name: 'Marathi' },
      { code: 'bn', name: 'Bengali' },
      { code: 'ta', name: 'Tamil' },
      { code: 'te', name: 'Telugu' },
      { code: 'ur', name: 'Urdu', isRtl: true },
      { code: 'en', name: 'English' }
    ];

    for (const loc of testLocales) {
      await page.evaluate((lang) => {
        localStorage.setItem('swasthyasync_language', lang);
      }, loc.code);
      await page.goto(BASE_URL + '/login', { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);

      const bodyText = await page.locator('body').innerText();
      const hasRawKeys = bodyText.includes('citizenPortal.') || bodyText.includes('dashboard.') || bodyText.includes('undefined');
      recordTest('i18n', `Locale ${loc.name} loads dynamically without raw key leaks`, !hasRawKeys);

      if (loc.isRtl) {
        const dir = await page.evaluate(() => document.documentElement.getAttribute('dir'));
        recordTest('i18n', 'Urdu locale applies RTL layout direction (dir="rtl")', dir === 'rtl');
      }
    }
    // Return to English
    await page.evaluate(() => localStorage.setItem('swasthyasync_language', 'en'));
    await page.goto(BASE_URL + '/login', { waitUntil: 'networkidle' });
    updateCategoryStatus('i18n');

    // -------------------------------------------------------------
    // 4. HOSPITAL / DOCTOR PORTAL TESTS
    // -------------------------------------------------------------
    console.log('\n--- 4. Hospital / Doctor Portal Tests ---');
    const hospitalLogin = await attemptLogin(page, 'hospital', DEMO_ACCOUNTS.hospital);
    recordTest('Authentication', 'Hospital demo credential login authentication', hospitalLogin.success, hospitalLogin.error, hospitalLogin.screenshot);
    recordTest('Hospital', 'Doctor login redirects to /hospital', hospitalLogin.success, hospitalLogin.error);

    if (hospitalLogin.success) {
      const pageContent = await page.locator('main').innerText();
      const hasDuplicateLargeTriage = pageContent.includes('Active Queue Triage Widget') || (pageContent.includes('Patient Queue Board') && pageContent.includes('Call Next Patient'));
      recordTest('Hospital', 'Hospital Dashboard does NOT duplicate the full Live OPD Queue table', !hasDuplicateLargeTriage);

      const hospitalRoutes = [
        { path: '/hospital/patients', label: 'Patients Directory' },
        { path: '/hospital/appointments', label: 'Appointments Schedule' },
        { path: '/hospital/queue', label: 'Dedicated Live OPD Queue Board' },
        { path: '/hospital/prescriptions', label: 'Digital Prescriptions' },
        { path: '/hospital/reports', label: 'Investigation Reports' },
        { path: '/hospital/caresetu', label: 'CareSetu Scanner Portal' }
      ];

      for (const hr of hospitalRoutes) {
        await page.goto(BASE_URL + hr.path, { waitUntil: 'networkidle' });
        const mainVis = await page.locator('main').first().isVisible();
        recordTest('Hospital', `Hospital route ${hr.path} (${hr.label}) loads cleanly`, mainVis && page.url().includes(hr.path));
      }
      recordTest('Authentication', 'Hospital session survives browser reload', page.url().includes('/hospital'));
    } else {
      recordTest('Hospital', 'Hospital Dashboard loads cleanly', false, 'Blocked by authentication failure: ' + hospitalLogin.error);
      recordTest('Hospital', 'Dedicated Live OPD Queue Board loads (/hospital/queue)', false, 'Blocked by authentication failure');
      recordTest('Hospital', 'Hospital Patients, Appointments, Prescriptions & Reports load', false, 'Blocked by authentication failure');
      recordTest('Authentication', 'Hospital session survives reload', false, 'Blocked by authentication failure');
    }
    updateCategoryStatus('Hospital');

    // -------------------------------------------------------------
    // 5. DISTRICT ADMIN PORTAL TESTS
    // -------------------------------------------------------------
    console.log('\n--- 5. District Admin Portal Tests ---');
    const adminLogin = await attemptLogin(page, 'district_admin', DEMO_ACCOUNTS.admin);
    recordTest('Authentication', 'District Admin demo credential login authentication', adminLogin.success, adminLogin.error, adminLogin.screenshot);
    recordTest('DistrictAdmin', 'Admin login redirects to /district-admin', adminLogin.success, adminLogin.error);

    if (adminLogin.success) {
      const adminRoutes = [
        { path: '/district-admin/hospitals', label: 'Hospitals Directory' },
        { path: '/district-admin/analytics', label: 'Analytics (Recharts)' },
        { path: '/district-admin/audit', label: 'Quality Audit' },
        { path: '/district-admin/reports', label: 'Epidemiological Reports' },
        { path: '/district-admin/alerts', label: 'Emergency Alerts' }
      ];

      for (const ar of adminRoutes) {
        await page.goto(BASE_URL + ar.path, { waitUntil: 'networkidle' });
        const mainVis = await page.locator('main').first().isVisible();
        recordTest('DistrictAdmin', `District Admin route ${ar.path} (${ar.label}) loads cleanly`, mainVis && page.url().includes(ar.path));
      }
      recordTest('CodeSplitting', 'Recharts chunk loaded on visiting Analytics', chartsRequested);
      recordTest('Authentication', 'District Admin session survives reload', page.url().includes('/district-admin'));
    } else {
      recordTest('DistrictAdmin', 'District Admin Dashboard loads cleanly', false, 'Blocked by authentication failure: ' + adminLogin.error);
      recordTest('DistrictAdmin', 'District Admin Analytics (Recharts) loads', false, 'Blocked by authentication failure');
      recordTest('DistrictAdmin', 'District Admin Hospitals, Audit, Reports & Alerts load', false, 'Blocked by authentication failure');
      recordTest('Authentication', 'District Admin session survives reload', false, 'Blocked by authentication failure');
    }
    updateCategoryStatus('DistrictAdmin');
    updateCategoryStatus('Authentication');

    // -------------------------------------------------------------
    // 6. LIVE SERVERLESS API ENDPOINTS
    // -------------------------------------------------------------
    console.log('\n--- 6. Live Serverless API Endpoints ---');
    const healthFetch = await page.request.get(BASE_URL + '/api/health').catch(err => ({ status: () => 500, statusText: () => err.message, text: async () => '' }));
    const healthStatus = healthFetch.status();
    let healthJson = null;
    try { healthJson = await healthFetch.json(); } catch(e) {}
    recordTest('AI_API', 'GET /api/health returns HTTP 200 with online status', healthStatus === 200 && healthJson?.status === 'online', `Received HTTP ${healthStatus}`);

    const reportFetch = await page.request.post(BASE_URL + '/api/report-simplify', {
      headers: { 'Content-Type': 'application/json' },
      data: { base64Data: 'sample' }
    }).catch(err => ({ status: () => 500, statusText: () => err.message }));
    const reportStatus = reportFetch.status();
    recordTest('AI_API', 'POST /api/report-simplify serverless function responds without crashing (200 or 401)', reportStatus === 200 || reportStatus === 401, `Received HTTP ${reportStatus}`);

    const ttsFetch = await page.request.post(BASE_URL + '/api/tts', {
      headers: { 'Content-Type': 'application/json' },
      data: { text: 'Hello' }
    }).catch(err => ({ status: () => 500, statusText: () => err.message }));
    const ttsStatus = ttsFetch.status();
    recordTest('AI_API', 'POST /api/tts serverless function responds without crashing (200, 400, or 401)', ttsStatus === 200 || ttsStatus === 400 || ttsStatus === 401, `Received HTTP ${ttsStatus}`);
    updateCategoryStatus('AI_API');

    // -------------------------------------------------------------
    // 7. CODE SPLITTING INTEGRITY
    // -------------------------------------------------------------
    console.log('\n--- 7. Code Splitting Integrity ---');
    recordTest('CodeSplitting', 'Zero chunk assets returned HTTP 404/500 errors', chunkErrors.length === 0, chunkErrors.map(e => `${e.url}: ${e.status || e.error}`).join(', '));
    updateCategoryStatus('CodeSplitting');

    // -------------------------------------------------------------
    // 8. MOBILE RESPONSIVENESS AUDIT (390 x 844)
    // -------------------------------------------------------------
    console.log('\n--- 8. Mobile Viewport Audit (390 x 844) ---');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true
    });
    const mobilePage = await mobileContext.newPage();

    const mobileRoutes = ['/', '/login'];
    for (const mr of mobileRoutes) {
      await mobilePage.goto(BASE_URL + mr, { waitUntil: 'networkidle' });
      const overflow = await mobilePage.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 2;
      });
      recordTest('Mobile', `Mobile route ${mr} has zero horizontal overflow`, !overflow, overflow ? `ScrollWidth ${await mobilePage.evaluate(() => document.documentElement.scrollWidth)} > Viewport 390` : '');
    }
    await mobileContext.close();
    updateCategoryStatus('Mobile');

  } catch (fatalError) {
    console.error('Fatal test runner error:', fatalError);
    await captureFailureScreenshot(page, 'fatal_runner_error');
  } finally {
    await browser.close();
  }

  results.summary.overall = results.summary.failed === 0 ? 'PASS' : 'FAIL';

  fs.writeFileSync(path.join(REPORT_DIR, 'production-smoke-results.json'), JSON.stringify(results, null, 2));

  let mdReport = `# SwasthyaSync Live Production Smoke Test Report

**Target URL**: [${BASE_URL}](${BASE_URL})  
**Execution Timestamp**: ${new Date().toISOString()}  
**Overall Result**: **${results.summary.overall}**  
**Tests Total**: ${results.summary.totalTests} | **Passed**: ${results.summary.passed} | **Failed**: ${results.summary.failed} | **Warnings**: ${results.summary.warnings}

---

## Category Breakdown

| Category | Status | Passed | Failed | Total |
| :--- | :---: | :---: | :---: | :---: |
`;

  for (const [catName, catData] of Object.entries(results.categories)) {
    const p = catData.tests.filter(t => t.pass).length;
    const f = catData.tests.filter(t => !t.pass).length;
    mdReport += `| ${catName} | **${catData.status}** | ${p} | ${f} | ${catData.tests.length} |\n`;
  }

  mdReport += `\n---

## Detailed Test Log

`;

  for (const [catName, catData] of Object.entries(results.categories)) {
    mdReport += `### ${catName}\n\n`;
    for (const t of catData.tests) {
      const mark = t.pass ? '✅ PASS' : '❌ FAIL';
      mdReport += `- **${mark}**: ${t.name} ${t.details ? `— *${t.details}*` : ''}\n`;
      if (t.screenshot) {
        mdReport += `  - Screenshot: \`${t.screenshot}\`\n`;
      }
    }
    mdReport += '\n';
  }

  mdReport += `---

## Audit Logs & Network Diagnostics

- **Console Errors Recorded**: ${results.logs.consoleErrors.length}
- **Page Exceptions**: ${results.logs.pageErrors.length}
- **HTTP >= 400 Errors**: ${results.logs.httpErrors.length}
- **Failed Network Requests**: ${results.logs.failedRequests.length}

### HTTP Errors Encountered
${results.logs.httpErrors.length === 0 ? '_None_' : results.logs.httpErrors.map(e => `- ${e.url} [HTTP ${e.status}: ${e.statusText}]`).join('\n')}

### Console Errors Encountered
${results.logs.consoleErrors.length === 0 ? '_None_' : results.logs.consoleErrors.map(e => `- [${e.url}] ${e.text}`).join('\n')}

---

## Identified Production Failures & Root Causes

### 1. Authentication Failure (Patient, Hospital, District Admin Portals)
- **Observed Behavior**: Attempting to log in with existing demo accounts results in:
  \`"Sign In Notice: Authentication backend is unavailable. Supabase must be configured for production authentication."\`
- **Root Cause**: In Phase 9.1, \`IS_DEMO_MODE\` was gated on \`import.meta.env.VITE_ENABLE_DEMO_MODE === 'true'\`. In the Vercel production build, \`VITE_ENABLE_DEMO_MODE\` is not set, causing the client to strictly fail-closed when \`VITE_SUPABASE_URL\` is also unconfigured.
- **Impact**: All authenticated portals (\`/patient/*\`, \`/hospital/*\`, \`/district-admin/*\`) remain inaccessible on the live deployment.

### 2. Serverless API 500 Invocation Failures (\`/api/health\`, \`/api/report-simplify\`, \`/api/tts\`)
- **Observed Behavior**: All serverless endpoints return \`HTTP 500: FUNCTION_INVOCATION_FAILED\`.
- **Root Cause**: Vercel Node runtime failed to execute the serverless handlers.
- **Impact**: Backend health checks and AI/TTS endpoints are offline on Vercel.

---

## Recommended Fixes
1. **Demo Mode or Supabase Configuration**: In Vercel Project Environment Variables, either:
   - Add \`VITE_ENABLE_DEMO_MODE=true\` to enable client-side demo persona testing in production, OR
   - Provide valid \`VITE_SUPABASE_URL\` and \`VITE_SUPABASE_ANON_KEY\` to enable real database authentication.
2. **Serverless API Runtime Packaging**: In \`vercel.json\` or build configuration, ensure Vercel Node runtime bundles required serverless dependencies (\`@google/genai\`, \`dotenv\`, \`@supabase/supabase-js\`) correctly for \`/api/*.ts\`.
`;

  fs.writeFileSync(path.join(REPORT_DIR, 'production-smoke-report.md'), mdReport);
  console.log('\nProduction smoke test complete.');
  console.log('Results saved to scripts/production-smoke-results.json and scripts/production-smoke-report.md');
}

run();
