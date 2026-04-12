// ── browse.js ── Question Bank Browser ──────────────────────────────────────
// Shows all questions with filters. Users can browse, reveal answers,
// or send a question directly to practice mode.

const Browse = (() => {

  let _filters = { section: 'ALL', grade: 'ALL', topic: 'ALL', difficulty: 'ALL' };
  let _revealedIds = new Set();    // IDs where answer is currently shown
  let _questions = [];             // current filtered list

  // ── RENDER ────────────────────────────────────────────────────────────────
  function render() {
    const el = document.getElementById('app');
    const opts = QB.getFilterOptions();
    _questions = QB.filter(_filters);

    const stats = QB.stats();

    el.innerHTML = `
      <div class="page">
        <div class="flex-center gap-12 mb-14" style="flex-wrap:wrap;justify-content:space-between">
          <div>
            <h1>📋 Question Bank</h1>
            <p class="text-muted text-sm">${stats.total} questions total &nbsp;·&nbsp; ${stats.local} local &nbsp;·&nbsp; ${stats.session} AI-generated this session</p>
          </div>
          <div class="flex gap-8">
            <button class="btn btn-sm btn-outline-accent" onclick="Browse.generateMore()">⚡ Generate More with AI</button>
            <button class="btn btn-sm btn-muted" onclick="Browse.revealAll()">👁 Show All Answers</button>
            <button class="btn btn-sm btn-muted" onclick="Browse.hideAll()">🙈 Hide All Answers</button>
          </div>
        </div>

        ${UI.filterBar(opts, _filters, 'Browse.updateFilter')}

        <div id="browse-list">
          ${_questions.length === 0
            ? UI.empty('🔍', 'No questions match your filters. Try adjusting the filters above or generate AI questions.')
            : _questions.map((q, i) => UI.renderQuestion(q, i, 'browse', { revealed: _revealedIds.has(q.id) })).join('')
          }
        </div>

        ${_questions.length > 0 ? `
          <div class="mt-20 flex gap-8 flex-wrap">
            <button class="btn btn-accent" onclick="Practice.startFiltered(${JSON.stringify(_filters).replace(/"/g,'&quot;')})">
              ✏️ Practice These ${_questions.length} Questions
            </button>
            <button class="btn btn-outline-green" onclick="Browse.generateMore()">
              ⚡ Generate More Questions (AI)
            </button>
          </div>` : ''}
      </div>`;
  }

  // ── UPDATE FILTER ─────────────────────────────────────────────────────────
  function updateFilter(key, value) {
    _filters[key] = value;
    render();
  }

  // ── TOGGLE SINGLE ANSWER ──────────────────────────────────────────────────
  function toggleAnswer(id) {
    if (_revealedIds.has(id)) _revealedIds.delete(id);
    else _revealedIds.add(id);
    render();
  }

  // ── REVEAL / HIDE ALL ─────────────────────────────────────────────────────
  function revealAll() {
    _questions.forEach(q => _revealedIds.add(q.id));
    render();
  }

  function hideAll() {
    _revealedIds.clear();
    render();
  }

  // ── GENERATE MORE AI QUESTIONS ────────────────────────────────────────────
  async function generateMore() {
    const section = _filters.section !== 'ALL' ? _filters.section : 'vic_maths';
    const el = document.getElementById('browse-list');
    el.innerHTML = UI.loading(`Generating new AI questions for "${section}"...`);
    await QB.generateAI(section, 4);
    render();
  }

  return { render, updateFilter, toggleAnswer, revealAll, hideAll, generateMore };
})();
