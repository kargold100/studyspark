/**
 * StudySpark — Cloud Account Authentication & Sync
 * Handles registration, login, progress sync, and parent-child linking.
 * Works alongside localStorage (offline-first, cloud optional).
 */

// ── CONFIGURATION ─────────────────────────────────────────────────────────────
// Replace with your deployed Apps Script Web App URL
const ACCOUNTS_URL = 'YOUR_APPS_SCRIPT_ACCOUNTS_URL';

// ── LOCAL CLOUD STATE ─────────────────────────────────────────────────────────
const CloudAccount = {
  KEY: 'ss_cloud_account',

  get() {
    try { return JSON.parse(localStorage.getItem(this.KEY) || 'null'); } catch { return null; }
  },

  set(data) {
    localStorage.setItem(this.KEY, JSON.stringify(data));
  },

  clear() {
    localStorage.removeItem(this.KEY);
  },

  isLoggedIn() {
    const a = this.get();
    return !!(a && a.userId && a.pinHash);
  },
};

// ── PIN HASHING (SHA-256 in browser) ─────────────────────────────────────────
async function hashPIN(pin) {
  const SALT = 'studyspark_2024_au';
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + SALT);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── API CALLS ─────────────────────────────────────────────────────────────────
async function accountsAPI(action, params = {}) {
  if (!ACCOUNTS_URL || ACCOUNTS_URL === 'YOUR_APPS_SCRIPT_ACCOUNTS_URL') {
    throw new Error('Cloud accounts not yet configured. Please set up the Google Apps Script backend first. See GITHUB_UPLOAD_GUIDE.md for instructions.');
  }
  try {
    const res = await fetch(ACCOUNTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...params })
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Request failed');
    return data;
  } catch (e) {
    throw new Error(e.message || 'Network error — check your connection');
  }
}

// ── AUTH ACTIONS ──────────────────────────────────────────────────────────────
async function cloudRegister({ name, email, pin, role, yearLevel, state }) {
  if (!name?.trim()) throw new Error('Please enter your name');
  if (!email?.includes('@')) throw new Error('Please enter a valid email');
  if (!pin || pin.length < 4) throw new Error('PIN must be at least 4 digits');
  if (!/^\d+$/.test(pin)) throw new Error('PIN must be digits only');

  const pinHash = await hashPIN(pin);
  const result = await accountsAPI('register', {
    name: name.trim(), email: email.toLowerCase().trim(),
    pinHash, role, yearLevel, state
  });

  // Save cloud account locally
  CloudAccount.set({
    userId: result.userId, name: result.name, email: email.toLowerCase().trim(),
    pinHash, role: result.role, yearLevel: result.yearLevel,
    state: result.state, studentCode: result.studentCode
  });

  return result;
}

async function cloudLogin(email, pin) {
  if (!email?.includes('@')) throw new Error('Please enter a valid email');
  if (!pin || pin.length < 4) throw new Error('PIN must be at least 4 digits');

  const pinHash = await hashPIN(pin);
  const result = await accountsAPI('login', {
    email: email.toLowerCase().trim(), pinHash
  });

  // Save cloud account locally
  CloudAccount.set({
    userId: result.userId, name: result.name,
    email: email.toLowerCase().trim(), pinHash,
    role: result.role, yearLevel: result.yearLevel,
    state: result.state, studentCode: result.studentCode
  });

  // Restore/merge cloud progress into local profile
  if (result.progress && Object.keys(result.progress).length) {
    mergeCloudProgressToLocal(result.name, result.progress);
  }

  return result;
}

function cloudSignOut() {
  CloudAccount.clear();
}

// ── PROGRESS SYNC ─────────────────────────────────────────────────────────────
async function syncProgressToCloud() {
  const account = CloudAccount.get();
  if (!account) throw new Error('Not logged in to a cloud account');
  if (!currentUser) throw new Error('No local profile selected');

  const data = Profiles.loadData(currentUser);
  const stats = Profiles.getStats(currentUser);

  const progress = {
    xp: data.xp || 0,
    totalAnswered: data.totalAnswered || 0,
    totalCorrect: data.totalCorrect || 0,
    streak: data.streak || 0,
    topicScores: data.topicScores || {},
    achievements: data.achievements || [],
    history: (data.history || []).slice(-500),
  };

  const result = await accountsAPI('sync', {
    userId: account.userId,
    pinHash: account.pinHash,
    progress
  });

  // Update last sync timestamp locally
  const updated = { ...account, lastSync: result.timestamp };
  CloudAccount.set(updated);

  return result;
}

async function refreshFromCloud() {
  const account = CloudAccount.get();
  if (!account) throw new Error('Not logged in');

  const result = await accountsAPI('getProgress', {
    userId: account.userId, pinHash: account.pinHash
  });

  if (result.progress) {
    mergeCloudProgressToLocal(account.name, result.progress);
  }

  return result;
}

function mergeCloudProgressToLocal(nickname, cloudProgress) {
  try {
    // Ensure profile exists locally
    const existing = Profiles.loadData(nickname);
    const merged = {
      ...existing,
      xp: Math.max(existing.xp || 0, cloudProgress.xp || 0),
      totalAnswered: Math.max(existing.totalAnswered || 0, cloudProgress.totalAnswered || 0),
      totalCorrect: Math.max(existing.totalCorrect || 0, cloudProgress.totalCorrect || 0),
      streak: Math.max(existing.streak || 0, cloudProgress.streak || 0),
      topicScores: { ...cloudProgress.topicScores, ...existing.topicScores },
      achievements: [...new Set([...(cloudProgress.achievements || []), ...(existing.achievements || [])])],
    };
    // Merge history (deduplicate by ts)
    const allHistory = [...(existing.history || []), ...(cloudProgress.history || [])];
    const seenTs = new Set();
    merged.history = allHistory.filter(h => {
      if (!h.ts || seenTs.has(h.ts)) return false;
      seenTs.add(h.ts); return true;
    }).slice(-500).sort((a, b) => (a.ts || 0) - (b.ts || 0));

    // Ensure profile is in list
    const list = Profiles.getProfileList();
    if (!list.find(p => p.nickname === nickname)) {
      Profiles.createProfile(nickname, '🎓');
    }
    // Save merged data
    localStorage.setItem('ss_data_' + nickname, JSON.stringify(merged));
    if (!currentUser) {
      currentUser = nickname;
      localStorage.setItem('ss_last_user', nickname);
    }
  } catch (e) {
    console.warn('Merge failed:', e);
  }
}

// ── PARENT FEATURES ───────────────────────────────────────────────────────────
async function linkChildToParent(studentCode) {
  const account = CloudAccount.get();
  if (!account || account.role !== 'parent') throw new Error('Must be logged in as a parent');
  if (!studentCode || studentCode.length < 6) throw new Error('Enter the 6-character student code');

  return await accountsAPI('linkChild', {
    parentUserId: account.userId,
    parentPinHash: account.pinHash,
    studentCode: studentCode.trim().toUpperCase()
  });
}

async function fetchChildrenProgress() {
  const account = CloudAccount.get();
  if (!account || account.role !== 'parent') throw new Error('Must be logged in as a parent');

  return await accountsAPI('getChildren', {
    parentUserId: account.userId,
    parentPinHash: account.pinHash
  });
}

// ── AUTO-SYNC HOOK ────────────────────────────────────────────────────────────
// Called after practice sessions complete — syncs if logged in
async function autoSyncIfLoggedIn() {
  if (!CloudAccount.isLoggedIn() || !currentUser) return;
  const account = CloudAccount.get();
  if (!account) return;

  // Only sync every 5 minutes minimum to avoid rate limits
  const lastSync = account.lastSync ? new Date(account.lastSync).getTime() : 0;
  if (Date.now() - lastSync < 5 * 60 * 1000) return;

  try {
    await syncProgressToCloud();
  } catch (e) {
    console.warn('Auto-sync failed (will retry later):', e.message);
  }
}
