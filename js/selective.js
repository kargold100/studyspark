// ── selective.js ── Selective Entry Prep ─────────────────────────────────────

const Selective = (() => {

  const VIC = {
    label: 'Victoria (ACER)', flag: '🟦',
    note: 'Sat by Year 8 students for Year 9 entry. ~5,700 applicants, ~1,000 places across 4 schools.',
    totalTime: '~2h 35min',
    schools: ['Melbourne High', "Mac.Robertson Girls'", 'Nossal High', 'Suzanne Cory'],
    sections: [
      { id:'vic_reading', emoji:'📖', label:'Reading Reasoning',        Qs:50, mins:35, color:'accent',
        desc:'Comprehension, inference, vocabulary in context. Fiction, non-fiction, poetry, reports.' },
      { id:'vic_maths',   emoji:'🔢', label:'Mathematics Reasoning',    Qs:60, mins:30, color:'green',
        desc:'Number, algebra, measurement, geometry, statistics — Year 8 level. No calculator.' },
      { id:'vic_verbal',  emoji:'🧠', label:'General Ability – Verbal', Qs:60, mins:30, color:'purple',
        desc:'Word analogies, classification, vocabulary, logical deduction using language.' },
      { id:'vic_quant',   emoji:'📐', label:'General Ability – Quant',  Qs:50, mins:30, color:'orange',
        desc:'Number sequences, symbol patterns, spatial reasoning, abstract problem solving.' },
      { id:'vic_writing', emoji:'✍️', label:'Writing',                  Qs:1,  mins:40, color:'pink',
        desc:'One creative OR persuasive writing task. Marked on ideas, structure, expression, mechanics.' },
    ],
  };

  const NSW = {
    label: 'NSW', flag: '🟨',
    note: 'Sat by Year 6 students for Year 7 entry. Fully computer-based from 2025. ~15,000 applicants, ~4,300 places.',
    totalTime: '~2h 30min',
    schools: ['James Ruse', 'North Sydney Boys/Girls', 'Baulkham Hills', '50+ selective schools'],
    sections: [
      { id:'nsw_reading',  emoji:'📖', label:'Reading',               Qs:40, mins:40, color:'accent',
        desc:'Texts across genres — fiction, reports, articles. Comprehension and inference.' },
      { id:'nsw_maths',    emoji:'🔢', label:'Mathematical Reasoning', Qs:40, mins:40, color:'green',
        desc:'Apply maths concepts to solve problems. No calculator. Year 6-7 level.' },
      { id:'nsw_thinking', emoji:'🧩', label:'Thinking Skills',        Qs:40, mins:40, color:'purple',
        desc:'Critical thinking, verbal and non-verbal reasoning. No prior knowledge required.' },
      { id:'nsw_writing',  emoji:'✍️', label:'Writing',               Qs:1,  mins:30, color:'pink',
        desc:'Creative or persuasive writing in response to a stimulus (words, image, or quote).' },
    ],
  };

  const WRITING_PROMPTS = [
    { type:'Creative',    text:"Write a story that begins with: 'The door at the end of the corridor had never been opened — until today.'" },
    { type:'Persuasive',  text:"Should students be allowed to use AI tools for homework? Write a persuasive piece arguing your position." },
    { type:'Creative',    text:"A student discovers they can hear the thoughts of the animals in the science lab. Write what happens next." },
    { type:'Persuasive',  text:"Argue for or against: 'School uniforms should be abolished in all Australian public schools.'" },
    { type:'Creative',    text:"Write a story set in a world where everyone must wear a colour that shows their mood." },
    { type:'Persuasive',  text:"'Learning a musical instrument should be compulsory in primary school.' Write a persuasive argument." },
    { type:'Creative',    text:"Write about a journey where the destination turns out to be completely different from expected." },
    { type:'Persuasive',  text:"Should homework be banned for students under 14? Write a persuasive argument for your school newsletter." },
  ];

  let _state = 'VIC';           // 'VIC' | 'NSW'
  let _activeSection = null;
  let _practiceQs = [];
  let _practiceAnswers = [];
  let _practiceSubmitted = false;
  let _writingPrompt = null;
  let _writingText = '';
  let _writingFeedback = '';
  let _loading = false;

  // ── RENDER ────────────────────────────────────────────────────────────────
  function render() {
    const el = document.getElementById('app');
    const info = _state === 'VIC' ? VIC : NSW;

    const sectionRows = info.sections.map(sec => `
      <div class="section-row">
        <span style="font-size:22px;min-width:28px">${sec.emoji}</span>
        <div style="flex:1">
          <div style="font-weight:700;font-size:14px">${sec.label}</div>
          <div class="text-muted text-xs" style="margin-top:2px">${sec.desc}</div>
        </div>
        <div style="text-align:right;min-width:80px">
          ${UI.tag(sec.Qs === 1 ? '1 task' : sec.Qs + ' Qs', sec.color)}
          <div class="text-muted text-xs" style="margin-top:3px">${sec.mins} min</div>
        </div>
        <div style="min-width:110px;text-align:right">
          <button class="btn btn-sm btn-${sec.color}" onclick="Selective.openSection('${sec.id}')">
            ${sec.id.includes('writing') ? '✍️ Write' : '▶ Practice'}
          </button>
        </div>
      </div>`).join('');

    const practicePanel = _activeSection ? renderPracticePanel() : '';

    el.innerHTML = `<div class="page">
      <div class="flex gap-8 mb-20">
        <button class="btn ${_state==='VIC' ? 'btn-accent' : 'btn-outline-accent'}" onclick="Selective.setState('VIC')">🟦 Victoria (ACER)</button>
        <button class="btn ${_state==='NSW' ? 'btn-yellow' : 'btn-muted'}" onclick="Selective.setState('NSW')">🟨 NSW</button>
      </div>

      <div class="hero" style="margin-bottom:20px">
        <div class="mb-8">${UI.tag('SELECTIVE ENTRY PREPARATION', _state==='VIC' ? 'accent' : 'yellow')}</div>
        <h1>${info.flag} ${info.label} Selective Prep</h1>
        <p class="text-muted text-sm" style="margin-top:4px;max-width:540px">${info.note}</p>
        <div class="flex-center gap-12 mt-14 flex-wrap">
          <span class="text-muted text-sm">⏱ Total exam time: <strong style="color:var(--text)">${info.totalTime}</strong></span>
          <span class="text-muted text-sm">🏫 ${info.schools.slice(0,2).join(', ')} + more</span>
        </div>
      </div>

      <h2>Exam Sections — Click to Practice</h2>
      <div class="card mb-20" style="padding:0;overflow:hidden">
        ${sectionRows}
      </div>

      ${practicePanel}

      <h2>Key Tips for ${info.label}</h2>
      <div class="grid-2">
        <div class="card"><strong class="text-accent">⏱ Time Management</strong>
          <p class="text-sm text-muted" style="margin-top:6px">The exam is time-pressured. Practise doing ${_state==='VIC'?'60':'40'} questions in ${_state==='VIC'?'30':'40'} minutes. Skip and return to hard questions.</p></div>
        <div class="card"><strong class="text-green">🧠 Reasoning, Not Recall</strong>
          <p class="text-sm text-muted" style="margin-top:6px">You can't memorise your way through. The test measures HOW you think. Practise explaining your reasoning aloud.</p></div>
        <div class="card"><strong class="text-purple">📖 Wide Reading</strong>
          <p class="text-sm text-muted" style="margin-top:6px">Read novels, news, science articles. Aim to learn 5 new vocabulary words per day to boost verbal and reading sections.</p></div>
        <div class="card"><strong class="text-orange">✍️ Writing Quality</strong>
          <p class="text-sm text-muted" style="margin-top:6px">Aim for 200–300 words. Use varied sentence structure. Start with a strong hook. End memorably. Quality beats quantity.</p></div>
      </div>
    </div>`;
  }

  // ── SECTION PRACTICE PANEL ────────────────────────────────────────────────
  function renderPracticePanel() {
    const sec = ([...VIC.sections, ...NSW.sections]).find(s => s.id === _activeSection);
    if (!sec) return '';
    const isWriting = sec.id.includes('writing');

    let content = '';
    if (isWriting) {
      content = renderWritingPanel(sec);
    } else if (_loading) {
      content = UI.loading('Generating AI practice questions...');
    } else if (!_practiceQs.length) {
      content = UI.empty('🔍', 'No questions loaded yet.');
    } else {
      const qsHtml = _practiceQs.map((q, i) =>
        UI.renderQuestion(q, i, 'practice', { userAnswer: _practiceAnswers[i], submitted: _practiceSubmitted })
      ).join('');
      const submitted = _practiceSubmitted;
      const score = _practiceAnswers.filter((a, i) => a === _practiceQs[i]?.answer).length;
      content = `
        ${submitted ? `<div class="score-box ${score/_practiceQs.length>=0.6?'pass':'fail'} mb-14">
          <div class="score-number ${score/_practiceQs.length>=0.6?'text-green':'text-orange'}">${score} / ${_practiceQs.length}</div>
          <div class="text-muted text-sm mt-14">${score/_practiceQs.length>=0.6?'Well done! Review explanations.':'Review and try again!'}</div>
        </div>` : ''}
        ${qsHtml}
        ${!submitted
          ? `<button class="btn btn-${sec.color} btn-full btn-lg mt-14" onclick="Selective.submitPractice()">Check Answers</button>`
          : `<button class="btn btn-outline-${sec.color} btn-sm" onclick="Selective.openSection('${sec.id}')">🔄 New Questions</button>`}`;
    }

    return `<div class="card mb-20" style="border-color:var(--${sec.color},var(--accent))">
      <div class="flex-center gap-12 mb-14" style="justify-content:space-between;flex-wrap:wrap">
        <h2 style="margin:0">${sec.emoji} ${sec.label} — Practice</h2>
        <div class="flex gap-8">
          ${!isWriting ? `<button class="btn btn-sm btn-outline-${sec.color}" onclick="Selective.openSection('${sec.id}')">🔄 New Questions</button>` : ''}
          <button class="btn btn-sm btn-muted" onclick="Selective.closeSection()">✖ Close</button>
        </div>
      </div>
      ${content}
    </div>`;
  }

  // ── WRITING PANEL ─────────────────────────────────────────────────────────
  function renderWritingPanel(sec) {
    const prompt = _writingPrompt || WRITING_PROMPTS[0];
    const wordCount = _writingText.split(/\s+/).filter(Boolean).length;
    return `
      <div class="card mb-14" style="border-color:rgba(247,79,160,.4)">
        ${UI.tag(prompt.type, 'pink')}
        <p style="margin-top:10px;font-size:15px;line-height:1.75">${prompt.text}</p>
        <button class="btn btn-sm btn-outline-pink mt-14" onclick="Selective.newWritingPrompt()">🔄 New Prompt</button>
      </div>
      <textarea id="writing-area" placeholder="Write your response here (aim for 200–300 words for VIC, 200–250 for NSW)..." 
        oninput="Selective.updateWriting(this.value)" style="min-height:200px;margin-bottom:8px">${_writingText}</textarea>
      <div class="flex-center gap-12 mb-14" style="justify-content:space-between">
        <span class="word-count">${wordCount} words</span>
        <button class="btn btn-pink" onclick="Selective.submitWriting()" ${_loading || !_writingText.trim() ? 'disabled' : ''}>
          ${_loading ? '⏳ Marking...' : '📋 Get AI Feedback'}
        </button>
      </div>
      ${_writingFeedback ? `
        <div class="card" style="border-color:rgba(61,214,140,.4)">
          <div style="font-weight:800;color:var(--green);margin-bottom:10px">📋 AI Marker Feedback</div>
          <pre style="white-space:pre-wrap;font-size:14px;line-height:1.85;font-family:var(--font)">${_writingFeedback}</pre>
        </div>` : ''}`;
  }

  // ── OPEN SECTION ──────────────────────────────────────────────────────────
  async function openSection(sectionId) {
    _activeSection = sectionId;
    _practiceSubmitted = false;
    _practiceAnswers = [];
    _writingFeedback = '';

    if (sectionId.includes('writing')) {
      if (!_writingPrompt) newWritingPrompt();
      render();
      return;
    }

    _loading = true;
    render();

    const local = QB.filter({ section: sectionId, limit: 5 });
    if (local.length >= 3) {
      _practiceQs = local;
    } else {
      const ai = await QB.generateAI(sectionId, 5 - local.length);
      _practiceQs = [...local, ...ai];
    }
    _practiceAnswers = Array(_practiceQs.length).fill(null);
    _loading = false;
    render();
  }

  function closeSection() { _activeSection = null; render(); }

  // ── PRACTICE INTERACTIONS ─────────────────────────────────────────────────
  function selectPracticeAnswer(qi, ai) {
    if (_practiceSubmitted) return;
    _practiceAnswers[qi] = ai;
    render();
  }

  function submitPractice() { _practiceSubmitted = true; render(); }

  // ── WRITING ───────────────────────────────────────────────────────────────
  function updateWriting(val) { _writingText = val; }

  function newWritingPrompt() {
    _writingPrompt = WRITING_PROMPTS[Math.floor(Math.random() * WRITING_PROMPTS.length)];
    _writingText = '';
    _writingFeedback = '';
    render();
  }

  async function submitWriting() {
    if (!_writingText.trim()) return;
    _loading = true;
    render();
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 1000,
          system: `You are a selective exam writing marker for Australian students (Year 6-8). Score out of 10 each. Be encouraging. Under 220 words.
Format exactly:
SCORES:
Ideas & Content: X/10
Structure: X/10
Language & Vocab: X/10
Grammar & Mechanics: X/10
TOTAL: X/40

STRENGTHS: [2-3 specific positives]
TO IMPROVE: [2-3 specific suggestions]
VERDICT: [one encouraging sentence]`,
          messages: [{ role: 'user', content: `Prompt: ${_writingPrompt?.text || 'Write a story.'}\n\nStudent response:\n${_writingText}` }],
        }),
      });
      const data = await res.json();
      _writingFeedback = data.content?.map(c => c.text || '').join('') || 'Could not get feedback.';
    } catch { _writingFeedback = 'Something went wrong. Please try again.'; }
    _loading = false;
    render();
  }

  function setState(s) { _state = s; _activeSection = null; render(); }

  return {
    render, setState, openSection, closeSection,
    selectPracticeAnswer, submitPractice,
    updateWriting, newWritingPrompt, submitWriting,
  };
})();
