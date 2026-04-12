// ── questions.js ── Question bank loader & manager ──────────────────────────
// Loads from questions.json (local bank) + generates AI questions on demand.
// Used by practice.js, exam.js, and questionbrowser.js

const QB = (() => {

  let _bank = [];     // all local questions
  let _session = [];  // AI-generated questions added this session

  // ── LOAD LOCAL BANK ────────────────────────────────────────────────────────
  async function load() {
    try {
      const res = await fetch('data/questions.json');
      const data = await res.json();
      _bank = data.questions || [];
      console.log(`[QB] Loaded ${_bank.length} questions from local bank.`);
    } catch (e) {
      console.warn('[QB] Could not load questions.json, using empty bank.', e);
      _bank = [];
    }
  }

  // ── FILTER QUESTIONS ───────────────────────────────────────────────────────
  // filters: { state, section, grade, topic, difficulty, limit }
  function filter(filters = {}) {
    let qs = [..._bank, ..._session];
    if (filters.state   && filters.state   !== 'ALL') qs = qs.filter(q => q.state === filters.state || q.state === 'BOTH');
    if (filters.section && filters.section !== 'ALL') qs = qs.filter(q => q.section === filters.section);
    if (filters.grade   && filters.grade   !== 'ALL') qs = qs.filter(q => q.grade === filters.grade);
    if (filters.topic   && filters.topic   !== 'ALL') qs = qs.filter(q => q.topic === filters.topic);
    if (filters.difficulty && filters.difficulty !== 'ALL') qs = qs.filter(q => q.difficulty === filters.difficulty);
    if (filters.limit) qs = shuffle(qs).slice(0, filters.limit);
    return qs;
  }

  // ── GET ALL UNIQUE VALUES for filter dropdowns ────────────────────────────
  function getFilterOptions() {
    const all = [..._bank, ..._session];
    return {
      states:       ['ALL', ...unique(all.map(q => q.state).filter(s => s !== 'BOTH'))],
      sections:     ['ALL', ...unique(all.map(q => q.section))],
      grades:       ['ALL', ...unique(all.map(q => q.grade))],
      topics:       ['ALL', ...unique(all.map(q => q.topic))],
      difficulties: ['ALL', 'easy', 'medium', 'hard'],
    };
  }

  // ── GET SINGLE RANDOM QUESTION ─────────────────────────────────────────────
  function getRandom(filters = {}) {
    const pool = filter({ ...filters, limit: undefined });
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // ── ADD AI-GENERATED QUESTIONS TO SESSION BANK ────────────────────────────
  function addToSession(questions) {
    const withIds = questions.map((q, i) => ({
      ...q,
      id: `ai_${Date.now()}_${i}`,
      source: 'ai',
      showAnswer: false,
    }));
    _session.push(...withIds);
    console.log(`[QB] Added ${withIds.length} AI questions. Session total: ${_session.length}`);
  }

  // ── GENERATE AI QUESTIONS VIA CLAUDE API ──────────────────────────────────
  async function generateAI(sectionId, count = 4) {
    const PROMPTS = {
      vic_reading:  `Generate ${count} Victorian ACER Selective Entry reading comprehension questions for Year 8. Each: include a short passage (3-5 sentences) then 1 question. Focus on inference, vocabulary in context, or author's purpose.`,
      vic_maths:    `Generate ${count} Victorian ACER Selective Entry mathematics questions for Year 8. Cover algebra, geometry, ratios, statistics, measurement. No calculator. Challenging but fair.`,
      vic_verbal:   `Generate ${count} Victorian ACER Selective Entry verbal reasoning questions. Types: word analogies (A:B::C:?), odd-one-out, word classification.`,
      vic_quant:    `Generate ${count} Victorian ACER Selective Entry quantitative reasoning questions. Types: number sequences, symbol substitution (e.g. ★+●=?), pattern problems.`,
      nsw_reading:  `Generate ${count} NSW Selective High School reading comprehension questions for Year 6. Include a short passage then a question.`,
      nsw_maths:    `Generate ${count} NSW Selective mathematical reasoning questions. Year 6-7 level. No calculator.`,
      nsw_thinking: `Generate ${count} NSW Selective thinking skills questions. Mix verbal reasoning (syllogisms, analogies) and logical/abstract reasoning.`,
    };

    const system = `You are an expert Australian selective school exam creator.
Return ONLY a valid JSON array. No markdown, no preamble, no text outside the array.
Format:
[{"q":"question text","options":["A text","B text","C text","D text"],"answer":0,"exp":"explanation","topic":"topic name","difficulty":"easy|medium|hard"}]
answer is the 0-based index of the correct option.`;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system,
          messages: [{ role: 'user', content: PROMPTS[sectionId] || `Generate ${count} selective exam questions as JSON array.` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(c => c.text || '').join('') || '[]';
      const clean = text.replace(/```json|```/g, '').trim();
      const qs = JSON.parse(clean);
      const tagged = qs.map(q => ({ ...q, section: sectionId, grade: 'selective', state: sectionId.startsWith('nsw') ? 'NSW' : 'VIC', source: 'ai', showAnswer: false }));
      addToSession(tagged);
      return tagged;
    } catch (e) {
      console.error('[QB] AI generation failed:', e);
      return [];
    }
  }

  // ── SAVE QUESTION BANK TO GOOGLE SHEETS (optional integration) ────────────
  // Replace SHEET_SCRIPT_URL with your Apps Script deployment URL
  async function syncToSheet(scriptUrl) {
    if (!scriptUrl) return;
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'syncQuestions', questions: _session }),
      });
    } catch (e) {
      console.warn('[QB] Sheet sync failed:', e);
    }
  }

  // ── HELPERS ───────────────────────────────────────────────────────────────
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function unique(arr) { return [...new Set(arr)]; }

  // ── STATS ─────────────────────────────────────────────────────────────────
  function stats() {
    return { local: _bank.length, session: _session.length, total: _bank.length + _session.length };
  }

  return { load, filter, getFilterOptions, getRandom, generateAI, addToSession, syncToSheet, stats };
})();
