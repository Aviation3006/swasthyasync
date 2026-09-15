import assert from 'assert';

console.log('================================================================');
console.log('  SIMULATING RUNTIME AUTH SESSIONS & BROWSER RELOADS');
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

// Mock LocalStorage
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

const mockStorage = new MockLocalStorage();

// Logic reproduction matching AuthContext.tsx and LoginPage.tsx
function initAuthState(storage) {
  const isAuth = storage.getItem('swasthyasync_auth_status') === 'true';
  let initialRole = 'patient';
  if (isAuth) {
    const active = storage.getItem('swasthyasync_active_role');
    if (active === 'hospital' || active === 'district_admin' || active === 'patient') {
      initialRole = active;
    }
  }

  let initialUser = null;
  if (isAuth) {
    const raw = storage.getItem('swasthyasync_session_user');
    if (raw) {
      try {
        initialUser = JSON.parse(raw);
      } catch (e) {
        initialUser = null;
      }
    }
  }

  const initialAuth = isAuth && !!storage.getItem('swasthyasync_session_user');
  return { role: initialRole, user: initialUser, isAuthenticated: initialAuth };
}

function runCheckSession(storage) {
  let resolvedUser = null;
  let resolvedRole = 'patient';
  let resolvedAuth = false;

  const authStatus = storage.getItem('swasthyasync_auth_status');
  const sessionRaw = storage.getItem('swasthyasync_session_user');
  if (authStatus === 'true' && sessionRaw) {
    try {
      const parsed = JSON.parse(sessionRaw);
      if (parsed && parsed.id && parsed.role) {
        resolvedUser = parsed;
        resolvedRole = parsed.role;
        resolvedAuth = true;
      }
    } catch (e) {}
  }

  if (resolvedAuth && resolvedUser) {
    storage.setItem('swasthyasync_active_role', resolvedRole);
    storage.setItem('swasthyasync_auth_status', 'true');
    storage.setItem('swasthyasync_session_user', JSON.stringify(resolvedUser));
    return { user: resolvedUser, role: resolvedRole, isAuthenticated: true };
  } else {
    storage.setItem('swasthyasync_auth_status', 'false');
    storage.removeItem('swasthyasync_session_user');
    storage.removeItem('swasthyasync_active_role');
    return { user: null, role: 'patient', isAuthenticated: false };
  }
}

function getLoginSelectedRole(storage, searchParamRole) {
  if (searchParamRole === 'hospital' || searchParamRole === 'district_admin' || searchParamRole === 'patient') {
    return searchParamRole;
  }
  return 'patient';
}

function simulateSignIn(storage, user) {
  storage.setItem('swasthyasync_active_role', user.role);
  storage.setItem('swasthyasync_auth_status', 'true');
  storage.setItem('swasthyasync_session_user', JSON.stringify(user));
}

function simulateSignOut(storage) {
  storage.setItem('swasthyasync_auth_status', 'false');
  storage.removeItem('swasthyasync_session_user');
  storage.removeItem('swasthyasync_active_role');
  storage.removeItem('swasthyasync_cached_user');
}

// SCENARIO 1: Brand new visitor (clean browser)
console.log('--- SCENARIO 1: Fresh unauthenticated visitor ---');
mockStorage.clear();
check('Clean visitor initializes as patient role and unauthenticated', () => {
  const state = initAuthState(mockStorage);
  assert.strictEqual(state.role, 'patient');
  assert.strictEqual(state.isAuthenticated, false);
  assert.strictEqual(state.user, null);
  
  const loginTab = getLoginSelectedRole(mockStorage, null);
  assert.strictEqual(loginTab, 'patient');
});

// SCENARIO 2: Stale localStorage role from previous unauthenticated usage
console.log('\n--- SCENARIO 2: Stale localStorage role without active auth ---');
mockStorage.clear();
mockStorage.setItem('swasthyasync_active_role', 'hospital'); // Stale leak
mockStorage.setItem('swasthyasync_auth_status', 'false');

check('Stale role does NOT hijack unauthenticated visit into Doctor tab', () => {
  const state = initAuthState(mockStorage);
  assert.strictEqual(state.role, 'patient');
  assert.strictEqual(state.isAuthenticated, false);

  const checked = runCheckSession(mockStorage);
  assert.strictEqual(checked.role, 'patient');
  assert.strictEqual(checked.isAuthenticated, false);
  assert.strictEqual(mockStorage.getItem('swasthyasync_active_role'), null); // Cleared!

  const loginTab = getLoginSelectedRole(mockStorage, null);
  assert.strictEqual(loginTab, 'patient');
});

// SCENARIO 3: Authenticated Hospital login persists across refresh
console.log('\n--- SCENARIO 3: Hospital/Doctor login persists across refresh ---');
mockStorage.clear();
const doctorUser = {
  id: 'usr-delhi-hospital',
  name: 'Dr. Rajiv Malhotra',
  email: 'hospital.delhi@swasthasync.com',
  role: 'hospital'
};
simulateSignIn(mockStorage, doctorUser);

check('Doctor session is preserved synchronously and asynchronously on refresh', () => {
  // Simulate page reload
  const state = initAuthState(mockStorage);
  assert.strictEqual(state.role, 'hospital');
  assert.strictEqual(state.isAuthenticated, true);
  assert.strictEqual(state.user.id, 'usr-delhi-hospital');

  const checked = runCheckSession(mockStorage);
  assert.strictEqual(checked.role, 'hospital');
  assert.strictEqual(checked.isAuthenticated, true);
});

// SCENARIO 4: Authenticated Citizen/Patient login persists across refresh
console.log('\n--- SCENARIO 4: Patient login persists across refresh ---');
mockStorage.clear();
const patientUser = {
  id: 'usr-delhi-patient',
  name: 'Ankit Sharma',
  email: 'patient.delhi@swasthasync.com',
  role: 'patient'
};
simulateSignIn(mockStorage, patientUser);

check('Patient session is preserved on refresh', () => {
  const state = initAuthState(mockStorage);
  assert.strictEqual(state.role, 'patient');
  assert.strictEqual(state.isAuthenticated, true);
  assert.strictEqual(state.user.name, 'Ankit Sharma');

  const checked = runCheckSession(mockStorage);
  assert.strictEqual(checked.role, 'patient');
  assert.strictEqual(checked.isAuthenticated, true);
});

// SCENARIO 5: Authenticated District Admin login persists across refresh
console.log('\n--- SCENARIO 5: District Admin login persists across refresh ---');
mockStorage.clear();
const adminUser = {
  id: 'usr-delhi-district_admin',
  name: 'Dr. Alok Verma',
  email: 'admin.delhi@swasthasync.com',
  role: 'district_admin'
};
simulateSignIn(mockStorage, adminUser);

check('District Admin session is preserved on refresh', () => {
  const state = initAuthState(mockStorage);
  assert.strictEqual(state.role, 'district_admin');
  assert.strictEqual(state.isAuthenticated, true);
  assert.strictEqual(state.user.role, 'district_admin');

  const checked = runCheckSession(mockStorage);
  assert.strictEqual(checked.role, 'district_admin');
  assert.strictEqual(checked.isAuthenticated, true);
});

// SCENARIO 6: Sign Out completely purges credentials and redirects to Citizen tab
console.log('\n--- SCENARIO 6: Sign Out and subsequent refresh ---');
simulateSignOut(mockStorage);

check('Sign out cleans state and subsequent refresh stays unauthenticated as patient', () => {
  const state = initAuthState(mockStorage);
  assert.strictEqual(state.role, 'patient');
  assert.strictEqual(state.isAuthenticated, false);
  assert.strictEqual(state.user, null);

  const checked = runCheckSession(mockStorage);
  assert.strictEqual(checked.role, 'patient');
  assert.strictEqual(checked.isAuthenticated, false);

  const loginTab = getLoginSelectedRole(mockStorage, null);
  assert.strictEqual(loginTab, 'patient');
});

console.log('\n================================================================');
console.log(`  SESSION SIMULATION SUMMARY: ${passed}/${total} TESTS PASSED`);
console.log('================================================================');

if (passed === total) {
  console.log('🎉 ALL RUNTIME AUTH SESSION SIMULATION TESTS PASSED (100%)!');
  process.exit(0);
} else {
  console.error('❌ SOME SESSION SIMULATION TESTS FAILED');
  process.exit(1);
}
