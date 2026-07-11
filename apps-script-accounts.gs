/**
 * StudySpark — Cloud Accounts & Progress Sync
 * Deploy as a new Web App (separate from the AI proxy)
 * 
 * Google Sheet structure: Create a sheet called "StudySpark Accounts"
 * Tab 1: "Users"   — A:UserId | B:Name | C:Email | D:PinHash | E:Role | F:YearLevel
 *                    G:State  | H:ParentCode | I:StudentCode | J:CreatedAt | K:LastSync
 * Tab 2: "Progress" — A:UserId | B:XP | C:TotalAnswered | D:TotalCorrect | E:Streak
 *                     F:TopicScores(JSON) | G:Achievements(JSON) | H:History(JSON) | I:LastSync
 */

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID'; // Replace with your Sheet ID
const SALT = 'studyspark_2024_au';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;
    
    const result = dispatch(action, body);
    return ContentService
      .createTextOutput(JSON.stringify({ok: true, ...result}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ok: false, error: err.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    const result = dispatch(action, e.parameter);
    return ContentService
      .createTextOutput(JSON.stringify({ok: true, ...result}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ok: false, error: err.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function dispatch(action, params) {
  switch(action) {
    case 'register':  return register(params);
    case 'login':     return login(params);
    case 'sync':      return syncProgress(params);
    case 'getProgress': return getProgress(params);
    case 'linkChild': return linkChild(params);
    case 'getChildren': return getChildren(params);
    case 'checkEmail': return checkEmail(params);
    default: throw new Error('Unknown action: ' + action);
  }
}

// ── HELPERS ──────────────────────────────────────────────────────────────────

function getSheet(tabName) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  return ss.getSheetByName(tabName);
}

function hashPin(pin) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    pin + SALT,
    Utilities.Charset.UTF_8
  );
  return bytes.map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
}

function makeCode(len) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < len; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function getUserRow(email) {
  const sheet = getSheet('Users');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][2]).toLowerCase() === email.toLowerCase()) {
      return { row: i + 1, data: data[i] };
    }
  }
  return null;
}

function getUserById(userId) {
  const sheet = getSheet('Users');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) return { row: i + 1, data: data[i] };
  }
  return null;
}

function getProgressRow(userId) {
  const sheet = getSheet('Progress');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) return { row: i + 1, data: data[i] };
  }
  return null;
}

// ── ACTIONS ──────────────────────────────────────────────────────────────────

function checkEmail(params) {
  const existing = getUserRow(params.email);
  return { exists: !!existing };
}

function register(params) {
  const { name, email, pinHash, role, yearLevel, state } = params;
  
  if (!name || !email || !pinHash || !role) throw new Error('Missing required fields');
  if (getUserRow(email)) throw new Error('Email already registered');
  
  const userId = Utilities.getUuid();
  const studentCode = role === 'student' ? makeCode(6) : '';
  const now = new Date().toISOString();
  
  const usersSheet = getSheet('Users');
  usersSheet.appendRow([userId, name, email.toLowerCase(), pinHash, role, yearLevel || '', state || 'ALL', '', studentCode, now, now]);
  
  // Create empty progress row
  const progressSheet = getSheet('Progress');
  progressSheet.appendRow([userId, 0, 0, 0, 0, '{}', '[]', '[]', now]);
  
  // Send welcome email (requires Apps Script to have Gmail permissions)
  try {
    const emailBody = role === 'student' && studentCode
      ? '<div style="font-family:sans-serif;max-width:480px;margin:auto">' +
        '<h2 style="color:#4F96F7">Welcome to StudySpark, ' + name + '!</h2>' +
        '<p>Your student account has been created.</p>' +
        '<p><strong>Your Student Code:</strong></p>' +
        '<div style="font-size:32px;font-weight:900;letter-spacing:6px;color:#4F96F7;padding:16px;background:#f0f6ff;border-radius:8px;text-align:center;margin:16px 0">' + studentCode + '</div>' +
        '<p>Share this 6-character code with your parent so they can track your progress.</p>' +
        '<p>Start practising at <a href="https://studysparkau.netlify.app">studysparkau.netlify.app</a></p>' +
        '<hr><p style="color:#888;font-size:12px">StudySpark — Free Australian Exam Prep</p></div>'
      : '<div style="font-family:sans-serif;max-width:480px;margin:auto">' +
        '<h2 style="color:#4F96F7">Welcome to StudySpark, ' + name + '!</h2>' +
        '<p>Your ' + role + ' account has been created.</p>' +
        '<p>Sign in at <a href="https://studysparkau.netlify.app">studysparkau.netlify.app</a> using your email and PIN.</p>' +
        '<hr><p style="color:#888;font-size:12px">StudySpark — Free Australian Exam Prep</p></div>';
    
    MailApp.sendEmail({
      to: email,
      subject: 'Welcome to StudySpark! 🎓',
      htmlBody: emailBody
    });
  } catch(e) {
    // Email sending is optional - account creation still succeeds even if email fails
    Logger.log('Email send failed: ' + e.message);
  }
  
  return { userId, studentCode, name, role, yearLevel, state };
}

function login(params) {
  const { email, pinHash } = params;
  const userRow = getUserRow(email);
  if (!userRow) throw new Error('Email not found');
  
  const [userId, name, , storedHash, role, yearLevel, state, parentCode, studentCode] = userRow.data;
  if (storedHash !== pinHash) throw new Error('Incorrect PIN');
  
  // Update last sync
  getSheet('Users').getRange(userRow.row, 11).setValue(new Date().toISOString());
  
  // Get progress
  const progRow = getProgressRow(userId);
  let progress = {};
  if (progRow) {
    const [, xp, totalAnswered, totalCorrect, streak, topicScores, achievements, history] = progRow.data;
    progress = {
      xp: xp || 0,
      totalAnswered: totalAnswered || 0,
      totalCorrect: totalCorrect || 0,
      streak: streak || 0,
      topicScores: JSON.parse(topicScores || '{}'),
      achievements: JSON.parse(achievements || '[]'),
      history: JSON.parse(history || '[]'),
    };
  }
  
  return { userId, name, role, yearLevel, state, studentCode, progress };
}

function syncProgress(params) {
  const { userId, pinHash, progress } = params;
  
  // Verify identity
  const userRow = getUserById(userId);
  if (!userRow) throw new Error('User not found');
  if (userRow.data[3] !== pinHash) throw new Error('Unauthorised');
  
  const sheet = getSheet('Progress');
  const progRow = getProgressRow(userId);
  const now = new Date().toISOString();
  
  // Keep last 500 history entries
  const history = (progress.history || []).slice(-500);
  
  const rowData = [
    userId,
    progress.xp || 0,
    progress.totalAnswered || 0,
    progress.totalCorrect || 0,
    progress.streak || 0,
    JSON.stringify(progress.topicScores || {}),
    JSON.stringify(progress.achievements || []),
    JSON.stringify(history),
    now
  ];
  
  if (progRow) {
    sheet.getRange(progRow.row, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
  
  // Update lastSync on user row
  getSheet('Users').getRange(userRow.row, 11).setValue(now);
  
  return { synced: true, timestamp: now };
}

function getProgress(params) {
  const { userId, pinHash } = params;
  const userRow = getUserById(userId);
  if (!userRow) throw new Error('User not found');
  if (userRow.data[3] !== pinHash) throw new Error('Unauthorised');
  
  const progRow = getProgressRow(userId);
  if (!progRow) return { progress: {} };
  
  const [, xp, totalAnswered, totalCorrect, streak, topicScores, achievements, history] = progRow.data;
  return {
    progress: {
      xp, totalAnswered, totalCorrect, streak,
      topicScores: JSON.parse(topicScores || '{}'),
      achievements: JSON.parse(achievements || '[]'),
      history: JSON.parse(history || '[]'),
    }
  };
}

function linkChild(params) {
  const { parentUserId, parentPinHash, studentCode } = params;
  
  // Verify parent
  const parentRow = getUserById(parentUserId);
  if (!parentRow) throw new Error('Parent not found');
  if (parentRow.data[3] !== parentPinHash) throw new Error('Unauthorised');
  if (parentRow.data[4] !== 'parent') throw new Error('Not a parent account');
  
  // Find student by code
  const sheet = getSheet('Users');
  const data = sheet.getDataRange().getValues();
  let studentRow = null, studentRowNum = null;
  for (let i = 1; i < data.length; i++) {
    if (data[i][8] === studentCode.toUpperCase()) {
      studentRow = data[i]; studentRowNum = i + 1; break;
    }
  }
  if (!studentRow) throw new Error('Student code not found');
  
  // Set parentCode on student
  sheet.getRange(studentRowNum, 8).setValue(parentUserId);
  
  return { 
    linked: true, 
    studentName: studentRow[1],
    studentId: studentRow[0]
  };
}

function getChildren(params) {
  const { parentUserId, parentPinHash } = params;
  
  // Verify parent
  const parentRow = getUserById(parentUserId);
  if (!parentRow) throw new Error('Parent not found');
  if (parentRow.data[3] !== parentPinHash) throw new Error('Unauthorised');
  
  // Find all children
  const sheet = getSheet('Users');
  const data = sheet.getDataRange().getValues();
  const children = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][7] === parentUserId) {
      const childId = data[i][0];
      const progRow = getProgressRow(childId);
      let progress = { xp: 0, totalAnswered: 0, totalCorrect: 0, streak: 0, topicScores: {} };
      if (progRow) {
        const [, xp, totalAnswered, totalCorrect, streak, topicScores] = progRow.data;
        progress = { xp, totalAnswered, totalCorrect, streak, topicScores: JSON.parse(topicScores || '{}') };
      }
      children.push({
        userId: childId,
        name: data[i][1],
        yearLevel: data[i][5],
        state: data[i][6],
        studentCode: data[i][8],
        progress
      });
    }
  }
  
  return { children };
}
