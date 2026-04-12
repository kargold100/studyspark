// ── ui.js ── Shared UI helpers: nav, cards, tags, modals ────────────────────

const UI = (() => {

  // ── COLOUR MAP ─────────────────────────────────────────────────────────────
  const SECTION_COLORS = {
    vic_reading: 'accent', vic_maths: 'green', vic_verbal: 'purple',
    vic_quant: 'orange', vic_writing: 'pink',
    nsw_reading: 'accent', nsw_maths: 'green', nsw_thinking: 'purple', nsw_writing: 'pink',
  };

  const SUBJECT_COLORS = {
    Mathematics: 'accent', English: 'pink', Science: 'green',
    History: 'orange', Geography: 'purple',
  };

  const SECTION_LABELS = {
    vic_reading: '📖 Reading Reasoning',  vic_maths:   '🔢 Maths Reasoning',
    vic_verbal:  '🧠 Verbal Reasoning',   vic_quant:   '📐 Quant Reasoning',
    vic_writing: '✍️ Writing',
    nsw_reading: '📖 Reading',            nsw_maths:   '🔢 Maths Reasoning',
    nsw_thinking:'🧩 Thinking Skills',    nsw_writing: '✍️ Writing',
  };

  // ── RENDER NAV ─────────────────────────────────────────────────────────────
  function renderNav(activeScreen) {
    const items = [
      { id: 'home',      label: '🏠 Home' },
      { id: 'browse',    label: '📋 Question Bank' },
      { id: 'practice',  label: '✏️ Practice' },
      { id: 'exams',     label: '📝 Mock Exams' },
      { id: 'selective', label: '🏆 Selective' },
      { id: 'study',     label: '📚 Study Notes' },
      { id: 'tutor',     label: '🤖 AI Tutor' },
    ];
    document.getElementById('nav').innerHTML = items.map(i =>
      `<button class="nav-btn ${activeScreen === i.id ? 'active' : ''}" onclick="App.navigate('${i.id}')">${i.label}</button>`
    ).join('');
  }

  // ── TAG HTML ───────────────────────────────────────────────────────────────
  function tag(text, color = 'muted') {
    return `<span class="tag tag-${color}">${text}</span>`;
  }

  // ── RENDER A QUESTION CARD ─────────────────────────────────────────────────
  // mode: 'practice' | 'browse' | 'exam'
  // state: { userAnswer: null|int, submitted: bool, revealed: bool }
  function renderQuestion(q, idx, mode, state = {}) {
    const { userAnswer = null, submitted = false, revealed = false } = state;
    const isCorrect = userAnswer === q.answer;
    let cardClass = 'question-card';
    if (submitted) cardClass += isCorrect ? ' correct' : ' incorrect';
    if (revealed && !submitted) cardClass += ' revealed';

    const options = q.options.map((opt, oi) => {
      let cls = 'option';
      if (userAnswer === oi) cls += ' selected';
      if (submitted || revealed) {
        cls += ' disabled';
        if (oi === q.answer) cls += ' correct-ans';
        else if (userAnswer === oi && submitted) cls += ' wrong-ans';
      }
      const tick = (submitted || revealed) && oi === q.answer ? '<span class="tick">✓</span>' :
                   submitted && userAnswer === oi && oi !== q.answer ? '<span class="tick">✗</span>' : '';
      const clickHandler = (!submitted && !revealed && mode !== 'browse')
        ? `onclick="Practice.selectAnswer(${idx}, ${oi})"` : '';
      return `<div class="${cls}" ${clickHandler}>
        <span class="letter">${String.fromCharCode(65+oi)}.</span>
        <span>${opt}</span>${tick}
      </div>`;
    }).join('');

    const expHtml = (submitted || revealed) && q.exp
      ? `<div class="explanation"><strong>Explanation:</strong> ${q.exp}</div>` : '';

    const metaTags = [
      q.section ? tag(SECTION_LABELS[q.section] || q.section, SECTION_COLORS[q.section] || 'muted') : '',
      q.topic ? tag(q.topic, 'muted') : '',
      q.difficulty ? tag(q.difficulty, q.difficulty === 'easy' ? 'green' : q.difficulty === 'hard' ? 'orange' : 'muted') : '',
      q.grade ? tag('Gr ' + q.grade, 'accent') : '',
    ].filter(Boolean).join(' ');

    const actionBtns = mode === 'browse'
      ? `<div class="mt-14 flex gap-8">
           <button class="btn btn-sm btn-outline-accent" onclick="Browse.toggleAnswer('${q.id}')">
             ${revealed ? '🙈 Hide Answer' : '👁 Show Answer'}
           </button>
           <button class="btn btn-sm btn-muted" onclick="Practice.startWith('${q.id}')">✏️ Practice This</button>
         </div>`
      : '';

    return `<div class="${cardClass}" id="qcard-${q.id || idx}">
      <div class="mb-8 flex gap-8 flex-wrap">${metaTags}</div>
      <div class="question-text">Q${idx+1}. ${q.q}</div>
      <div class="options">${options}</div>
      ${expHtml}
      ${actionBtns}
    </div>`;
  }

  // ── LOADING SPINNER ────────────────────────────────────────────────────────
  function loading(msg = 'Loading...') {
    return `<div class="loading"><span class="spinner">⏳</span>${msg}</div>`;
  }

  // ── EMPTY STATE ────────────────────────────────────────────────────────────
  function empty(emoji, msg) {
    return `<div class="loading"><span style="font-size:36px;display:block;margin-bottom:10px">${emoji}</span><span class="text-muted">${msg}</span></div>`;
  }

  // ── SCORE BOX ──────────────────────────────────────────────────────────────
  function scoreBox(correct, total, onRetry) {
    const pct = Math.round(correct / total * 100);
    const pass = pct >= 60;
    return `<div class="score-box ${pass ? 'pass' : 'fail'}">
      <div style="font-size:34px;margin-bottom:8px">${pass ? '🎉' : '💪'}</div>
      <div class="score-number ${pass ? 'text-green' : 'text-orange'}">${correct} / ${total}</div>
      <div class="text-muted text-sm mt-14">${pass ? 'Great work! Review the explanations below.' : 'Review explanations and try again — you\'ve got this!'}</div>
      <div class="mt-14 flex gap-8" style="justify-content:center">
        ${onRetry ? `<button class="btn btn-accent" onclick="${onRetry}">🔄 Try Again</button>` : ''}
        <button class="btn btn-muted" onclick="App.navigate('exams')">← Back to Exams</button>
      </div>
    </div>`;
  }

  // ── FILTER BAR ─────────────────────────────────────────────────────────────
  function filterBar(opts, current, onChangeCallback) {
    const sel = (name, label, values) => {
      const options = values.map(v =>
        `<option value="${v}" ${current[name] === v ? 'selected' : ''}>${v === 'ALL' ? 'All ' + label : v}</option>`
      ).join('');
      return `<div>
        <label class="text-xs text-muted">${label.toUpperCase()}</label>
        <select style="max-width:140px;margin-top:4px" onchange="${onChangeCallback}('${name}', this.value)">${options}</select>
      </div>`;
    };
    return `<div class="filter-bar">
      ${sel('section', 'Section', opts.sections)}
      ${sel('grade',   'Grade',   opts.grades)}
      ${sel('topic',   'Topic',   opts.topics)}
      ${sel('difficulty', 'Difficulty', opts.difficulties)}
    </div>`;
  }

  return {
    renderNav, tag, renderQuestion, loading, empty, scoreBox, filterBar,
    SECTION_COLORS, SUBJECT_COLORS, SECTION_LABELS,
  };
})();
