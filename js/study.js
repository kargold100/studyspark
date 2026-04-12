// ── study.js ── Study Notes Module ───────────────────────────────────────────

const Study = (() => {

  let _notesData = {};
  let _subject = null;
  let _topic = null;
  let _notes = '';
  let _loading = false;

  const SUBJECT_META = {
    Mathematics: { emoji: '🔢', color: 'accent'  },
    English:     { emoji: '📖', color: 'pink'    },
    Science:     { emoji: '🔬', color: 'green'   },
    History:     { emoji: '🏛️', color: 'orange'  },
    Geography:   { emoji: '🌍', color: 'purple'  },
  };

  // ── LOAD NOTES FROM JSON ──────────────────────────────────────────────────
  async function loadNotesData() {
    try {
      const res = await fetch('data/notes.json');
      const data = await res.json();
      _notesData = data.subjects || {};
    } catch (e) {
      console.warn('[Study] Could not load notes.json', e);
      _notesData = {};
    }
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  function render() {
    const el = document.getElementById('app');
    if (!_subject) {
      renderSubjects(el);
    } else if (!_topic) {
      renderTopics(el);
    } else {
      renderNotes(el);
    }
  }

  function renderSubjects(el) {
    const subjects = Object.keys(_notesData).length
      ? Object.keys(_notesData)
      : Object.keys(SUBJECT_META);

    el.innerHTML = `<div class="page">
      <h1>📚 Study Notes</h1>
      <p class="text-muted mb-20">AI-generated study notes for Australian Grades 6–10 curriculum.</p>
      <div class="grid-3">
        ${subjects.map(sub => {
          const meta = SUBJECT_META[sub] || { emoji: '📘', color: 'accent' };
          const topics = _notesData[sub] ? Object.keys(_notesData[sub]) : [];
          return `<div class="card card-hover" style="border-color:rgba(var(--${meta.color}-rgb,79,142,247),.35)" onclick="Study.selectSubject('${sub}')">
            <div style="font-size:28px;margin-bottom:8px">${meta.emoji}</div>
            <h3>${sub}</h3>
            <p class="text-muted text-sm">${topics.length} topics</p>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }

  function renderTopics(el) {
    const meta = SUBJECT_META[_subject] || { emoji: '📘', color: 'accent' };
    const topicsData = _notesData[_subject] || {};
    const topics = Object.keys(topicsData);

    // If no topics in data, show AI-generate option
    const defaultTopics = {
      Mathematics: ['Algebra','Geometry','Fractions & Decimals','Statistics & Data','Probability','Number Theory'],
      English:     ['Reading Comprehension','Grammar & Punctuation','Vocabulary','Persuasive Writing','Creative Writing','Poetry Analysis'],
      Science:     ['Cells & Biology','Elements & Chemistry','Forces & Physics','Earth Science','Ecology','Scientific Method'],
      History:     ['World War I & II','Australian History','Ancient Civilisations','Democracy & Government','The Cold War','Civil Rights'],
      Geography:   ['Climate & Weather','Natural Disasters','Landforms','Population Studies','Map Skills','Sustainability'],
    };
    const allTopics = topics.length ? topics : (defaultTopics[_subject] || []);

    el.innerHTML = `<div class="page">
      <button class="btn btn-sm btn-muted mb-14" onclick="Study.back()">← Back to Subjects</button>
      <h1>${meta.emoji} ${_subject}</h1>
      <p class="text-muted mb-20">Select a topic to view study notes.</p>
      <div class="grid-2">
        ${allTopics.map(topic => {
          const hasLocal = !!(topicsData[topic]);
          return `<div class="card card-hover" style="border-color:rgba(var(--${meta.color}-rgb,79,142,247),.3)" onclick="Study.selectTopic('${topic}')">
            <h3 style="margin-bottom:4px">${topic}</h3>
            <p class="text-muted text-xs">${hasLocal ? '✅ Notes ready' : '⚡ AI-generated on demand'}</p>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }

  function renderNotes(el) {
    const meta = SUBJECT_META[_subject] || { emoji: '📘', color: 'accent' };
    el.innerHTML = `<div class="page">
      <button class="btn btn-sm btn-muted mb-14" onclick="Study.backToTopics()">← Back to ${_subject}</button>
      <h1>${_topic}</h1>
      <div class="flex gap-8 mb-14 flex-wrap">
        ${UI.tag(_subject, meta.color)}
        ${UI.tag('Grades 7–10', 'muted')}
      </div>
      ${_loading
        ? UI.loading('Generating study notes...')
        : `<div class="notes-content">${formatNotes(_notes)}</div>
           <div class="flex gap-8 mt-14 flex-wrap">
             <button class="btn btn-accent" onclick="Study.practiceThisTopic()">✏️ Practice Questions</button>
             <button class="btn btn-outline-green" onclick="Study.regenerate()">🔄 Regenerate Notes</button>
             <button class="btn btn-muted" onclick="Study.askTutor()">🤖 Ask AI Tutor</button>
           </div>`}
    </div>`;
  }

  // ── FORMAT NOTES (convert ## headings) ───────────────────────────────────
  function formatNotes(text) {
    return text
      .replace(/^## (.+)$/gm, '<h3>$1</h3>')
      .replace(/^# (.+)$/gm, '<h2>$1</h2>')
      .replace(/\n/g, '<br>');
  }

  // ── NAVIGATION ────────────────────────────────────────────────────────────
  function selectSubject(sub) { _subject = sub; _topic = null; _notes = ''; render(); }
  function selectTopic(topic) { _topic = topic; loadNotes(); }
  function back() { _subject = null; _topic = null; render(); }
  function backToTopics() { _topic = null; _notes = ''; render(); }

  // ── LOAD NOTES ────────────────────────────────────────────────────────────
  async function loadNotes() {
    // Check local data first
    const local = _notesData[_subject]?.[_topic]?.notes;
    if (local) { _notes = local; render(); return; }

    // Generate with AI
    _loading = true;
    render();
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 1000,
          system: `You are a clear, concise tutor for Australian Year 7-10 students. Write study notes in plain text.
Use ## for section headings. Include: key concepts, rules/formulas, 1-2 worked examples.
Under 300 words. No markdown bold (**) or bullet dashes. Use plain text with headings only.`,
          messages: [{ role: 'user', content: `Study notes for: ${_topic} (${_subject}), Australian Year 8-9 level.` }],
        }),
      });
      const data = await res.json();
      _notes = data.content?.map(c => c.text || '').join('') || 'Could not load notes.';
    } catch { _notes = 'Could not load notes. Please check your connection and try again.'; }
    _loading = false;
    render();
  }

  async function regenerate() {
    // Force AI re-generation by clearing local
    _notes = '';
    _loading = true;
    render();
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514', max_tokens: 1000,
        system: 'You are a clear tutor for Australian Year 7-10 students. Write study notes using ## headings. Include key concepts, formulas, examples. Under 300 words.',
        messages: [{ role: 'user', content: `Fresh study notes for: ${_topic} (${_subject}), Year 8-9 Australian level. Different examples from last time.` }],
      }),
    });
    const data = await res.json();
    _notes = data.content?.map(c => c.text || '').join('') || 'Could not generate notes.';
    _loading = false;
    render();
  }

  function practiceThisTopic() {
    Practice.startFiltered({ topic: _topic, limit: 5 }, 'one-by-one');
    App.navigate('practice');
  }

  function askTutor() {
    Tutor.setQuery(`Give me 4 practice questions on ${_topic} (${_subject}) for Year 8-9 level with full explanations`);
    App.navigate('tutor');
  }

  return { render, loadNotesData, selectSubject, selectTopic, back, backToTopics, regenerate, practiceThisTopic, askTutor };
})();
