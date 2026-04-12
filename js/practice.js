// ── practice.js ── Practice Mode ────────────────────────────────────────────
// Lets users answer questions one at a time (or in a set).
// Validates answers immediately or in batch. Tracks score.

const Practice = (() => {

  let _questions  = [];
  let _answers    = [];   // null | int per question
  let _submitted  = [];   // bool per question (individually validated)
  let _batchDone  = false; // true if entire set submitted at once
  let _mode       = 'one-by-one'; // 'one-by-one' | 'batch'
  let _current    = 0;
  let _filters    = {};
  let _score      = 0;

  // ── START WITH FILTERS ────────────────────────────────────────────────────
  function startFiltered(filters = {}, mode = 'one-by-one') {
    _filters = filters;
    _mode = mode;
    _current = 0;
    _batchDone = false;
    _questions = QB.filter({ ...filters, limit: filters.limit || 10 });
    _answers = Array(_questions.length).fill(null);
    _submitted = Array(_questions.length).fill(false);
    _score = 0;
    render();
  }

  // ── START WITH SPECIFIC QUESTION ID ──────────────────────────────────────
  function startWith(id) {
    const all = QB.filter({});
    const q = all.find(q => q.id === id);
    if (!q) return;
    _questions = [q];
    _answers = [null];
    _submitted = [false];
    _mode = 'one-by-one';
    _batchDone = false;
    _current = 0;
    App.navigate('practice');
  }

  // ── SELECT ANSWER ─────────────────────────────────────────────────────────
  function selectAnswer(idx, optionIdx) {
    if (_batchDone) return;
    if (_mode === 'one-by-one' && _submitted[idx]) return;
    _answers[idx] = optionIdx;
    render();
  }

  // ── VALIDATE SINGLE (one-by-one mode) ────────────────────────────────────
  function validateOne(idx) {
    if (_answers[idx] === null) {
      alert('Please select an answer first.');
      return;
    }
    _submitted[idx] = true;
    if (_answers[idx] === _questions[idx].answer) _score++;
    render();
    // Auto advance after brief delay if correct
    if (_mode === 'one-by-one' && idx < _questions.length - 1) {
      setTimeout(() => { _current = idx + 1; render(); }, 1200);
    }
  }

  // ── SUBMIT ALL (batch mode) ───────────────────────────────────────────────
  function submitAll() {
    _batchDone = true;
    _score = _answers.filter((a, i) => a === _questions[i]?.answer).length;
    _submitted = _submitted.map(() => true);
    render();
  }

  // ── NAVIGATE QUESTIONS (one-by-one) ──────────────────────────────────────
  function goTo(idx) {
    if (idx < 0 || idx >= _questions.length) return;
    _current = idx;
    render();
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  function render() {
    const el = document.getElementById('app');
    if (!_questions.length) {
      el.innerHTML = renderSetup();
      return;
    }
    if (_mode === 'one-by-one') renderOneByOne(el);
    else renderBatch(el);
  }

  // ── SETUP SCREEN ──────────────────────────────────────────────────────────
  function renderSetup() {
    const opts = QB.getFilterOptions();
    const selectivesSections = [
      { id: 'vic_reading', label: '📖 VIC Reading Reasoning' },
      { id: 'vic_maths',   label: '🔢 VIC Maths Reasoning' },
      { id: 'vic_verbal',  label: '🧠 VIC Verbal Reasoning' },
      { id: 'vic_quant',   label: '📐 VIC Quant Reasoning' },
      { id: 'nsw_thinking',label: '🧩 NSW Thinking Skills' },
      { id: 'nsw_maths',   label: '🔢 NSW Maths' },
    ];

    return `<div class="page">
      <h1>✏️ Practice Mode</h1>
      <p class="text-muted mb-20">Choose how you want to practise. Answer questions and get instant feedback.</p>

      <div class="grid-2 mb-20">
        <div class="card card-hover" onclick="Practice.startFiltered({limit:10}, 'one-by-one')" style="border-color:rgba(79,142,247,.4)">
          <div style="font-size:28px;margin-bottom:8px">1️⃣</div>
          <h3>One at a Time</h3>
          <p class="text-muted text-sm">Answer each question individually. Get instant right/wrong feedback before moving on.</p>
          <div class="mt-14"><button class="btn btn-accent btn-sm">Start</button></div>
        </div>
        <div class="card card-hover" onclick="Practice.startFiltered({limit:10}, 'batch')" style="border-color:rgba(61,214,140,.4)">
          <div style="font-size:28px;margin-bottom:8px">📋</div>
          <h3>Answer All Then Check</h3>
          <p class="text-muted text-sm">Answer all questions first. Submit at the end to see all results and explanations.</p>
          <div class="mt-14"><button class="btn btn-green btn-sm">Start</button></div>
        </div>
      </div>

      <h2>Practice by Section</h2>
      <div class="grid-3 mb-20">
        ${selectivesSections.map(s => `
          <div class="card card-hover" onclick="Practice.startFiltered({section:'${s.id}',limit:8},'one-by-one')" style="border-color:rgba(79,142,247,.25)">
            <div style="font-weight:700;font-size:14px;margin-bottom:6px">${s.label}</div>
            <div class="text-muted text-sm">${QB.filter({section:s.id}).length} questions available</div>
            <button class="btn btn-sm btn-outline-accent mt-14">Practice</button>
          </div>`).join('')}
      </div>

      <h2>Custom Practice</h2>
      ${UI.filterBar(opts, {section:'ALL',grade:'ALL',topic:'ALL',difficulty:'ALL'}, 'Practice.tempFilter')}
      <div id="custom-count" class="text-muted text-sm mb-14"></div>
      <div class="flex gap-8">
        <button class="btn btn-accent" onclick="Practice.startCustom('one-by-one')">✏️ One at a Time</button>
        <button class="btn btn-outline-green" onclick="Practice.startCustom('batch')">📋 Answer All Then Check</button>
        <button class="btn btn-muted" onclick="QB.generateAI(Practice._tempFilters?.section||'vic_maths',4).then(()=>Practice.render())">⚡ Generate AI Questions</button>
      </div>
    </div>`;
  }

  let _tempFilters = {};
  function tempFilter(key, val) {
    _tempFilters[key] = val;
    const count = QB.filter(_tempFilters).length;
    const el = document.getElementById('custom-count');
    if (el) el.textContent = `${count} questions match your filters`;
  }
  function startCustom(mode) {
    startFiltered({ ..._tempFilters, limit: 10 }, mode);
  }

  // ── ONE-BY-ONE RENDER ─────────────────────────────────────────────────────
  function renderOneByOne(el) {
    const q = _questions[_current];
    const answered = _answers[_current];
    const submitted = _submitted[_current];
    const done = _current >= _questions.length - 1 && submitted;

    const pct = Math.round((_current / _questions.length) * 100);
    const progress = `<div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>`;

    const qHtml = UI.renderQuestion(q, _current, 'practice', { userAnswer: answered, submitted });

    const navBtns = submitted
      ? (_current < _questions.length - 1
          ? `<button class="btn btn-accent" onclick="Practice.goTo(${_current + 1})">Next Question →</button>`
          : `<div class="score-box ${_score/_questions.length >= 0.6 ? 'pass' : 'fail'}">
               <div style="font-size:30px;margin-bottom:8px">${_score/_questions.length >= 0.6 ? '🎉' : '💪'}</div>
               <div class="score-number ${_score/_questions.length >= 0.6 ? 'text-green' : 'text-orange'}">${_score} / ${_questions.length}</div>
               <div class="text-muted text-sm mt-14">${_score/_questions.length >= 0.6 ? 'Well done!' : 'Keep practising!'}</div>
               <div class="flex gap-8 mt-14" style="justify-content:center">
                 <button class="btn btn-accent" onclick="Practice.startFiltered(Practice._filters,'one-by-one')">🔄 Try Again</button>
                 <button class="btn btn-muted" onclick="App.navigate('practice')">← New Practice</button>
               </div>
             </div>`)
      : `<button class="btn btn-accent" onclick="Practice.validateOne(${_current})" ${answered === null ? 'disabled' : ''}>
           ✅ Check Answer
         </button>`;

    el.innerHTML = `<div class="page">
      <div class="flex-center gap-12 mb-14" style="justify-content:space-between;flex-wrap:wrap">
        <div>
          <h1>✏️ Practice</h1>
          <p class="text-muted text-sm">Question ${_current + 1} of ${_questions.length} &nbsp;·&nbsp; Score: ${_score} correct</p>
        </div>
        <div class="flex gap-8">
          <span class="tag tag-accent">${_mode === 'one-by-one' ? 'Instant Feedback' : 'Batch Mode'}</span>
          <button class="btn btn-sm btn-muted" onclick="App.navigate('practice')">✖ Exit</button>
        </div>
      </div>
      ${progress}
      <div class="mb-8 flex gap-8 flex-wrap" style="margin-top:8px">
        ${_questions.map((_, i) => {
          let style = 'background:var(--border);color:var(--muted);';
          if (i === _current) style = 'background:var(--accent);color:#fff;';
          else if (_submitted[i]) style = _answers[i] === _questions[i].answer ? 'background:var(--green);color:#0a1a0a;' : 'background:var(--red);color:#fff;';
          return `<button onclick="Practice.goTo(${i})" style="${style}padding:3px 9px;border-radius:6px;border:none;cursor:pointer;font-size:12px;font-weight:700;">${i+1}</button>`;
        }).join('')}
      </div>
      ${qHtml}
      <div class="mt-14">${navBtns}</div>
    </div>`;
  }

  // ── BATCH RENDER ──────────────────────────────────────────────────────────
  function renderBatch(el) {
    const allAnswered = _answers.every(a => a !== null);
    const qHtml = _questions.map((q, i) =>
      UI.renderQuestion(q, i, 'practice', { userAnswer: _answers[i], submitted: _batchDone })
    ).join('');

    el.innerHTML = `<div class="page">
      <div class="flex-center gap-12 mb-14" style="justify-content:space-between;flex-wrap:wrap">
        <div>
          <h1>📋 Practice — Answer All</h1>
          <p class="text-muted text-sm">${_questions.length} questions &nbsp;·&nbsp; Answer all then submit</p>
        </div>
        <button class="btn btn-sm btn-muted" onclick="App.navigate('practice')">✖ Exit</button>
      </div>
      ${_batchDone ? UI.scoreBox(_score, _questions.length, 'Practice.startFiltered(Practice._filters,"batch")') : ''}
      ${qHtml}
      ${!_batchDone ? `<button class="btn btn-accent btn-lg btn-full mt-20" onclick="Practice.submitAll()" ${!allAnswered ? 'disabled' : ''}>
        ${allAnswered ? '✅ Submit All Answers' : `Answer all questions (${_answers.filter(a=>a!==null).length}/${_questions.length} done)`}
      </button>` : ''}
    </div>`;
  }

  return {
    render, startFiltered, startWith, startCustom, selectAnswer,
    validateOne, submitAll, goTo, tempFilter,
    get _filters() { return _filters; },
    get _tempFilters() { return _tempFilters; },
  };
})();
