// ── exams.js ── Timed Mock Exams ─────────────────────────────────────────────

const Exams = (() => {

  const EXAM_DEFS = [
    { id:'e1', title:'VIC – Reading Reasoning',      state:'VIC', section:'vic_reading',  duration:10, count:3, color:'accent' },
    { id:'e2', title:'VIC – Mathematics Reasoning',  state:'VIC', section:'vic_maths',    duration:10, count:3, color:'green'  },
    { id:'e3', title:'VIC – Verbal Reasoning',       state:'VIC', section:'vic_verbal',   duration:8,  count:3, color:'purple' },
    { id:'e4', title:'VIC – Quantitative Reasoning', state:'VIC', section:'vic_quant',    duration:8,  count:3, color:'orange' },
    { id:'e5', title:'NSW – Thinking Skills',        state:'NSW', section:'nsw_thinking', duration:8,  count:3, color:'purple' },
    { id:'e6', title:'NSW – Mathematical Reasoning', state:'NSW', section:'nsw_maths',    duration:8,  count:2, color:'green'  },
    { id:'e7', title:'VIC – Mixed Selective (Full)', state:'VIC', section:'ALL',           duration:20, count:10, color:'accent' },
  ];

  let _active = null;   // { def, questions, answers, submitted, timerInterval }
  let _timeLeft = 0;

  // ── RENDER LIST ───────────────────────────────────────────────────────────
  function render() {
    const el = document.getElementById('app');
    el.innerHTML = `<div class="page">
      <h1>📝 Mock Exams</h1>
      <p class="text-muted mb-20">Timed exams modelled on Australian selective entry format. Real timer — just like the real thing.</p>
      <div class="grid-2">
        ${EXAM_DEFS.map(def => `
          <div class="card" style="border-color:rgba(var(--${def.color}-rgb, 79,142,247),.3)">
            <div class="mb-8 flex gap-8 flex-wrap">
              ${UI.tag(def.state, def.state === 'VIC' ? 'accent' : 'yellow')}
              ${UI.tag(UI.SECTION_LABELS[def.section] || def.section, def.color)}
            </div>
            <h3 style="margin-bottom:6px">${def.title}</h3>
            <p class="text-muted text-sm mb-14">⏱ ${def.duration} min &nbsp;·&nbsp; 📋 ${def.count} questions</p>
            <button class="btn btn-${def.color} btn-sm" onclick="Exams.start('${def.id}')">Start Exam →</button>
          </div>`).join('')}
      </div>
    </div>`;
  }

  // ── START EXAM ────────────────────────────────────────────────────────────
  async function start(defId) {
    const def = EXAM_DEFS.find(d => d.id === defId);
    if (!def) return;

    const el = document.getElementById('app');
    el.innerHTML = `<div class="page">${UI.loading('Loading exam questions...')}</div>`;

    let questions = QB.filter({ section: def.section === 'ALL' ? undefined : def.section, limit: def.count });

    // Top up with AI if not enough
    if (questions.length < def.count && def.section !== 'ALL') {
      el.innerHTML = `<div class="page">${UI.loading('Generating AI questions...')}</div>`;
      const aiQs = await QB.generateAI(def.section, def.count - questions.length);
      questions = [...questions, ...aiQs];
    }

    if (!questions.length) {
      el.innerHTML = `<div class="page">${UI.empty('😕', 'No questions found for this exam.')}</div>`;
      return;
    }

    _active = { def, questions, answers: Array(questions.length).fill(null), submitted: false };
    _timeLeft = def.duration * 60;

    // Clear old timer
    if (_active.timerInterval) clearInterval(_active.timerInterval);
    _active.timerInterval = setInterval(() => {
      _timeLeft--;
      updateTimer();
      if (_timeLeft <= 0) { clearInterval(_active.timerInterval); submitExam(); }
    }, 1000);

    renderExam();
  }

  // ── SELECT ANSWER ─────────────────────────────────────────────────────────
  function selectAnswer(idx, optIdx) {
    if (!_active || _active.submitted) return;
    _active.answers[idx] = optIdx;
    renderExam();
  }

  // ── SUBMIT ────────────────────────────────────────────────────────────────
  function submitExam() {
    if (!_active) return;
    clearInterval(_active.timerInterval);
    _active.submitted = true;
    renderExam();
  }

  // ── UPDATE TIMER ONLY (efficient) ─────────────────────────────────────────
  function updateTimer() {
    const el = document.getElementById('exam-timer');
    if (!el) return;
    const m = Math.floor(_timeLeft / 60);
    const s = (_timeLeft % 60).toString().padStart(2, '0');
    el.textContent = `⏱ ${m}:${s}`;
    el.className = 'timer' + (_timeLeft < 30 ? ' danger' : _timeLeft < 90 ? ' warning' : '');
  }

  // ── RENDER EXAM ───────────────────────────────────────────────────────────
  function renderExam() {
    if (!_active) return;
    const { def, questions, answers, submitted } = _active;
    const m = Math.floor(_timeLeft / 60);
    const s = (_timeLeft % 60).toString().padStart(2, '0');
    const score = answers.filter((a, i) => a === questions[i]?.answer).length;
    const timerClass = 'timer' + (_timeLeft < 30 ? ' danger' : _timeLeft < 90 ? ' warning' : '');

    const el = document.getElementById('app');
    el.innerHTML = `<div class="page">
      <div class="flex-center mb-20" style="justify-content:space-between;flex-wrap:wrap;gap:12px">
        <div>
          <h1>${def.title}</h1>
          <p class="text-muted text-sm">${questions.length} questions</p>
        </div>
        <div class="flex-center gap-12">
          ${!submitted ? `<span id="exam-timer" class="${timerClass}">⏱ ${m}:${s}</span>` : ''}
          ${!submitted
            ? `<button class="btn btn-orange" onclick="Exams.submitExam()">Submit Exam</button>`
            : `<button class="btn btn-muted" onclick="Exams.render()">← Back to Exams</button>`}
        </div>
      </div>

      ${submitted ? UI.scoreBox(score, questions.length, `Exams.start('${def.id}')`) : ''}

      ${questions.map((q, i) => UI.renderQuestion(q, i, 'exam', { userAnswer: answers[i], submitted })).join('')}

      ${!submitted ? `<button class="btn btn-orange btn-lg btn-full mt-20" onclick="Exams.submitExam()">
        Submit Exam (${answers.filter(a=>a!==null).length}/${questions.length} answered)
      </button>` : ''}
    </div>`;
  }

  return { render, start, selectAnswer, submitExam };
})();
