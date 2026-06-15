// history.js — Full history, progress tracking, and analytics
// Uses localStorage with structured session data

const History = (() => {
  const KEY = 'ss_history_v2';
  const MAX_SESSIONS = 200;

  // ── DATA STRUCTURE ────────────────────────────────────────────────────────
  function defaultStore() {
    return {
      version: 2,
      sessions: [],          // Array of session objects
      topicScores: {},        // { topic: { correct, total } }
      sectionScores: {},      // { section: { correct, total } }
      styleScores: {},        // { style: { correct, total } }
      difficultyScores: {},   // { difficulty: { correct, total } }
      streak: 0,
      bestStreak: 0,
      lastActiveDate: null,
      totalAnswered: 0,
      totalCorrect: 0,
      writingCount: 0,
      funSolved: 0,
      achievements: [],
      firstUsed: null,
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultStore();
      const data = JSON.parse(raw);
      return { ...defaultStore(), ...data };
    } catch { return defaultStore(); }
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('History save failed:', e);
    }
  }

  // ── STREAK MANAGEMENT ─────────────────────────────────────────────────────
  function updateStreak(data) {
    const today = new Date().toDateString();
    if (data.lastActiveDate === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (data.lastActiveDate === yesterday) {
      data.streak++;
    } else if (data.lastActiveDate !== today) {
      data.streak = 1;
    }
    if (data.streak > (data.bestStreak || 0)) data.bestStreak = data.streak;
    data.lastActiveDate = today;
    if (!data.firstUsed) data.firstUsed = new Date().toISOString();
  }

  // ── RECORD A QUESTION ANSWER ──────────────────────────────────────────────
  function recordAnswer(q, correct) {
    const data = load();
    updateStreak(data);
    data.totalAnswered = (data.totalAnswered || 0) + 1;
    if (correct) data.totalCorrect = (data.totalCorrect || 0) + 1;
    // Topic
    if (q.topic) {
      if (!data.topicScores[q.topic]) data.topicScores[q.topic] = { correct: 0, total: 0 };
      data.topicScores[q.topic].total++;
      if (correct) data.topicScores[q.topic].correct++;
    }
    // Section
    if (q.section) {
      if (!data.sectionScores[q.section]) data.sectionScores[q.section] = { correct: 0, total: 0 };
      data.sectionScores[q.section].total++;
      if (correct) data.sectionScores[q.section].correct++;
    }
    // Style
    if (q.style) {
      if (!data.styleScores[q.style]) data.styleScores[q.style] = { correct: 0, total: 0 };
      data.styleScores[q.style].total++;
      if (correct) data.styleScores[q.style].correct++;
    }
    // Difficulty
    if (q.difficulty) {
      if (!data.difficultyScores[q.difficulty]) data.difficultyScores[q.difficulty] = { correct: 0, total: 0 };
      data.difficultyScores[q.difficulty].total++;
      if (correct) data.difficultyScores[q.difficulty].correct++;
    }
    checkAchievements(data);
    save(data);
  }

  // ── RECORD A PRACTICE SESSION ─────────────────────────────────────────────
  function recordSession(questions, answers, mode = 'practice', label = '') {
    const data = load();
    updateStreak(data);
    const correct = answers.filter((a, i) => a === questions[i]?.answer).length;
    const session = {
      id: Date.now(),
      date: new Date().toISOString(),
      type: 'practice',
      mode,
      label: label || `Practice — ${mode === 'oneByOne' ? 'One by One' : 'Batch'}`,
      questions: questions.map((q, i) => ({
        id: q.id,
        topic: q.topic,
        section: q.section,
        style: q.style,
        difficulty: q.difficulty,
        correct: answers[i] === q.answer,
        userAnswer: answers[i],
        correctAnswer: q.answer,
      })),
      correct,
      total: questions.length,
      pct: Math.round(correct / questions.length * 100),
      durationMs: null,
    };
    data.sessions.unshift(session);
    data.sessions = data.sessions.slice(0, MAX_SESSIONS);
    checkAchievements(data);
    save(data);
    return session;
  }

  // ── RECORD AN EXAM ────────────────────────────────────────────────────────
  function recordExam(def, questions, answers, durationSeconds) {
    const data = load();
    updateStreak(data);
    const correct = answers.filter((a, i) => a === questions[i]?.answer).length;
    data.totalAnswered = (data.totalAnswered || 0) + questions.length;
    data.totalCorrect = (data.totalCorrect || 0) + correct;
    const session = {
      id: Date.now(),
      date: new Date().toISOString(),
      type: 'exam',
      label: def.title,
      examId: def.id,
      questions: questions.map((q, i) => ({
        id: q.id,
        topic: q.topic,
        section: q.section,
        style: q.style,
        difficulty: q.difficulty,
        correct: answers[i] === q.answer,
        userAnswer: answers[i],
        correctAnswer: q.answer,
      })),
      correct,
      total: questions.length,
      pct: Math.round(correct / questions.length * 100),
      durationMs: durationSeconds ? durationSeconds * 1000 : null,
    };
    data.sessions.unshift(session);
    data.sessions = data.sessions.slice(0, MAX_SESSIONS);
    // Update breakdowns
    questions.forEach((q, i) => {
      const ok = answers[i] === q.answer;
      if (q.topic) { if (!data.topicScores[q.topic]) data.topicScores[q.topic] = { correct: 0, total: 0 }; data.topicScores[q.topic].total++; if (ok) data.topicScores[q.topic].correct++; }
      if (q.section) { if (!data.sectionScores[q.section]) data.sectionScores[q.section] = { correct: 0, total: 0 }; data.sectionScores[q.section].total++; if (ok) data.sectionScores[q.section].correct++; }
      if (q.style) { if (!data.styleScores[q.style]) data.styleScores[q.style] = { correct: 0, total: 0 }; data.styleScores[q.style].total++; if (ok) data.styleScores[q.style].correct++; }
    });
    checkAchievements(data);
    save(data);
    return session;
  }

  // ── RECORD WRITING ────────────────────────────────────────────────────────
  function recordWriting() {
    const data = load();
    updateStreak(data);
    data.writingCount = (data.writingCount || 0) + 1;
    save(data);
  }

  // ── RECORD FUN ZONE ───────────────────────────────────────────────────────
  function recordFunSolved() {
    const data = load();
    data.funSolved = (data.funSolved || 0) + 1;
    save(data);
  }

  // ── ACHIEVEMENTS ──────────────────────────────────────────────────────────
  const ACHIEVEMENTS = [
    { id: 'first_answer', label: '🌟 First Answer', desc: 'Answer your first question', check: d => d.totalAnswered >= 1 },
    { id: 'ten_correct', label: '🎯 Sharp Shooter', desc: 'Get 10 correct answers', check: d => d.totalCorrect >= 10 },
    { id: 'fifty_questions', label: '💪 Half Century', desc: 'Answer 50 questions', check: d => d.totalAnswered >= 50 },
    { id: 'hundred_questions', label: '🏅 Century', desc: 'Answer 100 questions', check: d => d.totalAnswered >= 100 },
    { id: 'perfect_exam', label: '🏆 Perfect Score', desc: 'Score 100% on any exam', check: d => d.sessions.some(s => s.type === 'exam' && s.pct === 100) },
    { id: 'streak_3', label: '🔥 3-Day Streak', desc: 'Study 3 days in a row', check: d => (d.streak || 0) >= 3 },
    { id: 'streak_7', label: '🔥🔥 Week Streak', desc: 'Study 7 days in a row', check: d => (d.streak || 0) >= 7 },
    { id: 'streak_30', label: '🔥🔥🔥 Month Streak', desc: 'Study 30 days in a row', check: d => (d.streak || 0) >= 30 },
    { id: 'five_exams', label: '📝 Exam Veteran', desc: 'Complete 5 exams', check: d => d.sessions.filter(s => s.type === 'exam').length >= 5 },
    { id: 'fun_10', label: '🎮 Puzzle Master', desc: 'Solve 10 Fun Zone puzzles', check: d => (d.funSolved || 0) >= 10 },
    { id: 'writing_5', label: '✍️ Author', desc: 'Complete 5 writing tasks', check: d => (d.writingCount || 0) >= 5 },
    { id: 'all_sections', label: '🗺️ Explorer', desc: 'Try all 7 exam sections', check: d => Object.keys(d.sectionScores || {}).length >= 7 },
    { id: 'all_styles', label: '📚 Polymath', desc: 'Try all 9 provider styles', check: d => Object.keys(d.styleScores || {}).length >= 9 },
    { id: 'hard_master', label: '🧗 Hard Mode', desc: 'Answer 20 hard questions correctly', check: d => (d.difficultyScores?.hard?.correct || 0) >= 20 },
    { id: 'five_hundred', label: '🚀 500 Club', desc: 'Answer 500 questions', check: d => d.totalAnswered >= 500 },
  ];

  function checkAchievements(data) {
    const earned = new Set(data.achievements || []);
    ACHIEVEMENTS.forEach(a => {
      if (!earned.has(a.id) && a.check(data)) {
        data.achievements = [...earned, a.id];
        earned.add(a.id);
        showToast(`${a.label} Unlocked! ${a.desc}`);
      }
    });
  }

  function showToast(msg) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }

  // ── ANALYTICS ─────────────────────────────────────────────────────────────
  function getStats() {
    const data = load();
    const acc = data.totalAnswered > 0 ? Math.round(data.totalCorrect / data.totalAnswered * 100) : 0;
    // Weak topics (min 3 attempts, below 60%)
    const weakTopics = Object.entries(data.topicScores || {})
      .filter(([, s]) => s.total >= 3 && s.correct / s.total < 0.6)
      .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
      .slice(0, 5)
      .map(([topic, s]) => ({ topic, pct: Math.round(s.correct / s.total * 100), total: s.total }));
    // Strong topics
    const strongTopics = Object.entries(data.topicScores || {})
      .filter(([, s]) => s.total >= 3 && s.correct / s.total >= 0.75)
      .sort((a, b) => b[1].correct / b[1].total - a[1].correct / a[1].total)
      .slice(0, 5)
      .map(([topic, s]) => ({ topic, pct: Math.round(s.correct / s.total * 100), total: s.total }));
    // Section performance
    const sectionPerf = Object.entries(data.sectionScores || {})
      .map(([sec, s]) => ({ sec, pct: Math.round(s.correct / s.total * 100), total: s.total }))
      .sort((a, b) => b.total - a.total);
    // Style performance
    const stylePerf = Object.entries(data.styleScores || {})
      .map(([style, s]) => ({ style, pct: Math.round(s.correct / s.total * 100), total: s.total }))
      .sort((a, b) => b.total - a.total);
    // Recent activity (last 14 days)
    const now = Date.now();
    const recentActivity = Array.from({ length: 14 }, (_, i) => {
      const date = new Date(now - i * 86400000).toDateString();
      const daySessions = data.sessions.filter(s => new Date(s.date).toDateString() === date);
      const answered = daySessions.reduce((sum, s) => sum + s.total, 0);
      const correct = daySessions.reduce((sum, s) => sum + s.correct, 0);
      return { date, answered, correct, pct: answered ? Math.round(correct / answered * 100) : null };
    }).reverse();
    // Earned achievements
    const earnedAchievements = ACHIEVEMENTS.filter(a => (data.achievements || []).includes(a.id));
    const totalExams = data.sessions.filter(s => s.type === 'exam').length;
    const bestExamPct = data.sessions.filter(s => s.type === 'exam').reduce((best, s) => Math.max(best, s.pct), 0);
    return {
      totalAnswered: data.totalAnswered || 0,
      totalCorrect: data.totalCorrect || 0,
      accuracy: acc,
      streak: data.streak || 0,
      bestStreak: data.bestStreak || 0,
      writingCount: data.writingCount || 0,
      funSolved: data.funSolved || 0,
      recentSessions: data.sessions.slice(0, 20),
      weakTopics,
      strongTopics,
      sectionPerf,
      stylePerf,
      recentActivity,
      earnedAchievements,
      totalAchievements: ACHIEVEMENTS.length,
      allAchievements: ACHIEVEMENTS,
      totalExams,
      bestExamPct,
      firstUsed: data.firstUsed,
    };
  }

  // ── EXPORT DATA ───────────────────────────────────────────────────────────
  function exportJSON() {
    const data = load();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studyspark-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── IMPORT DATA ───────────────────────────────────────────────────────────
  function importJSON(jsonStr) {
    try {
      const imported = JSON.parse(jsonStr);
      if (!imported.sessions) throw new Error('Invalid format');
      const current = load();
      // Merge sessions (deduplicate by id)
      const existingIds = new Set(current.sessions.map(s => s.id));
      const newSessions = imported.sessions.filter(s => !existingIds.has(s.id));
      current.sessions = [...newSessions, ...current.sessions].slice(0, MAX_SESSIONS);
      // Merge scores
      ['topicScores', 'sectionScores', 'styleScores', 'difficultyScores'].forEach(key => {
        if (imported[key]) {
          Object.entries(imported[key]).forEach(([k, v]) => {
            if (!current[key][k]) current[key][k] = { correct: 0, total: 0 };
            current[key][k].correct += v.correct || 0;
            current[key][k].total += v.total || 0;
          });
        }
      });
      save(current);
      return { success: true, added: newSessions.length };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // ── RESET ─────────────────────────────────────────────────────────────────
  function reset() {
    localStorage.removeItem(KEY);
  }

  // ── GET RAW DATA ──────────────────────────────────────────────────────────
  function getData() { return load(); }

  // ── RENDER HISTORY PAGE ───────────────────────────────────────────────────
  function render() {
    const s = getStats();
    const el = document.getElementById('app');

    if (!s.totalAnswered) {
      el.innerHTML = `<div class="page">
        <h1>📊 My Progress & History</h1>
        <div class="card tc" style="padding:48px">
          <div style="font-size:44px;margin-bottom:12px">📊</div>
          <h2>No activity yet</h2>
          <p class="mt">Start practising to build your history here.</p>
          <div class="fc gap8 mt14" style="justify-content:center">
            <button class="btn ba" onclick="App.nav('practice')">✏️ Start Practising</button>
            <button class="btn bm" onclick="App.nav('exams')">📝 Take an Exam</button>
          </div>
        </div>
      </div>`;
      return;
    }

    const accColor = s.accuracy >= 75 ? 'var(--green)' : s.accuracy >= 50 ? 'var(--orange)' : 'var(--red)';
    const SL = { vic_reading: '📖 VIC Reading', vic_maths: '🔢 VIC Maths', vic_verbal: '🧠 VIC Verbal', vic_quant: '📐 VIC Quant', nsw_reading: '📖 NSW Reading', nsw_maths: '🔢 NSW Maths', nsw_thinking: '🧩 NSW Thinking' };
    const STL = { acer: 'ACER', hendersons: 'Hendersons', psle: 'PSLE', contour: 'Contour', james_ann: 'James & Ann', edutest: 'EduTest', matrix: 'Matrix', oc: 'OC Test', hast: 'HAST' };

    el.innerHTML = `<div class="page">
      <div class="fc jsb mb20 wrap gap8">
        <h1>📊 My Progress & History</h1>
        <div class="fc gap8 wrap">
          <button class="btn bg bsm" onclick="History.exportJSON()">⬇️ Export History</button>
          <label class="btn bm bsm" style="cursor:pointer">📤 Import <input type="file" accept=".json" style="display:none" onchange="History.handleImport(this)"/></label>
          <button class="btn bm bsm" style="color:var(--red)" onclick="if(confirm('Reset ALL progress? This cannot be undone.')) { History.reset(); App.nav('home'); }">🗑 Reset</button>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="g4 mb24">
        <div class="card tc">
          <div style="font-size:24px;margin-bottom:4px">✅</div>
          <div style="font-weight:900;font-size:24px;color:var(--accent)">${s.totalAnswered.toLocaleString()}</div>
          <div class="mt sm">Questions Answered</div>
        </div>
        <div class="card tc">
          <div style="font-size:24px;margin-bottom:4px">🎯</div>
          <div style="font-weight:900;font-size:24px;color:${accColor}">${s.accuracy}%</div>
          <div class="mt sm">Overall Accuracy</div>
        </div>
        <div class="card tc">
          <div style="font-size:24px;margin-bottom:4px">🔥</div>
          <div style="font-weight:900;font-size:24px;color:var(--orange)">${s.streak}</div>
          <div class="mt sm">Day Streak (Best: ${s.bestStreak})</div>
        </div>
        <div class="card tc">
          <div style="font-size:24px;margin-bottom:4px">🏆</div>
          <div style="font-weight:900;font-size:24px;color:var(--yellow)">${s.earnedAchievements.length}/${s.totalAchievements}</div>
          <div class="mt sm">Achievements</div>
        </div>
      </div>

      <!-- Activity Heatmap -->
      <div class="card mb20">
        <h3 class="mb14">📅 Last 14 Days Activity</h3>
        <div style="display:flex;gap:6px;align-items:flex-end;flex-wrap:wrap">
          ${s.recentActivity.map(day => {
            const h = day.answered ? Math.min(60, 10 + day.answered * 3) : 10;
            const bg = !day.answered ? 'var(--border)' : day.pct >= 75 ? 'var(--green)' : day.pct >= 50 ? 'var(--orange)' : 'var(--red)';
            const d = new Date(day.date);
            const label = d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
            return `<div style="flex:1;min-width:18px;display:flex;flex-direction:column;align-items:center;gap:4px">
              <div title="${label}: ${day.answered} answered${day.pct !== null ? ', ' + day.pct + '%' : ''}" style="width:100%;height:${h}px;border-radius:4px;background:${bg};transition:height .3s;cursor:pointer;min-width:18px"></div>
              <div class="xs mt" style="white-space:nowrap">${label.split(' ')[0]}</div>
            </div>`;
          }).join('')}
        </div>
        <div class="fc gap12 mt14 xs mt">
          <span>■ <span style="color:var(--green)">≥75%</span></span>
          <span>■ <span style="color:var(--orange)">50–74%</span></span>
          <span>■ <span style="color:var(--red)">&lt;50%</span></span>
          <span>■ <span style="color:var(--border)">No activity</span></span>
        </div>
      </div>

      <div class="g2 mb20">
        <!-- Section Performance -->
        <div class="card">
          <h3 class="mb14">Performance by Section</h3>
          ${s.sectionPerf.length ? s.sectionPerf.map(sp => {
            const c = sp.pct >= 75 ? 'var(--green)' : sp.pct >= 50 ? 'var(--orange)' : 'var(--red)';
            return `<div style="margin-bottom:12px">
              <div class="fc jsb sm mb8">
                <span>${SL[sp.sec] || sp.sec}</span>
                <span style="color:${c};font-weight:700">${sp.pct}% (${sp.total} Qs)</span>
              </div>
              <div class="pbar"><div class="pfill" style="width:${sp.pct}%;background:${c}"></div></div>
            </div>`;
          }).join('') : '<p class="mt sm">Complete sessions to see section data.</p>'}
        </div>

        <!-- Style Performance -->
        <div class="card">
          <h3 class="mb14">Performance by Style</h3>
          ${s.stylePerf.length ? s.stylePerf.map(sp => {
            const c = sp.pct >= 75 ? 'var(--green)' : sp.pct >= 50 ? 'var(--orange)' : 'var(--red)';
            return `<div style="margin-bottom:12px">
              <div class="fc jsb sm mb8">
                <span>${STL[sp.style] || sp.style}</span>
                <span style="color:${c};font-weight:700">${sp.pct}% (${sp.total} Qs)</span>
              </div>
              <div class="pbar"><div class="pfill" style="width:${sp.pct}%;background:${c}"></div></div>
            </div>`;
          }).join('') : '<p class="mt sm">Try different provider styles to see data.</p>'}
        </div>
      </div>

      <div class="g2 mb20">
        <!-- Weak Topics -->
        ${s.weakTopics.length ? `<div class="card" style="border-color:rgba(247,79,79,.3)">
          <h3 style="color:var(--red);margin-bottom:12px">⚠️ Needs Work</h3>
          ${s.weakTopics.map(t => `<div class="fc jsb sm mb8">
            <span>${t.topic}</span>
            <div class="fc gap8">
              <span style="color:var(--red);font-weight:700">${t.pct}% (${t.total})</span>
              <button class="btn bsm" style="background:var(--red);color:#fff;padding:2px 8px;font-size:11px" onclick="App.startPractice({topic:'${t.topic}'},'oneByOne',6)">Practise</button>
            </div>
          </div>`).join('')}
        </div>` : '<div></div>'}

        <!-- Strong Topics -->
        ${s.strongTopics.length ? `<div class="card" style="border-color:rgba(61,214,140,.3)">
          <h3 style="color:var(--green);margin-bottom:12px">⭐ Strong Areas</h3>
          ${s.strongTopics.map(t => `<div class="fc jsb sm mb8">
            <span>${t.topic}</span>
            <span style="color:var(--green);font-weight:700">${t.pct}% ✓</span>
          </div>`).join('')}
        </div>` : '<div></div>'}
      </div>

      <!-- Achievements -->
      <div class="card mb20">
        <div class="fc jsb mb14">
          <h3>🏆 Achievements (${s.earnedAchievements.length}/${s.totalAchievements})</h3>
        </div>
        <div class="g4">
          ${s.allAchievements.map(a => {
            const earned = s.earnedAchievements.some(e => e.id === a.id);
            return `<div class="card ${earned ? '' : 'mt'}" style="text-align:center;padding:14px;border-color:${earned ? 'rgba(247,200,79,.4)' : 'var(--border)'};opacity:${earned ? 1 : .4}">
              <div style="font-size:24px;margin-bottom:4px">${a.label.split(' ')[0]}</div>
              <div style="font-size:11px;font-weight:700;margin-bottom:2px">${a.label.slice(a.label.indexOf(' ')+1)}</div>
              <div class="xs mt">${a.desc}</div>
              ${earned ? '<div class="xs" style="color:var(--yellow);margin-top:4px">✓ Earned</div>' : ''}
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Session History -->
      <div class="fc jsb mb14 wrap gap8">
        <h2>Recent Sessions (${s.recentSessions.length})</h2>
      </div>
      <div class="card" style="padding:0;overflow:hidden">
        ${s.recentSessions.length ? s.recentSessions.map(sess => {
          const d = new Date(sess.date);
          const dateStr = d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
          const timeStr = d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
          const pctColor = sess.pct >= 75 ? 'var(--green)' : sess.pct >= 50 ? 'var(--orange)' : 'var(--red)';
          const badgeBg = sess.type === 'exam' ? 'rgba(155,89,247,.2)' : 'rgba(79,142,247,.2)';
          const badgeColor = sess.type === 'exam' ? 'var(--purple)' : 'var(--accent)';
          return `<div class="history-item">
            <div class="history-badge" style="background:${badgeBg};color:${badgeColor}">
              ${sess.type === 'exam' ? '📝' : '✏️'}
            </div>
            <div style="flex:1;min-width:0">
              <div style="font-weight:700;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${sess.label}</div>
              <div class="xs mt">${dateStr} at ${timeStr}</div>
            </div>
            <div style="text-align:right;flex-shrink:0">
              <div style="font-weight:900;color:${pctColor}">${sess.pct}%</div>
              <div class="xs mt">${sess.correct}/${sess.total}</div>
            </div>
          </div>`;
        }).join('') : '<div class="loading">No sessions yet.</div>'}
      </div>
    </div>`;
  }

  // Handle file import
  function handleImport(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const result = importJSON(e.target.result);
      if (result.success) {
        showToast(`✅ Imported ${result.added} sessions successfully!`);
        render();
      } else {
        showToast(`❌ Import failed: ${result.error}`);
      }
    };
    reader.readAsText(file);
  }

  return { recordAnswer, recordSession, recordExam, recordWriting, recordFunSolved, getStats, getData, exportJSON, importJSON, handleImport, reset, render };
})();
