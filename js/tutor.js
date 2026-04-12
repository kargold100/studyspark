// ── tutor.js ── AI Tutor ─────────────────────────────────────────────────────

const Tutor = (() => {

  let _query = '';
  let _response = '';
  let _loading = false;

  const QUICK_PROMPTS = [
    'How do I solve number sequence questions?',
    'Explain verbal analogies with 3 examples',
    'How to structure a persuasive essay for selective?',
    'What\'s the difference between VIC and NSW selective exams?',
    'Give me 3 quantitative reasoning practice questions with answers',
    'Explain the Pythagorean theorem with an example',
    'What are the best strategies for reading comprehension?',
    'How do I improve my vocabulary for selective exams?',
  ];

  function setQuery(q) { _query = q; }

  function render() {
    const el = document.getElementById('app');
    el.innerHTML = `<div class="page">
      <div style="max-width:700px;margin:0 auto">
        <div class="text-center mb-20">
          <div style="font-size:44px;margin-bottom:10px">🤖</div>
          <h1>AI Study Tutor</h1>
          <p class="text-muted">Ask anything about school, selective prep, or exam strategies. Available 24/7, 100% free.</p>
        </div>

        <div class="mb-14">
          <p class="text-xs text-muted mb-8">QUICK PROMPTS:</p>
          <div class="flex flex-wrap gap-8">
            ${QUICK_PROMPTS.map(p => `<button class="btn btn-sm btn-muted" onclick="Tutor.setAndAsk('${p.replace(/'/g,"\\'")}')">
              ${p.length > 50 ? p.slice(0,48)+'...' : p}
            </button>`).join('')}
          </div>
        </div>

        <div class="flex gap-8 mb-20">
          <input id="tutor-input" type="text" placeholder="Ask your tutor a question..." 
            value="${_query.replace(/"/g, '&quot;')}"
            onkeydown="if(event.key==='Enter')Tutor.ask()"
            oninput="Tutor._query=this.value" />
          <button class="btn btn-accent" onclick="Tutor.ask()" ${_loading ? 'disabled' : ''}>
            ${_loading ? '⏳' : 'Ask →'}
          </button>
        </div>

        ${_loading ? UI.loading('Thinking...') : ''}

        ${_response && !_loading ? `
          <div class="card" style="border-color:rgba(79,142,247,.4);padding:22px 24px">
            <div style="font-weight:800;color:var(--accent);margin-bottom:12px">🤖 Answer</div>
            <div style="line-height:1.85;font-size:14px;white-space:pre-wrap">${_response}</div>
            <div class="flex gap-8 mt-14">
              <button class="btn btn-sm btn-outline-accent" onclick="Tutor.followUp('Can you give me another example of this?')">Another example</button>
              <button class="btn btn-sm btn-outline-purple" onclick="Tutor.followUp('Quiz me on this topic with 3 questions and answers')">Quiz me on this</button>
              <button class="btn btn-sm btn-muted" onclick="Tutor.clear()">Clear</button>
            </div>
          </div>` : ''}

        ${!_response && !_loading ? `
          <div class="card text-center" style="padding:44px;opacity:0.5">
            <div style="font-size:36px;margin-bottom:12px">💬</div>
            <div class="text-muted">Ready to help! Type a question or choose a quick prompt above.</div>
          </div>` : ''}
      </div>
    </div>`;

    // Focus input
    const input = document.getElementById('tutor-input');
    if (input && !_response) input.focus();
  }

  async function ask() {
    const input = document.getElementById('tutor-input');
    if (input) _query = input.value;
    if (!_query.trim()) return;
    _loading = true;
    _response = '';
    render();
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 1000,
          system: `You are a friendly, encouraging tutor for Australian students in Grades 6–10 preparing for school or selective high school entry exams (VIC ACER or NSW). 
Give clear, concise explanations with examples. Use step-by-step working where appropriate.
For maths: show full working. For writing: give a brief example. For reasoning: explain the pattern.
Keep responses under 280 words. Be warm and encouraging.`,
          messages: [{ role: 'user', content: _query }],
        }),
      });
      const data = await res.json();
      _response = data.content?.map(c => c.text || '').join('') || 'Sorry, something went wrong.';
    } catch { _response = 'Something went wrong. Please check your connection and try again.'; }
    _loading = false;
    render();
  }

  function setAndAsk(q) { _query = q; ask(); }
  function followUp(q) { _query = q; ask(); }
  function clear() { _query = ''; _response = ''; render(); }

  return { render, ask, setQuery, setAndAsk, followUp, clear, get _query() { return _query; } };
})();
