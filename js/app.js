// ── app.js ── Main Application Router & Home Screen ──────────────────────────

const App = (() => {

  let _screen = 'home';

  // ── INIT ──────────────────────────────────────────────────────────────────
  async function init() {
    // Load question bank and notes
    await Promise.all([QB.load(), Study.loadNotesData()]);
    navigate('home');
  }

  // ── ROUTER ────────────────────────────────────────────────────────────────
  function navigate(screen) {
    _screen = screen;
    UI.renderNav(screen);
    switch (screen) {
      case 'home':      renderHome();       break;
      case 'browse':    Browse.render();    break;
      case 'practice':  Practice.render();  break;
      case 'exams':     Exams.render();     break;
      case 'selective': Selective.render(); break;
      case 'study':     Study.render();     break;
      case 'tutor':     Tutor.render();     break;
      default:          renderHome();
    }
    window.scrollTo(0, 0);
  }

  // ── HOME ──────────────────────────────────────────────────────────────────
  function renderHome() {
    const el = document.getElementById('app');
    const stats = QB.stats();

    el.innerHTML = `
      <div class="page">
        <!-- Hero -->
        <div class="hero">
          <div class="mb-8">
            <span class="tag tag-accent">FREE · GRADES 6–10 · VIC &amp; NSW SELECTIVE</span>
          </div>
          <h1>Your Free<br><span class="gradient-text">Study Portal</span></h1>
          <p class="text-muted" style="max-width:500px;margin:10px 0 24px;font-size:15px;line-height:1.7">
            AI-generated study notes, question bank, timed mock exams, and real Australian selective entry prep for VIC &amp; NSW — all completely free.
          </p>
          <div class="flex gap-8 flex-wrap">
            <button class="btn btn-accent" onclick="App.navigate('selective')">🏆 Selective Prep</button>
            <button class="btn btn-green"  onclick="App.navigate('browse')">📋 Question Bank</button>
            <button class="btn btn-purple" onclick="App.navigate('practice')">✏️ Practice Now</button>
            <button class="btn btn-muted"  onclick="App.navigate('exams')">📝 Mock Exams</button>
          </div>
        </div>

        <!-- Stats row -->
        <div class="grid-4 mb-26">
          <div class="card text-center">
            <div style="font-size:26px;margin-bottom:6px">📋</div>
            <div style="font-weight:800;font-size:20px;color:var(--accent)">${stats.total}</div>
            <div class="text-muted text-sm">Questions in bank</div>
          </div>
          <div class="card text-center">
            <div style="font-size:26px;margin-bottom:6px">📚</div>
            <div style="font-weight:800;font-size:20px;color:var(--green)">30+</div>
            <div class="text-muted text-sm">Study topics</div>
          </div>
          <div class="card text-center">
            <div style="font-size:26px;margin-bottom:6px">📝</div>
            <div style="font-weight:800;font-size:20px;color:var(--orange)">7</div>
            <div class="text-muted text-sm">Mock exams</div>
          </div>
          <div class="card text-center">
            <div style="font-size:26px;margin-bottom:6px">🤖</div>
            <div style="font-weight:800;font-size:20px;color:var(--purple)">∞</div>
            <div class="text-muted text-sm">AI questions (unlimited)</div>
          </div>
        </div>

        <!-- Key difference -->
        <h2>⚠️ Selective ≠ Regular School Subjects</h2>
        <div class="grid-2 mb-26">
          <div class="card">
            <div style="font-weight:800;color:var(--muted);margin-bottom:10px">❌ Regular school exams test...</div>
            <div class="text-muted text-sm" style="line-height:1.9">
              • Subject content (History, Geography, Science facts)<br>
              • Memorised curriculum knowledge<br>
              • Teacher-set questions based on class content<br>
              • What you know
            </div>
          </div>
          <div class="card" style="border-color:rgba(79,142,247,.4)">
            <div style="font-weight:800;color:var(--accent);margin-bottom:10px">✅ Selective exams test...</div>
            <div class="text-sm" style="line-height:1.9">
              • HOW you reason and think<br>
              • Reading comprehension &amp; inference<br>
              • Mathematical problem solving<br>
              • Verbal &amp; quantitative reasoning<br>
              • Writing quality (VIC: 40min / NSW: 30min)
            </div>
          </div>
        </div>

        <!-- Quick access -->
        <h2>Quick Access</h2>
        <div class="grid-3">
          ${[
            { icon:'📋', label:'Browse Question Bank',    sub:'Filter, view &amp; reveal answers',        color:'accent',  screen:'browse'    },
            { icon:'✏️', label:'Practice Mode',            sub:'Answer questions, instant feedback',      color:'green',   screen:'practice'  },
            { icon:'📝', label:'Timed Mock Exams',         sub:'Real exam conditions + timer',            color:'orange',  screen:'exams'     },
            { icon:'🏆', label:'VIC Selective Prep',       sub:'5 sections: reading, maths, verbal...',   color:'accent',  screen:'selective' },
            { icon:'📚', label:'Study Notes',              sub:'AI notes for all Year 6-10 topics',       color:'pink',    screen:'study'     },
            { icon:'🤖', label:'AI Tutor',                 sub:'Ask anything, get instant help',          color:'purple',  screen:'tutor'     },
          ].map(item => `
            <div class="card card-hover" style="border-color:rgba(var(--${item.color}-rgb,79,142,247),.3)" onclick="App.navigate('${item.screen}')">
              <div style="font-size:26px;margin-bottom:8px">${item.icon}</div>
              <div style="font-weight:700;margin-bottom:4px">${item.label}</div>
              <div class="text-muted text-sm">${item.sub}</div>
            </div>`).join('')}
        </div>

        <!-- Australian selective at a glance -->
        <h2 style="margin-top:28px">Australian Selective Schools at a Glance</h2>
        <div class="grid-2">
          <div class="card" style="border-color:rgba(79,142,247,.3)">
            <div style="font-weight:800;font-size:15px;margin-bottom:10px">🟦 Victoria (ACER)</div>
            <div class="text-sm" style="line-height:1.9;color:var(--muted)">
              📖 Reading Reasoning (50 Qs, 35 min)<br>
              🔢 Maths Reasoning (60 Qs, 30 min)<br>
              🧠 Verbal Ability (60 Qs, 30 min)<br>
              📐 Quant Ability (50 Qs, 30 min)<br>
              ✍️ Writing (40 min)
            </div>
            <div class="mt-14 text-xs text-muted">~5,700 applicants → ~1,000 places (≈20%)</div>
            <button class="btn btn-sm btn-outline-accent mt-14" onclick="Selective.setState('VIC');App.navigate('selective')">Start VIC Prep →</button>
          </div>
          <div class="card" style="border-color:rgba(247,200,79,.3)">
            <div style="font-weight:800;font-size:15px;margin-bottom:10px">🟨 NSW</div>
            <div class="text-sm" style="line-height:1.9;color:var(--muted)">
              📖 Reading (40 Qs, 40 min)<br>
              🔢 Mathematical Reasoning (40 Qs, 40 min)<br>
              🧩 Thinking Skills (40 Qs, 40 min)<br>
              ✍️ Writing (30 min)
            </div>
            <div class="mt-14 text-xs text-muted">~15,000 applicants → ~4,300 places</div>
            <button class="btn btn-sm btn-yellow mt-14" onclick="Selective.setState('NSW');App.navigate('selective')">Start NSW Prep →</button>
          </div>
        </div>

        <div class="alert alert-info mt-20">
          <strong>💡 How to get the most from this portal:</strong> Start with the Question Bank to see what types of questions appear. 
          Then use Practice Mode daily (even 10 minutes helps). Do a full Mock Exam weekly under timed conditions.
          Use the AI Tutor whenever you're stuck on a concept.
        </div>
      </div>`;
  }

  return { init, navigate };
})();

// ── BOOT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => App.init());
