// app.js — StudySpark v3: Personalised profiles, quizzes, achievements
// ─────────────────────────────────────────────────────────────────────────────

const SL  = {vic_reading:'📖 VIC Reading',vic_maths:'🔢 VIC Maths',vic_verbal:'🧠 VIC Verbal',vic_quant:'📐 VIC Quant',nsw_reading:'📖 NSW Reading',nsw_maths:'🔢 NSW Maths',nsw_thinking:'🧩 NSW Thinking'};
const SC  = {vic_reading:'ta',vic_maths:'tg',vic_verbal:'tpu',vic_quant:'to',nsw_reading:'ta',nsw_maths:'tg',nsw_thinking:'tpu'};
const DC  = {easy:'tg',medium:'to',hard:'tp'};
const STL = {acer:'ACER',hendersons:'Hendersons',psle:'PSLE',contour:'Contour',james_ann:'James & Ann',edutest:'EduTest',matrix:'Matrix',oc:'OC Test',hast:'HAST'};

const NAV_ITEMS = [
  {id:'home',l:'🏠 Home'},{id:'browse',l:'📋 Questions'},
  {id:'practice',l:'✏️ Practice'},{id:'exams',l:'📝 Exams'},
  {id:'selective',l:'🏆 Selective'},{id:'study',l:'📚 Study'},
  {id:'tutor',l:'🤖 Tutor'},{id:'funzone',l:'🎮 Fun Zone'},
  {id:'profile',l:'👤 Profile'},
];

const EXAM_DEFS = [
  {id:'e1',title:'VIC – Reading',section:'vic_reading',duration:10,count:6,color:'var(--accent)',state:'VIC'},
  {id:'e2',title:'VIC – Mathematics',section:'vic_maths',duration:12,count:10,color:'var(--green)',state:'VIC'},
  {id:'e3',title:'VIC – Verbal',section:'vic_verbal',duration:10,count:8,color:'var(--purple)',state:'VIC'},
  {id:'e4',title:'VIC – Quantitative',section:'vic_quant',duration:10,count:8,color:'var(--orange)',state:'VIC'},
  {id:'e5',title:'NSW – Thinking Skills',section:'nsw_thinking',duration:10,count:8,color:'var(--purple)',state:'NSW'},
  {id:'e6',title:'NSW – Maths',section:'nsw_maths',duration:10,count:8,color:'var(--green)',state:'NSW'},
  {id:'e7',title:'NSW – Reading',section:'nsw_reading',duration:10,count:6,color:'var(--accent)',state:'NSW'},
  {id:'e8',title:'VIC Full Mixed',section:'ALL',duration:30,count:24,color:'var(--accent)',state:'VIC'},
  {id:'e9',title:'NSW Full Mixed',section:'ALL',duration:25,count:20,color:'var(--yellow)',state:'NSW'},
  {id:'e10',title:'Hendersons Style',section:'ALL',style:'hendersons',duration:15,count:12,color:'var(--green)'},
  {id:'e11',title:'PSLE Maths',section:'vic_maths',style:'psle',duration:15,count:10,color:'var(--orange)'},
  {id:'e12',title:'Contour – Logic',section:'ALL',style:'contour',duration:12,count:8,color:'var(--purple)'},
  {id:'e13',title:'EduTest Style',section:'ALL',style:'edutest',duration:12,count:8,color:'var(--teal)'},
  {id:'e14',title:'Matrix Style',section:'ALL',style:'matrix',duration:12,count:8,color:'var(--yellow)'},
  {id:'e15',title:'HAST Style',section:'ALL',style:'hast',duration:15,count:8,color:'var(--red)'},
  {id:'e16',title:'OC Test',section:'ALL',style:'oc',duration:10,count:10,color:'var(--green)'},
  {id:'e17',title:'James & Ann Passages',section:'vic_reading',style:'james_ann',duration:12,count:8,color:'var(--pink)'},
  {id:'e18',title:'Easy Confidence Builder',section:'ALL',difficulty:'easy',duration:10,count:12,color:'var(--teal)'},
];

const WRITING_PROMPTS = [
  {type:'Creative',text:"Write a story beginning: 'The door at the end of the corridor had never been opened — until today.'"},
  {type:'Persuasive',text:"Should students be allowed to use AI tools for homework? Argue your position."},
  {type:'Creative',text:"A student discovers they can hear the thoughts of animals. Write what happens next."},
  {type:'Persuasive',text:"'School uniforms should be abolished in all Australian public schools.' Argue for or against."},
  {type:'Creative',text:"Write a story set in a world where everyone must wear a colour that shows their current mood."},
  {type:'Persuasive',text:"'Homework should be banned for students under 14.' Write a persuasive piece."},
  {type:'Creative',text:"The last library on Earth is about to close. Write what happens when one student decides to stop it."},
  {type:'Persuasive',text:"'Social media does more harm than good for teenagers.' Argue your position."},
  {type:'Creative',text:"You wake up and everyone in the world has forgotten the past 24 hours — except you."},
  {type:'Persuasive',text:"'Zoos should be abolished.' Write a persuasive essay for or against."},
];

const VIC_SECS=[
  {id:'vic_reading',e:'📖',l:'Reading Reasoning',m:35,d:'Comprehension, inference, vocabulary, author craft.'},
  {id:'vic_maths',e:'🔢',l:'Mathematics',m:30,d:'Number, algebra, geometry, statistics. No calculator.'},
  {id:'vic_verbal',e:'🧠',l:'General Ability – Verbal',m:30,d:'Analogies, classification, vocabulary, odd one out.'},
  {id:'vic_quant',e:'📐',l:'General Ability – Quantitative',m:30,d:'Number sequences, symbol patterns, grid puzzles.'},
  {id:'vic_writing',e:'✍️',l:'Writing',m:40,d:'Creative or persuasive. Marked on ideas, structure, language, mechanics.'},
];
const NSW_SECS=[
  {id:'nsw_reading',e:'📖',l:'Reading',m:40,d:'Comprehension and inference across genres.'},
  {id:'nsw_maths',e:'🔢',l:'Mathematical Reasoning',m:40,d:'Problem solving, Year 6–7 level, no calculator.'},
  {id:'nsw_thinking',e:'🧩',l:'Thinking Skills',m:40,d:'Verbal and non-verbal reasoning, no prior knowledge tested.'},
  {id:'nsw_writing',e:'✍️',l:'Writing',m:30,d:'Creative or persuasive from a stimulus.'},
];
const SUBJECTS={
  Mathematics:{e:'🔢',c:'var(--accent)',t:['Algebra','Geometry','Fractions & Decimals','Statistics','Probability','Number Theory','Ratios & Percentages','Measurement','Word Problems']},
  English:{e:'📖',c:'var(--pink)',t:['Reading Comprehension','Grammar & Punctuation','Vocabulary','Persuasive Writing','Creative Writing','Poetry & Literary Devices','Author\'s Purpose']},
  Science:{e:'🔬',c:'var(--green)',t:['Cells & Biology','Elements & Chemistry','Forces & Physics','Earth Science','Ecology','Scientific Method']},
  History:{e:'🏛️',c:'var(--orange)',t:['World War I & II','Australian History','Ancient Civilisations','Democracy & Government','Civil Rights Movements']},
  Geography:{e:'🌍',c:'var(--purple)',t:['Climate & Weather','Natural Disasters','Landforms','Population Studies','Sustainability & Environment']},
};

// ── STATE ─────────────────────────────────────────────────────────────────────
let screen='home', currentUser=null;
let browseFilters={section:'ALL',grade:'ALL',topic:'ALL',difficulty:'ALL',style:'ALL'};
let revealedIds=new Set(), hintVisible={};
let pQs=[],pAns=[],pSub=false,pMode='oneByOne',pScore=0,pIdx=0,pResult=null;
let exam=null,examSub=false,examTL=0,examTimer=null,examStart=null,examResult=null;
let selState='VIC',selSec=null,selPQs=[],selPAns=[],selPSub=false;
let selWritingPrompt=null,selWritingText='',selWritingFeedback='',selWritingLoading=false;
let studySub=null,studyTopic=null,studyNotes='',studyLoading=false;
let tutorQ='',tutorR='',tutorLoading=false;
let funTab='math',funAnswered={},funShowExp={};
let activeQuiz=null,quizAnswers=[],quizSub=false;
let dailyAnswers={m:null,e:null,b:null};
let AIcache={},AIloading=new Set();
// Profile UI state
let newNickname='',newAvatar='🎓',showCreateForm=false;

// ── HELPERS ───────────────────────────────────────────────────────────────────
function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function uniq(a){return[...new Set(a)];}
function pctColor(p){return p>=75?'var(--green)':p>=50?'var(--orange)':'var(--red)';}
function starsHtml(n,max=3){return Array.from({length:max},(_,i)=>`<span class="star ${i<n?'earned':'empty'}">${i<n?'⭐':'☆'}</span>`).join('');}
function filterQs(f={}){return QUESTIONS.filter(q=>{if(f.section&&f.section!=='ALL'&&q.section!==f.section)return false;if(f.grade&&f.grade!=='ALL'&&q.grade!==f.grade)return false;if(f.topic&&f.topic!=='ALL'&&q.topic!==f.topic)return false;if(f.difficulty&&f.difficulty!=='ALL'&&q.difficulty!==f.difficulty)return false;if(f.style&&f.style!=='ALL'&&q.style!==f.style)return false;return true;});}

async function callClaude(system,user,maxTok=700){
  try{const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:maxTok,system,messages:[{role:'user',content:user}]})});const d=await r.json();return d.content?.map(c=>c.text||'').join('')||'';}catch{return'';}
}
async function getAIFeedback(q,userAns,correct){
  const key=`${q.id}_${userAns}`;if(AIcache[key]||AIloading.has(key))return;AIloading.add(key);render();
  const sys=`You are an expert Australian selective school tutor. 4 lines, no markdown:
${correct?'✅ CORRECT! [one sentence: reinforce the reasoning skill]':'❌ Not quite. [one sentence: identify the error kindly]'}
💡 CONCEPT: [key rule — max 12 words]
🎯 IMPROVE: [concrete practice suggestion — max 12 words]
🔥 CHALLENGE: [harder follow-up idea — max 12 words]`;
  const usr=`Q: ${q.q.slice(0,200)}\nTopic: ${q.topic} | Style: ${STL[q.style]||q.style} | Difficulty: ${q.difficulty}\nChose: "${q.options[userAns]}" → ${correct?'CORRECT':'WRONG'}\nCorrect: "${q.options[q.answer]}"\nExp: ${(q.exp||'').slice(0,150)}`;
  const fb=await callClaude(sys,usr,350);
  AIcache[key]=fb||`${correct?'✅ Correct!':'❌ Not quite.'}\n💡 CONCEPT: Review the explanation.\n🎯 IMPROVE: Try 3 more ${q.topic} questions.\n🔥 CHALLENGE: Can you explain this to someone else?`;
  AIloading.delete(key);render();
}

// ── NAVIGATION ────────────────────────────────────────────────────────────────
function nav(s){
  if(examTimer&&s!=='examrun'){if(!confirm('Leave exam? Progress will be lost.'))return;clearInterval(examTimer);examTimer=null;}
  screen=s;
  document.getElementById('nav-bar').innerHTML=NAV_ITEMS.map(i=>`<button class="nb${screen===i.id?' on':''}${i.id==='funzone'&&screen!=='funzone'?' fun-btn':''}" onclick="nav('${i.id}')">${i.l}</button>`).join('');
  window.scrollTo(0,0);render();
}
const App={home:()=>nav('home')};

function render(){
  const el=document.getElementById('app');
  if(!currentUser&&screen!=='profile'){el.innerHTML=renderProfilePicker();return;}
  const R={home:renderHome,browse:renderBrowse,practice:renderPractice,exams:renderExams,examrun:renderExamRun,selective:renderSelective,study:renderStudy,tutor:renderTutor,funzone:renderFunZone,profile:renderProfile};
  el.innerHTML=(R[screen]||renderHome)();
}

// ── PROFILE BAR (shown at top of every page) ──────────────────────────────────
function profileBar(){
  if(!currentUser)return'';
  const d=Profiles.loadData(currentUser);
  const lv=Profiles.getLevel(d.xp||0);
  const prog=Profiles.getLevelProgress(d.xp||0);
  return `<div class="profile-bar mb20" onclick="nav('profile')">
    <div style="font-size:28px">${d.avatar||'🎓'}</div>
    <div style="flex:1;min-width:0">
      <div class="fc gap8"><strong style="font-size:14px">${d.nickname}</strong>
        <span class="level-badge" style="background:${lv.color}22;color:${lv.color};border:1px solid ${lv.color}44">${lv.title}</span>
      </div>
      <div class="xp-bar-container">
        <div class="xp-bar"><div class="xp-fill" style="width:${prog.pct}%;background:${lv.color}"></div></div>
      </div>
      <div class="xs mt">${d.xp||0} XP · Level ${lv.level}</div>
    </div>
    <div class="xs mt" style="text-align:right;flex-shrink:0">🏅 ${(d.achievements||[]).length} badges<br/>⭐ ${(d.recentStars||[]).reduce((s,r)=>s+r.count,0)} stars</div>
  </div>`;
}

// ── PROFILE PICKER (shown when no user selected) ───────────────────────────────
function renderProfilePicker(){
  const profiles=Profiles.getProfileList();
  const avatarGrid=Profiles.AVATARS.map(a=>`<div class="avatar-opt${newAvatar===a?' selected':''}" onclick="newAvatar='${a}';render()">${a}</div>`).join('');
  return `<div class="profile-picker">
    <div class="tc mb24" style="margin-top:32px">
      <div style="font-size:52px;margin-bottom:10px">🎓</div>
      <h1>Welcome to <span class="grad">StudySpark</span></h1>
      <p class="mt sm" style="margin-top:8px">Who's studying today? Select your profile or create a new one.</p>
    </div>
    ${profiles.length?`<h3 class="mb8">Choose your profile</h3>
      ${profiles.map(p=>{const lv=Profiles.getLevel(p.xp||0);const prog=Profiles.getLevelProgress(p.xp||0);return `<div class="profile-card" onclick="currentUser='${p.nickname}';nav('home')">
        <div class="avatar-circle">${p.avatar||'🎓'}</div>
        <div style="flex:1">
          <div class="fc gap8 mb8"><strong style="font-size:15px">${p.nickname}</strong>
            <span class="level-badge" style="background:${lv.color}22;color:${lv.color}">${lv.title}</span></div>
          <div class="xp-bar"><div class="xp-fill" style="width:${prog.pct}%;background:${lv.color}"></div></div>
          <div class="xs mt" style="margin-top:4px">${p.xp||0} XP</div>
        </div>
        <button class="btn ba bsm">Play →</button>
      </div>`;}).join('')}<div style="margin:16px 0;text-align:center;color:var(--muted);font-size:12px">— or —</div>`:''}
    ${!showCreateForm?`<button class="btn ba bfull" style="padding:13px;font-size:15px" onclick="showCreateForm=true;render()">➕ Create New Profile</button>`:`
    <div class="card" style="border-color:rgba(79,142,247,.4)">
      <h3 class="mb14">Create Your Profile</h3>
      <div class="mb14">
        <label class="xs mt" style="display:block;margin-bottom:6px;font-weight:700">CHOOSE YOUR AVATAR</label>
        <div class="avatar-grid">${avatarGrid}</div>
      </div>
      <div class="mb14">
        <label class="xs mt" style="display:block;margin-bottom:6px;font-weight:700">YOUR NICKNAME (no real name needed!)</label>
        <input type="text" id="nick-input" placeholder="e.g. StarKid, Adarsh, MathsWiz..." maxlength="20" value="${newNickname}" oninput="newNickname=this.value"/>
        <p class="xs mt" style="margin-top:5px">💡 Use any name you like — no email, no password, no personal info needed.</p>
      </div>
      <div class="fc gap8">
        <button class="btn ba" onclick="doCreateProfile()" style="padding:10px 20px">Create Profile →</button>
        <button class="btn bm" onclick="showCreateForm=false;render()">Cancel</button>
      </div>
    </div>`}
  </div>`;
}

function doCreateProfile(){
  const nick=document.getElementById('nick-input')?.value||newNickname;
  const result=Profiles.createProfile(nick.trim(),newAvatar);
  if(result.error){alert(result.error);return;}
  currentUser=nick.trim();newNickname='';newAvatar='🎓';showCreateForm=false;
  nav('home');
}

// ── PROFILE PAGE ──────────────────────────────────────────────────────────────
function renderProfile(){
  const profiles=Profiles.getProfileList();
  if(!currentUser){return renderProfilePicker();}
  const stats=Profiles.getStats(currentUser);
  const {lv,lvProg}=stats;
  const catLabels={study:'📚 Study',streak:'🔥 Streaks',fun:'🎮 Fun Zone',xp:'⚡ XP'};
  const cats=['study','streak','fun','xp'];
  const avatarGrid=Profiles.AVATARS.map(a=>`<div class="avatar-opt${stats.avatar===a?' selected':''}" onclick="changeAvatar('${a}')">${a}</div>`).join('');

  return `<div class="page">
    <!-- Profile hero -->
    <div class="hero mb20" style="text-align:center;padding:28px">
      <div class="avatar-circle lg" style="margin:0 auto 14px">${stats.avatar||'🎓'}</div>
      <h1 style="margin-bottom:4px">${stats.nickname}</h1>
      <div class="fc gap8 mb14" style="justify-content:center">
        <span class="level-badge" style="background:${lv.color}22;color:${lv.color};border:1px solid ${lv.color}44;font-size:13px;padding:5px 14px">${lv.title}</span>
        <span class="tag ty">Level ${lv.level}</span>
      </div>
      <!-- XP bar -->
      <div style="max-width:340px;margin:0 auto 8px">
        <div class="fc jsb xs mt mb8"><span>${stats.xp} XP</span><span>${lv.level<20?lvProg.xpNeeded-lvProg.xpInLevel+' XP to Level '+(lv.level+1):'MAX LEVEL!'}</span></div>
        <div class="xp-bar" style="height:12px;border-radius:6px"><div class="xp-fill" style="width:${lvProg.pct}%;background:${lv.color}"></div></div>
      </div>
      <!-- Quick stats -->
      <div class="g4 mt20" style="max-width:440px;margin:20px auto 0">
        <div><div style="font-weight:900;font-size:20px;color:var(--accent)">${stats.totalAnswered}</div><div class="xs mt">Answered</div></div>
        <div><div style="font-weight:900;font-size:20px;color:${pctColor(stats.acc)}">${stats.acc}%</div><div class="xs mt">Accuracy</div></div>
        <div><div style="font-weight:900;font-size:20px;color:var(--orange)">${stats.streak}🔥</div><div class="xs mt">Streak</div></div>
        <div><div style="font-weight:900;font-size:20px;color:var(--yellow)">${(stats.recentStars||[]).reduce((s,r)=>s+r.count,0)}⭐</div><div class="xs mt">Stars</div></div>
      </div>
    </div>

    <!-- Switch / Manage -->
    <div class="fc gap8 mb20 wrap">
      <button class="btn bm bsm" onclick="currentUser=null;showCreateForm=false;screen='profile';render()">🔄 Switch Profile</button>
      <button class="btn bm bsm" onclick="changeAvatarPrompt()">🎨 Change Avatar</button>
      ${profiles.length>1?`<button class="btn bm bsm" style="color:var(--red)" onclick="if(confirm('Delete profile ${stats.nickname}? All progress will be lost.')){Profiles.deleteProfile('${stats.nickname}');currentUser=null;screen='profile';render();}">🗑 Delete</button>`:''}
    </div>

    <!-- Achievements -->
    <h2 class="mb8">🏅 Achievements (${stats.earnedAchievements.length}/${Profiles.ACHIEVEMENTS.length})</h2>
    <p class="mt sm mb14">Complete challenges to unlock badges and earn bonus XP!</p>
    ${cats.map(cat=>{
      const catAchs=Profiles.ACHIEVEMENTS.filter(a=>a.cat===cat);
      const earnedCount=catAchs.filter(a=>stats.earnedAchievements.some(e=>e.id===a.id)).length;
      return `<div class="card mb14">
        <div class="fc jsb mb12"><h3>${catLabels[cat]}</h3><span class="xs mt">${earnedCount}/${catAchs.length}</span></div>
        <div class="ach-grid">
          ${catAchs.map(a=>{const earned=stats.earnedAchievements.some(e=>e.id===a.id);
            return `<div class="ach-card${earned?' earned':''}">
              <div class="ach-emoji">${a.emoji}</div>
              <div class="ach-label">${a.label}</div>
              <div class="ach-desc">${a.desc}</div>
              ${earned?'<div class="xs" style="color:var(--yellow);margin-top:5px;font-weight:700">✓ Earned</div>':''}
            </div>`;}).join('')}
        </div>
      </div>`;
    }).join('')}

    <!-- Session history -->
    <h2 class="mb14">📋 Recent Sessions</h2>
    <div class="card" style="padding:0;overflow:hidden;margin-bottom:24px">
      ${(stats.sessions||[]).length?(stats.sessions||[]).slice(0,15).map(s=>{
        const d=new Date(s.date);
        const dateStr=d.toLocaleDateString('en-AU',{day:'numeric',month:'short'});
        return `<div class="fc gap12" style="padding:12px 16px;border-bottom:1px solid rgba(30,34,64,.5);align-items:center">
          <div style="font-size:22px">${s.type==='exam'?'📝':'✏️'}</div>
          <div style="flex:1;min-width:0"><div style="font-weight:700;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.label}</div><div class="xs mt">${dateStr}</div></div>
          <div class="star-row">${starsHtml(s.stars||0)}</div>
          <div style="text-align:right;flex-shrink:0;min-width:54px"><div style="font-weight:800;color:${pctColor(s.pct)}">${s.pct}%</div><div class="xs mt">${s.correct}/${s.total}</div></div>
        </div>`;}).join('')
      :'<div class="loading">No sessions yet — start practising!</div>'}
    </div>

    <!-- Performance breakdown -->
    ${stats.sectionPerf.length?`<div class="g2 mb20">
      <div class="card"><h3 class="mb14">Section Performance</h3>
        ${stats.sectionPerf.map(sp=>{const c=pctColor(sp.pct);return `<div style="margin-bottom:11px">
          <div class="fc jsb sm mb8"><span>${SL[sp.sec]||sp.sec}</span><span style="color:${c};font-weight:700">${sp.pct}% (${sp.total})</span></div>
          <div class="pbar"><div class="pfill" style="width:${sp.pct}%;background:${c}"></div></div>
        </div>`;}).join('')}
      </div>
      <div>
        ${stats.weakTopics.length?`<div class="card mb14" style="border-color:rgba(247,79,79,.3)"><h3 style="color:var(--red);margin-bottom:10px">⚠️ Needs Work</h3>
          ${stats.weakTopics.map(t=>`<div class="fc jsb sm mb8"><span>${t.topic}</span>
            <div class="fc gap8"><span style="color:var(--red);font-weight:700">${t.pct}%</span>
            <button class="btn bsm" style="background:var(--red);color:#fff;padding:2px 8px;font-size:11px" onclick="startPractice({topic:'${t.topic}'},'oneByOne',6)">Fix</button></div>
          </div>`).join('')}</div>`:''}
        ${stats.strongTopics.length?`<div class="card" style="border-color:rgba(61,214,140,.3)"><h3 style="color:var(--green);margin-bottom:10px">⭐ Strong Areas</h3>
          ${stats.strongTopics.map(t=>`<div class="fc jsb sm mb8"><span>${t.topic}</span><span style="color:var(--green);font-weight:700">${t.pct}% ✓</span></div>`).join('')}</div>`:''}
      </div>
    </div>`:''}

    <!-- Other profiles -->
    ${profiles.length>1?`<h2 class="mb8">Other Profiles on This Device</h2><div class="g3">
      ${profiles.filter(p=>p.nickname!==currentUser).map(p=>{const lv=Profiles.getLevel(p.xp||0);return `<div class="card hov" onclick="currentUser='${p.nickname}';render()">
        <div style="font-size:28px;margin-bottom:4px">${p.avatar||'🎓'}</div>
        <div style="font-weight:700">${p.nickname}</div>
        <div class="xs mt">${lv.title}</div>
        <div class="xs mt">${p.xp||0} XP</div>
      </div>`;}).join('')}</div>`:''}
  </div>`;
}

function changeAvatarPrompt(){
  const d=Profiles.loadData(currentUser);
  const avatarGrid=Profiles.AVATARS.map(a=>`<div class="avatar-opt${d.avatar===a?' selected':''}" onclick="changeAvatar('${a}')">${a}</div>`).join('');
  const modal=document.createElement('div');modal.className='modal-overlay';modal.id='avatar-modal';
  modal.innerHTML=`<div class="modal"><h3 class="mb14">Change Avatar</h3><div class="avatar-grid">${avatarGrid}</div><button class="btn bm mt14" onclick="document.getElementById('avatar-modal').remove()">Done</button></div>`;
  document.body.appendChild(modal);
}
function changeAvatar(a){
  const d=Profiles.loadData(currentUser);d.avatar=a;Profiles.saveData(d);
  Profiles.updateProfileListEntry?.(d);
  document.querySelectorAll('.avatar-opt').forEach(el=>el.classList.toggle('selected',el.textContent===a));
  render();document.getElementById('avatar-modal')?.remove();
}

// ── QUESTION CARD ─────────────────────────────────────────────────────────────
function qCard(q,idx,mode,userAns,submitted,revealed,showHint){
  const correct=submitted&&userAns===q.answer;
  const fbKey=`${q.id}_${userAns}`;
  const fb=AIcache[fbKey],fbLoad=AIloading.has(fbKey);
  let cls='qcard';
  if(submitted&&userAns!==null)cls+=correct?' correct':' wrong';
  else if(revealed)cls+=' revealed';
  const opts=q.options.map((opt,oi)=>{
    let c='opt';const sel=userAns===oi;
    if(mode!=='browse'&&sel&&!submitted)c+=' sel';
    if(submitted||revealed){c+=' dis';if(oi===q.answer)c+=' cor';else if(submitted&&sel)c+=' wrg';}
    const tick=(submitted||revealed)&&oi===q.answer?'<span class="otick">✓</span>':submitted&&sel&&oi!==q.answer?'<span class="otick">✗</span>':'';
    const click=(!submitted&&!revealed&&mode!=='browse')?`onclick="handleAnswer('${mode}',${idx},${oi})"` :'';
    return `<div class="${c}" ${click}><span class="oltr">${'ABCD'[oi]}.</span><span style="flex:1">${opt}</span>${tick}</div>`;
  }).join('');
  const expHtml=(submitted&&userAns!==null||revealed)&&q.exp?`<div class="exp"><strong style="color:var(--accent)">Explanation:</strong>\n${q.exp}</div>`:'';
  const hintHtml=showHint&&q.hint&&!submitted&&!revealed?`<div class="hint-box">💡 ${q.hint}</div>`:'';
  let aiFb='';
  if(submitted&&userAns!==null){
    if(fbLoad)aiFb=`<div class="aifb ${correct?'correct':'wrong'}"><span class="spin">⏳</span> <em style="color:var(--muted)">Getting coaching...</em></div>`;
    else if(fb){const lines=fb.split('\n').filter(l=>l.trim());aiFb=`<div class="aifb ${correct?'correct':'wrong'}"><div class="aifb-hdr" style="color:var(--${correct?'green':'orange'})">🤖 AI Coaching</div>${lines.map(l=>`<div style="margin-bottom:4px">${l}</div>`).join('')}</div>`;}
  }
  const browseActs=mode==='browse'?`<div class="fc gap8 mt14 wrap"><button class="btn bm bsm" onclick="toggleReveal('${q.id}')">${revealed?'🙈 Hide':'👁 Show'}</button>${!revealed?`<button class="btn bm bsm" onclick="toggleHint('${q.id}')">💡 Hint</button>`:''}<button class="btn ba bsm" onclick="practiceOne('${q.id}')">✏️ Practice</button></div>`:'';
  return `<div class="${cls}"><div class="mb8 fc gap8 wrap">${q.section?`<span class="tag ${SC[q.section]||'tm'}">${SL[q.section]||q.section}</span>`:''} ${q.topic?`<span class="tag tm">${q.topic}</span>`:''} ${q.difficulty?`<span class="tag ${DC[q.difficulty]||'tm'}">${q.difficulty}</span>`:''} ${q.style?`<span class="tag tm xs">${STL[q.style]||q.style}</span>`:''}</div><div class="qtxt">Q${idx+1}. ${q.q}</div>${hintHtml}${opts}${expHtml}${aiFb}${browseActs}</div>`;
}

// ── HANDLERS ──────────────────────────────────────────────────────────────────
function handleAnswer(mode,idx,oi){
  if(mode==='oneByOne'){
    if(pSub||pAns[pIdx]!==null)return;
    pAns[pIdx]=oi;const q=pQs[pIdx];const ok=oi===q.answer;
    if(ok)pScore++;if(currentUser)Profiles.recordAnswer(currentUser,q,ok);
    pSub=true;getAIFeedback(q,oi,ok);render();
  }else if(mode==='batch'){if(pSub)return;pAns[idx]=oi;render();}
  else if(mode==='exam'){if(examSub)return;exam.answers[idx]=oi;render();}
  else if(mode==='sel'){if(selPSub)return;selPAns[idx]=oi;render();}
  else if(mode==='quiz'){if(quizSub)return;quizAnswers[idx]=oi;render();}
}
function toggleReveal(id){revealedIds.has(id)?revealedIds.delete(id):revealedIds.add(id);render();}
function toggleHint(id){hintVisible[id]=!hintVisible[id];render();}
function practiceOne(id){const q=QUESTIONS.find(x=>x.id===id);if(!q)return;pQs=[q];pAns=[null];pSub=false;pMode='oneByOne';pScore=0;pIdx=0;pResult=null;screen='practice';nav('practice');}

// ── PRACTICE ──────────────────────────────────────────────────────────────────
function startPractice(f={},mode='oneByOne',limit=12,qList=null){
  pQs=qList||shuffle(filterQs(f)).slice(0,limit);
  if(!pQs.length){alert('No questions match those filters.');return;}
  pAns=Array(pQs.length).fill(null);pSub=false;pMode=mode;pScore=0;pIdx=0;pResult=null;
  nav('practice');
}
function nextQ(){pIdx++;pSub=false;if(pIdx>=pQs.length){pResult=currentUser?Profiles.recordSession(currentUser,pQs,pAns,pMode,null):null;render();}else render();}
function goToQ(i){pIdx=i;pSub=pAns[i]!==null;render();}
function submitBatch(){
  pSub=true;let c=0;
  pQs.forEach((q,i)=>{if(pAns[i]!==null){const ok=pAns[i]===q.answer;if(ok)c++;if(currentUser)Profiles.recordAnswer(currentUser,q,ok);getAIFeedback(q,pAns[i],ok);}});
  pScore=c;
  pResult=currentUser?Profiles.recordSession(currentUser,pQs,pAns,'batch',null):null;
  render();
}
function renderPractice(){if(!pQs.length)return renderPracticeMenu();return pMode==='oneByOne'?renderOneByOne():renderBatch();}

function renderPracticeMenu(){
  const rows=[{s:'vic_maths',l:'🔢 VIC Maths',c:'var(--green)'},{s:'vic_verbal',l:'🧠 VIC Verbal',c:'var(--purple)'},{s:'vic_quant',l:'📐 VIC Quant',c:'var(--orange)'},{s:'vic_reading',l:'📖 VIC Reading',c:'var(--accent)'},{s:'nsw_thinking',l:'🧩 NSW Thinking',c:'var(--purple)'},{s:'nsw_maths',l:'🔢 NSW Maths',c:'var(--green)'},{s:'nsw_reading',l:'📖 NSW Reading',c:'var(--accent)'}];
  const styles=['acer','hendersons','psle','contour','james_ann','edutest','matrix','hast','oc'];
  return `<div class="page">${profileBar()}<h1>✏️ Practice Mode</h1><p class="mt mb20">Every correct answer earns XP and counts toward achievements.</p>
    <div class="g2 mb24">
      <div class="card hov" style="border-color:rgba(79,142,247,.4)" onclick="startPractice({},'oneByOne',12)"><div style="font-size:28px;margin-bottom:8px">1️⃣</div><h3>One at a Time</h3><p class="mt sm">Answer → AI coaching → next. Earn XP on every correct answer.</p><button class="btn ba bsm mt14">Start (12 Qs)</button></div>
      <div class="card hov" style="border-color:rgba(61,214,140,.4)" onclick="startPractice({},'batch',15)"><div style="font-size:28px;margin-bottom:8px">📋</div><h3>Answer All First</h3><p class="mt sm">Do all questions then submit — get stars for your accuracy.</p><button class="btn bg bsm mt14">Start (15 Qs)</button></div>
    </div>
    <h2 class="mb14">By Section</h2><div class="g3 mb20">${rows.map(s=>`<div class="card hov" onclick="startPractice({section:'${s.s}'},'oneByOne',10)"><div style="font-weight:800;margin-bottom:3px">${s.l}</div><div class="mt xs">${filterQs({section:s.s}).length} Qs</div><button class="btn bsm mt14" style="background:${s.c};color:#fff">Go →</button></div>`).join('')}</div>
    <h2 class="mb14">By Provider Style</h2><div class="g3">${styles.map(st=>`<div class="card hov" onclick="startPractice({style:'${st}'},'oneByOne',10)"><div style="font-weight:800;margin-bottom:3px">${STL[st]}</div><div class="mt xs">${filterQs({style:st}).length} Qs</div><button class="btn bm bsm mt14">Go →</button></div>`).join('')}</div>
  </div>`;
}

function sessionResultBlock(pct,correct,total,result){
  const stars=result?.stars||0;
  const xpEarned=result?((correct*20)+(pct===100?50:pct>=80?20:0)):0;
  return `<div class="session-result ${pct>=60?'pass':'fail'}">
    <div class="stars-display">${starsHtml(stars)}</div>
    <div style="font-weight:900;font-size:30px;color:var(--${pct>=60?'green':'orange'})">${correct}/${total} — ${pct}%</div>
    ${result?`<div class="tag ty mt14" style="display:inline-block">+${xpEarned} XP earned</div>`:''}
    <div class="mt sm mt14">${pct>=90?'🏆 Outstanding!':pct>=70?'⭐ Well done!':pct>=50?'👍 Keep it up!':'💪 Review and try again.'}</div>
  </div>`;
}

function renderOneByOne(){
  if(pIdx>=pQs.length){
    const pct=Math.round(pScore/pQs.length*100);
    return `<div class="page">${sessionResultBlock(pct,pScore,pQs.length,pResult)}<div class="fc gap8 wrap" style="justify-content:center"><button class="btn ba" onclick="startPractice({},'oneByOne',12)">🔄 New Session</button><button class="btn bm" onclick="pQs=[];render()">← Menu</button><button class="btn bm" onclick="nav('profile')">👤 My Profile</button></div></div>`;
  }
  const q=pQs[pIdx],ans=pAns[pIdx],sub=pSub&&ans!==null;
  const dots=pQs.map((_,i)=>{const bg=i===pIdx?'var(--accent)':pAns[i]!==null?(pAns[i]===pQs[i].answer?'var(--green)':'var(--red)'):'var(--border)';return `<div style="background:${bg};width:22px;height:22px;border-radius:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;flex-shrink:0" onclick="goToQ(${i})">${i+1}</div>`;}).join('');
  return `<div class="page"><div class="fc jsb mb14 wrap gap8"><div><h1>✏️ Practice</h1><p class="mt sm">Q${pIdx+1}/${pQs.length} · ${pScore} correct</p></div><button class="btn bm bsm" onclick="pQs=[];render()">✖ Exit</button></div>
    <div class="pbar mb8"><div class="pfill" style="width:${Math.round(pIdx/pQs.length*100)}%"></div></div>
    <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px">${dots}</div>
    ${qCard(q,pIdx,'oneByOne',ans,sub,false,hintVisible[q.id])}
    <div class="fc gap8 mt14 wrap">${!sub?`<button class="btn ba" onclick="handleAnswer('oneByOne',${pIdx},${ans!==null?ans:-1})" ${ans===null?'disabled':''}>✅ Check Answer</button>${q.hint&&!hintVisible[q.id]&&ans===null?`<button class="btn bm bsm" onclick="toggleHint('${q.id}')">💡 Hint</button>`:''}`
    :pIdx<pQs.length-1?`<button class="btn ba" onclick="nextQ()">Next →</button>`:`<button class="btn bg" onclick="nextQ()">See Results 🎉</button>`}</div></div>`;
}

function renderBatch(){
  const c=pAns.filter((a,i)=>a===pQs[i]?.answer).length,pct=pSub?Math.round(c/pQs.length*100):0,answered=pAns.filter(a=>a!==null).length;
  return `<div class="page"><div class="fc jsb mb14 wrap gap8"><div><h1>📋 Batch Practice</h1><p class="mt sm">${pQs.length} questions</p></div><button class="btn bm bsm" onclick="pQs=[];render()">✖ Exit</button></div>
    ${pSub?`${sessionResultBlock(pct,c,pQs.length,pResult)}<div class="fc gap8 mb20" style="justify-content:center"><button class="btn ba" onclick="startPractice({},'batch',15)">🔄 Again</button><button class="btn bm" onclick="pQs=[];render()">← Menu</button></div>`:''}
    ${pQs.map((q,i)=>qCard(q,i,'batch',pAns[i],pSub,false,false)).join('')}
    ${!pSub?`<button class="btn ba bfull mt20" style="padding:13px" onclick="submitBatch()" ${answered===pQs.length?'':'disabled'}>${answered===pQs.length?'✅ Submit All':'Answer all first ('+answered+'/'+pQs.length+')'}</button>`:''}
  </div>`;
}

// ── BROWSE ────────────────────────────────────────────────────────────────────
function renderBrowse(){
  const filtered=filterQs(browseFilters);
  const sel=(k,lbl,opts)=>`<div><label>${lbl}</label><select onchange="browseFilters['${k}']=this.value;render()">${opts.map(v=>`<option value="${v}"${browseFilters[k]===v?' selected':''}>${v==='ALL'?'All':v}</option>`).join('')}</select></div>`;
  return `<div class="page">${profileBar()}
    <div class="fc jsb mb14 wrap gap8"><div><h1>📋 Question Bank</h1><p class="mt sm">${QUESTIONS.length} total · <strong>${filtered.length}</strong> matching</p></div>
    <div class="fc gap8 wrap"><button class="btn boa bsm" onclick="filtered.forEach(q=>revealedIds.add(q.id));render()">👁 Reveal All</button><button class="btn bm bsm" onclick="revealedIds.clear();render()">🙈 Hide</button>${filtered.length?`<button class="btn ba bsm" onclick="startPractice(browseFilters,'oneByOne',12)">✏️ Practice These</button>`:''}</div></div>
    <div class="fbar">${sel('section','Section',['ALL',...uniq(QUESTIONS.map(q=>q.section))])}${sel('difficulty','Difficulty',['ALL','easy','medium','hard'])}${sel('style','Style',['ALL',...uniq(QUESTIONS.map(q=>q.style).filter(Boolean))])}${sel('topic','Topic',['ALL',...uniq(QUESTIONS.map(q=>q.topic)).sort()])}${sel('grade','Grade',['ALL',...uniq(QUESTIONS.map(q=>q.grade))])}</div>
    ${filtered.length===0?`<div class="loading">🔍 No questions match.</div>`:filtered.map((q,i)=>qCard(q,i,'browse',null,false,revealedIds.has(q.id),hintVisible[q.id])).join('')}
  </div>`;
}

// ── EXAMS ─────────────────────────────────────────────────────────────────────
function startExam(defIdx){
  const def=EXAM_DEFS[defIdx];clearInterval(examTimer);
  const f={section:def.section||'ALL'};if(def.style)f.style=def.style;if(def.difficulty)f.difficulty=def.difficulty;
  let pool=def.section==='ALL'&&!def.style&&!def.difficulty?QUESTIONS:filterQs(f);
  exam={def,defIdx,questions:shuffle(pool).slice(0,def.count),answers:[]};
  exam.answers=Array(exam.questions.length).fill(null);
  examSub=false;examTL=def.duration*60;examStart=Date.now();examResult=null;
  examTimer=setInterval(()=>{examTL--;updateTimer();if(examTL<=0)submitExam();},1000);
  screen='examrun';nav('examrun');
}
function updateTimer(){const el=document.getElementById('exam-timer');if(!el)return;const m=Math.floor(examTL/60),s=(examTL%60).toString().padStart(2,'0');el.textContent=`⏱ ${m}:${s}`;el.className='timer'+(examTL<30?' dng':examTL<90?' warn':'');}
function submitExam(){
  clearInterval(examTimer);examTimer=null;examSub=true;
  const elapsed=examStart?Math.round((Date.now()-examStart)/1000):null;
  exam.questions.forEach((q,i)=>{if(exam.answers[i]!==null)getAIFeedback(q,exam.answers[i],exam.answers[i]===q.answer);});
  examResult=currentUser?Profiles.recordSession(currentUser,exam.questions,exam.answers,'exam',exam.def):null;
  render();
}
function renderExams(){
  return `<div class="page">${profileBar()}<h1>📝 Mock Exams</h1><p class="mt mb20">Timed exams. Stars awarded for accuracy. AI coaching after submission. ${EXAM_DEFS.length} exams available.</p>
    <div class="g2">${EXAM_DEFS.map((def,i)=>{const stTag=def.state?`<span class="tag ${def.state==='NSW'?'ty':'ta'} xs">${def.state}</span>`:'';const stlTag=def.style?`<span class="tag tm xs">${STL[def.style]||def.style}</span>`:'';const dTag=def.difficulty?`<span class="tag tg xs">${def.difficulty}</span>`:'';
      return `<div class="card hov" style="border-color:${def.color}44"><div class="fc gap8 mb8 wrap">${stTag}${stlTag}${dTag}</div><h3 style="margin-bottom:5px">${def.title}</h3><p class="mt sm mb14">⏱ ${def.duration} min · 📋 ${def.count} Qs · ⭐ Up to 3 stars</p><button class="btn bsm" style="background:${def.color};color:${def.color.includes('yellow')?'#1a1200':'#fff'}" onclick="startExam(${i})">Start →</button></div>`;
    }).join('')}</div></div>`;
}
function renderExamRun(){
  if(!exam)return renderExams();
  const {def,questions,answers}=exam;const m=Math.floor(examTL/60),s=(examTL%60).toString().padStart(2,'0');
  const c=answers.filter((a,i)=>a===questions[i]?.answer).length;const pct=examSub?Math.round(c/questions.length*100):0;const answered=answers.filter(a=>a!==null).length;
  return `<div class="page"><div class="fc jsb mb14 wrap gap8"><div><h1>${def.title}</h1><p class="mt sm">${questions.length} questions</p></div>
    <div class="fc gap12">${!examSub?`<span id="exam-timer" class="timer">⏱ ${m}:${s}</span><button class="btn bo" onclick="if(confirm('Submit?'))submitExam()">Submit</button>`:`<button class="btn bm" onclick="exam=null;nav('exams')">← Exams</button>`}</div></div>
    ${examSub?`${sessionResultBlock(pct,c,questions.length,examResult)}`:''}
    ${!examSub?`<div class="card mb14" style="padding:10px 14px"><div class="fc jsb sm"><span>${answered}/${questions.length} answered</span><div style="display:flex;gap:4px;flex-wrap:wrap">${questions.map((_,i)=>`<div style="width:20px;height:20px;border-radius:4px;background:${answers[i]!==null?'var(--accent)':'var(--border)'};cursor:pointer;font-size:9px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700" onclick="document.getElementById('qc_${questions[i].id||i}')?.scrollIntoView({behavior:'smooth'})">${i+1}</div>`).join('')}</div></div></div>`:''}
    ${questions.map((q,i)=>qCard(q,i,'exam',answers[i],examSub,false,false)).join('')}
    ${!examSub?`<button class="btn bo bfull mt20" style="padding:13px" onclick="if(confirm('Submit?'))submitExam()">Submit (${answered}/${questions.length})</button>`:''}
  </div>`;
}

// ── SELECTIVE ─────────────────────────────────────────────────────────────────
function renderSelective(){
  const secs=selState==='VIC'?VIC_SECS:NSW_SECS;
  const info=selState==='VIC'
    ?{note:'~5,700 applicants → ~1,000 places. ACER-administered. Year 8 for Year 9 entry.',schools:"Melbourne High, Mac.Robertson Girls', Nossal, Suzanne Cory"}
    :{note:'~15,000 applicants → ~4,300 places. Computer-based (Janison). Year 6 for Year 7 entry.',schools:'James Ruse, North Sydney Boys/Girls, Baulkham Hills, Fort Street + 44 others'};
  return `<div class="page">${profileBar()}
    <div class="fc gap8 mb18"><button class="btn ${selState==='VIC'?'ba':'bm'}" onclick="selState='VIC';selSec=null;render()">🟦 Victoria (ACER)</button>
      <button class="btn" style="${selState==='NSW'?'background:var(--yellow);color:#1a1200;':''}${selState==='NSW'?'':'background:var(--card2);color:var(--muted);'}border:1px solid var(--border);padding:9px 16px;border-radius:9px;font-weight:700;font-size:13px;cursor:pointer" onclick="selState='NSW';selSec=null;render()">🟨 New South Wales</button></div>
    <div class="hero mb20"><h1>🏆 ${selState==='VIC'?'VIC Selective (ACER)':'NSW Selective'} Prep</h1><p class="mt sm" style="margin-top:6px;max-width:520px">${info.note}</p><p class="mt xs" style="margin-top:8px">🏫 ${info.schools}</p></div>
    <div class="card mb24" style="padding:0;overflow:hidden">${secs.map((sec,i)=>{const isW=sec.id.includes('writing');const cnt=filterQs({section:sec.id}).length;
      return `<div class="fc" style="align-items:center;gap:14px;padding:13px 18px;border-bottom:${i<secs.length-1?'1px solid var(--border)':'none'};cursor:pointer;transition:background .12s" onmouseover="this.style.background='rgba(79,142,247,.04)'" onmouseout="this.style.background=''" onclick="selSec='${sec.id}';selPQs=[];selPAns=[];selPSub=false;selWritingFeedback='';render()">
        <span style="font-size:22px;min-width:28px">${sec.e}</span>
        <div style="flex:1"><div style="font-weight:700;font-size:14px">${sec.l}</div><div class="mt xs" style="margin-top:2px">${sec.d}</div></div>
        <div style="text-align:right;min-width:90px"><span class="tag tm">${isW?'1 task':cnt+' Qs'}</span><div class="mt xs" style="margin-top:3px">${sec.m} min</div></div>
        <button class="btn bsm" style="background:var(--accent);color:#fff;min-width:80px">${isW?'✍️ Write':'▶ Practice'}</button>
      </div>`;}).join('')}</div>
    ${selSec?renderSelPanel():''}
    <div class="g2"><div class="card"><strong style="color:var(--red)">❌ NOT tested</strong><p class="mt sm" style="margin-top:5px">Memorised facts, curriculum content, prior subject knowledge.</p></div>
    <div class="card" style="border-color:rgba(79,142,247,.3)"><strong style="color:var(--accent)">✅ What IS tested</strong><p class="mt sm" style="margin-top:5px">HOW you reason — inference, patterns, problem-solving, argument quality, writing.</p></div></div>
  </div>`;
}
function renderSelPanel(){
  const allSecs=[...VIC_SECS,...NSW_SECS];const sec=allSecs.find(s=>s.id===selSec);if(!sec)return'';
  const isW=selSec.includes('writing');let body='';
  if(isW){
    const prompt=selWritingPrompt||WRITING_PROMPTS[0];const wc=selWritingText.split(/\s+/).filter(Boolean).length;
    body=`<div class="card mb14" style="border-left:3px solid var(--pink);padding-left:16px"><span class="tag tp xs" style="display:inline-block;margin-bottom:8px">${prompt.type}</span><p style="font-size:14px;line-height:1.75;font-weight:600;margin-top:4px">${prompt.text}</p><button class="btn bm bsm mt14" onclick="selWritingPrompt=WRITING_PROMPTS[Math.floor(Math.random()*WRITING_PROMPTS.length)];selWritingText='';selWritingFeedback='';render()">🔄 Different Prompt</button></div>
    <textarea style="min-height:180px" placeholder="Write your response (aim 200–300 words)..." oninput="selWritingText=this.value">${selWritingText}</textarea>
    <div class="fc jsb mt14 mb14 wrap gap8"><span class="mt sm">${wc} words ${wc>=200?'<span style="color:var(--green)">✓</span>':''}</span><button class="btn bp" onclick="doWritingMark()" ${selWritingLoading||wc<20?'disabled':''}>${selWritingLoading?'<span class="spin">⏳</span> Marking...':'📋 Get AI Score'}</button></div>
    ${selWritingFeedback?`<div class="card" style="border-color:rgba(61,214,140,.4);padding:20px"><div style="font-weight:800;color:var(--green);margin-bottom:12px">📋 AI Marker Feedback</div><pre style="white-space:pre-wrap;font-size:13px;line-height:1.9;font-family:var(--font)">${selWritingFeedback}</pre></div>`:''}`;
  }else{
    if(!selPQs.length){body=`<div class="loading"><span class="spin">⏳</span></div>`;setTimeout(()=>{selPQs=shuffle(filterQs({section:selSec})).slice(0,6);selPAns=Array(selPQs.length).fill(null);render();},50);}
    else{const c=selPAns.filter((a,i)=>a===selPQs[i]?.answer).length;const pct=selPSub?Math.round(c/selPQs.length*100):0;
      body=`${selPSub?`<div class="sbox ${pct>=60?'pass':'fail'} mb14"><div class="stars-display">${starsHtml(pct>=90?3:pct>=70?2:pct>=50?1:0)}</div><div style="font-weight:900;font-size:22px;color:var(--${pct>=60?'green':'orange'})">${c}/${selPQs.length} — ${pct}%</div></div>`:''}
      ${selPQs.map((q,i)=>qCard(q,i,'sel',selPAns[i],selPSub,false,false)).join('')}
      ${!selPSub?`<button class="btn ba bfull mt14" style="padding:11px" onclick="submitSelPractice()">✅ Check Answers</button>`:`<button class="btn bm bsm mt14" onclick="selPQs=[];selPAns=[];selPSub=false;render()">🔄 New Questions</button>`}`;}
  }
  return `<div class="card mb24" style="border-color:rgba(79,142,247,.3)"><div class="fc jsb mb14 wrap gap8"><h2 style="margin:0">${sec.e} ${sec.l}</h2><div class="fc gap8">${!isW?`<button class="btn bm bsm" onclick="selPQs=[];selPAns=[];selPSub=false;render()">🔄 New</button>`:''}<button class="btn bm bsm" onclick="selSec=null;render()">✖</button></div></div>${body}</div>`;
}
function submitSelPractice(){selPSub=true;selPQs.forEach((q,i)=>{if(selPAns[i]!==null){if(currentUser)Profiles.recordAnswer(currentUser,q,selPAns[i]===q.answer);getAIFeedback(q,selPAns[i],selPAns[i]===q.answer);}});render();}
async function doWritingMark(){if(selWritingText.split(/\s+/).filter(Boolean).length<20)return;selWritingLoading=true;render();
  const prompt=selWritingPrompt||WRITING_PROMPTS[0];
  const fb=await callClaude(`You are an expert marker for Australian selective high school entry exams. Format exactly:\nSCORES:\nIdeas & Content: X/10\nStructure & Organisation: X/10\nLanguage & Vocabulary: X/10\nGrammar & Mechanics: X/10\nTOTAL: X/40\n\nSTRENGTHS:\n• [specific strength]\n• [second strength]\n\nTO IMPROVE:\n• [actionable suggestion]\n• [second suggestion]\n\nVERDICT: [One encouraging sentence with a clear next step]`,`Prompt: ${prompt.text}\n\nStudent response:\n${selWritingText}`,900);
  selWritingFeedback=fb||'Unable to retrieve feedback. Please try again.';selWritingLoading=false;if(currentUser)Profiles.recordWriting(currentUser);render();
}

// ── STUDY NOTES ───────────────────────────────────────────────────────────────
function renderStudy(){
  if(!studySub)return `<div class="page">${profileBar()}<h1>📚 Study Notes</h1><p class="mt mb20">AI-generated revision notes for Grades 6–10.</p><div class="g3">${Object.entries(SUBJECTS).map(([sub,info])=>`<div class="card hov" style="border-color:${info.c}44" onclick="studySub='${sub}';studyTopic=null;studyNotes='';render()"><div style="font-size:28px;margin-bottom:8px">${info.e}</div><h3>${sub}</h3><p class="mt sm">${info.t.length} topics</p><button class="btn bsm mt14" style="background:${info.c};color:${info.c.includes('yellow')?'#1a1200':'#fff'}">Explore →</button></div>`).join('')}</div></div>`;
  if(!studyTopic){const info=SUBJECTS[studySub];return `<div class="page">${profileBar()}<button class="btn bm bsm mb14" onclick="studySub=null;render()">← Subjects</button><h1>${info.e} ${studySub}</h1><p class="mt mb18">Select a topic for instant notes.</p><div class="g2">${info.t.map(t=>`<div class="card hov" style="border-color:${info.c}44" onclick="studyTopic='${t}';doLoadNotes()"><h3 style="margin-bottom:4px">${t}</h3><p class="mt xs">Tap to generate ⚡</p></div>`).join('')}</div></div>`;}
  return `<div class="page">${profileBar()}<button class="btn bm bsm mb14" onclick="studyTopic=null;studyNotes='';render()">← ${studySub}</button><h1>${studyTopic}</h1>
    ${studyLoading?`<div class="loading"><span class="spin" style="font-size:28px">⏳</span><div style="margin-top:10px">Generating...</div></div>`
    :`<div class="card mb14" style="padding:22px 26px;line-height:1.9;font-size:14px">${studyNotes.replace(/^## (.+)$/gm,'<h3 style="color:var(--accent);margin:16px 0 8px;font-size:15px">$1</h3>').replace(/\n/g,'<br>')}</div>
    <div class="fc gap8 wrap"><button class="btn ba" onclick="startPractice({topic:'${studyTopic}'},'oneByOne',8)">✏️ Practice</button><button class="btn bog" onclick="doLoadNotes()">🔄 Regenerate</button><button class="btn bm" onclick="tutorQ='Give me 3 practice questions about ${studyTopic} with full solutions';nav('tutor')">🤖 Ask Tutor</button></div>`}
  </div>`;
}
async function doLoadNotes(){studyLoading=true;studyNotes='';render();const t=await callClaude('Clear tutor for Australian Year 7–10. Use ## for headings. Key concepts, formulas, 2 worked examples. Under 350 words. No bold markdown.',`Topic: ${studyTopic} (${studySub}), Year 8–9.`);studyNotes=t||'Could not load. Try again.';studyLoading=false;if(currentUser)Profiles.recordStudy(currentUser);render();}

// ── TUTOR ─────────────────────────────────────────────────────────────────────
const QUICK_PROMPTS=['How do I solve number sequence questions quickly?','Explain verbal analogies with examples','How to structure a persuasive essay for selective?','Key difference between VIC ACER and NSW tests?','Give me 3 PSLE-style maths problems with solutions','Explain the Pythagorean theorem with examples','Best reading comprehension strategies for inference?','What are EduTest verbal reasoning question types?','Explain necessary vs sufficient conditions','How do I manage time pressure in exams?'];
function renderTutor(){
  return `<div class="page"><div style="max-width:700px;margin:0 auto">${profileBar()}
    <div class="tc mb20"><div style="font-size:48px;margin-bottom:8px">🤖</div><h1>AI Study Tutor</h1><p class="mt">Ask anything about school, exams, or any subject.</p></div>
    <div class="mb14"><p class="xs mt mb8">QUICK QUESTIONS:</p><div class="fc wrap gap8">${QUICK_PROMPTS.map(q=>`<button class="btn bm bsm" onclick="tutorQ='${q.replace(/'/g,"\\'")}';doAsk()">${q.length>55?q.slice(0,52)+'...':q}</button>`).join('')}</div></div>
    <div class="fc gap8 mb20"><input type="text" id="tutor-input" placeholder="Ask your tutor anything..." value="${tutorQ.replace(/"/g,'&quot;')}" onkeydown="if(event.key==='Enter'){tutorQ=this.value;doAsk()}" oninput="tutorQ=this.value"/>
      <button class="btn ba" onclick="tutorQ=document.getElementById('tutor-input').value;doAsk()" ${tutorLoading?'disabled':''}>${tutorLoading?'<span class="spin">⏳</span>':'Ask →'}</button></div>
    ${tutorLoading?`<div class="loading"><span class="spin">⏳</span> Thinking...</div>`:''}
    ${tutorR&&!tutorLoading?`<div class="card" style="border-color:rgba(79,142,247,.4);padding:22px"><div style="font-weight:800;color:var(--accent);margin-bottom:12px">🤖 Answer</div><div style="line-height:1.85;font-size:14px;white-space:pre-wrap">${tutorR}</div><div class="fc gap8 mt14 wrap"><button class="btn bm bsm" onclick="tutorQ='Give me another example';doAsk()">Another example</button><button class="btn bm bsm" onclick="tutorQ='Quiz me on this — 3 questions with answers';doAsk()">Quiz me</button><button class="btn bm bsm" onclick="tutorQ='';tutorR='';render()">Clear</button></div></div>`
    :!tutorR&&!tutorLoading?`<div class="card tc" style="padding:40px;opacity:.5"><div style="font-size:36px;margin-bottom:10px">💬</div><div class="mt">Ask me anything!</div></div>`:''}</div></div>`;
}
async function doAsk(){const inp=document.getElementById('tutor-input');if(inp)tutorQ=inp.value;if(!tutorQ.trim())return;tutorLoading=true;tutorR='';render();const t=await callClaude(`Friendly expert tutor for Australian students Grades 4–10. Clear explanations, worked examples. For maths: show full working. Under 300 words. Plain text only. Warm and encouraging.`,tutorQ,800);tutorR=t||'Sorry, try again.';tutorLoading=false;if(currentUser)Profiles.recordTutor(currentUser);render();}

// ── FUN ZONE ─────────────────────────────────────────────────────────────────
function renderFunZone(){
  const d=currentUser?Profiles.loadData(currentUser):null;
  const funSolved=d?.funSolved||0;
  return `<div class="page">
    <div class="hero fun-hero">${profileBar()}
      <div class="mb8"><span class="tag to">🎮 FUN ZONE · GRADES 4–9</span></div>
      <h1>🎮 <span class="grad-fun">Fun Zone</span></h1>
      <p class="mt sm" style="max-width:480px;margin:10px 0 18px;line-height:1.75">Puzzles, quizzes, games and brain teasers. <strong>${funSolved} puzzles solved!</strong> Earn XP and achievement badges.</p>
      <div class="fc gap8 wrap">
        ${['math','english','brain','quiz'].map(t=>`<button class="fun-tab ${funTab===t?'on':''}" onclick="funTab='${t}';render()">${t==='math'?'🔢 Maths':t==='english'?'📖 English':t==='brain'?'🧠 Brain Gym':'📋 GK Quizzes'}</button>`).join('')}
      </div>
    </div>
    ${funTab==='math'?renderFunMath():funTab==='english'?renderFunEnglish():funTab==='brain'?renderFunBrain():renderQuizzes()}
  </div>`;
}

function renderFunQ(item,zone){
  const key=`${zone}_${item.id}`;const answered=funAnswered[key];const showExp=funShowExp[key];
  const correct=answered!==undefined&&answered===item.answer;const wrong=answered!==undefined&&answered!==item.answer;
  const diffClass={easy:'tg',medium:'to',hard:'tp'}[item.difficulty||'medium'];
  let optHtml='';
  if(item.options){
    optHtml=`<div style="display:flex;flex-direction:column;gap:6px;margin-top:12px">${item.options.map((opt,oi)=>{
      let style='background:#090b18;border:1px solid var(--border);border-radius:8px;padding:9px 12px;cursor:pointer;color:var(--text);font-size:13px;display:flex;align-items:center;gap:8px;transition:all .12s;';
      if(answered!==undefined){style+='cursor:default;';if(oi===item.answer)style+='border-color:var(--green);background:rgba(61,214,140,.1);color:var(--green);font-weight:700;';else if(answered===oi)style+='border-color:var(--red);background:rgba(247,79,79,.1);color:var(--red),';}
      const tick=answered!==undefined&&oi===item.answer?' ✓':answered===oi&&oi!==item.answer?' ✗':'';
      const click=answered===undefined?`onclick="funAnswer('${key}',${oi},${item.answer},'${zone}')"` :'';
      return `<div style="${style}" ${click}><span style="font-weight:700;opacity:.4;min-width:18px">${'ABCD'[oi]}.</span><span style="flex:1">${opt}</span>${tick?`<span>${tick}</span>`:''}</div>`;
    }).join('')}</div>`;
  }
  const expHtml=(answered!==undefined||showExp)&&item.exp?`<div class="exp mt14"><strong style="color:var(--accent)">Explanation:</strong>\n${item.exp}</div>`:'';
  const hintSection=item.hint&&answered===undefined?`<button class="btn bm bsm mt14" onclick="funShowExp['${key}_hint']=!funShowExp['${key}_hint'];render()" style="font-size:11px">💡 Hint</button>${funShowExp[key+'_hint']?`<div class="hint-box mt14">${item.hint}</div>`:''}`
    :item.hint&&answered!==undefined?`<div class="hint-box mt14">${item.hint}</div>`:'';
  const xpBadge=item.xp?`<span class="tag ty xs">+${item.xp} XP</span>`:'';
  return `<div class="fun-card ${correct?'solved':wrong?'wrong-ans':''}">
    <div class="fc gap8 mb8 wrap"><span class="tag ${diffClass}">${item.difficulty||'medium'}</span>${xpBadge}${correct?'<span class="tag tg">✅ Solved!</span>':''}</div>
    <h3 style="margin-bottom:8px">${item.title}</h3>
    ${item.description?`<p class="sm mt" style="margin-bottom:10px;line-height:1.7">${item.description}</p>`:''}
    <div class="qtxt" style="font-size:14px">${item.q||''}</div>
    ${optHtml}${hintSection}${expHtml}
    ${answered!==undefined&&!showExp?`<button class="btn bm bsm mt14" onclick="funShowExp['${key}']=true;render()">📖 Full Explanation</button>`:''}
  </div>`;
}

function funAnswer(key,chosen,correct_answer,zone){
  funAnswered[key]=chosen;funShowExp[key]=true;
  if(chosen===correct_answer&&currentUser)Profiles.recordFun(currentUser,zone);
  render();
}

function renderFunMath(){return `<div><div class="fc jsb mb14"><h2>🔢 Maths Puzzles</h2><span class="mt sm">${MATH_PUZZLES.length} puzzles</span></div>${MATH_PUZZLES.map(p=>renderFunQ(p,'math')).join('')}<div class="card tc" style="border-color:rgba(247,144,79,.3);padding:24px"><div style="font-size:30px;margin-bottom:8px">🤖</div><h3>Want more puzzles?</h3><p class="mt sm mt14 mb14">Ask the AI Tutor for custom puzzles!</p><button class="btn bo" onclick="tutorQ='Give me 3 fun maths puzzles for a Year 7 student with full solutions';nav('tutor')">Ask AI Tutor →</button></div></div>`;}
function renderFunEnglish(){return `<div><div class="fc jsb mb14"><h2>📖 English Games</h2><span class="mt sm">${ENGLISH_GAMES.length} games</span></div>${ENGLISH_GAMES.map(p=>renderFunQ(p,'english')).join('')}</div>`;}
function renderFunBrain(){return `<div><div class="fc jsb mb14"><h2>🧠 Brain Gym</h2><span class="mt sm">${BRAIN_GYM.length} challenges</span></div>${BRAIN_GYM.map(p=>renderFunQ(p,'brain')).join('')}</div>`;}

// ── GENERAL KNOWLEDGE QUIZZES ─────────────────────────────────────────────────
function renderQuizzes(){
  if(activeQuiz&&!quizSub){return renderActiveQuiz();}
  if(activeQuiz&&quizSub){return renderQuizResults();}
  const quizKeys=Object.keys(GK_QUIZZES);
  return `<div>
    <h2 class="mb8">📋 General Knowledge Quizzes</h2>
    <p class="mt sm mb14">Test your knowledge across Science, Australia, Maths, World facts and English Literature. Earn XP and the Quiz Ace badge for 100%!</p>
    <div class="g2">
      ${quizKeys.map(k=>{const quiz=GK_QUIZZES[k];const totalXP=quiz.questions.reduce((s,q)=>s+(q.xp||20),0);
        return `<div class="card hov" onclick="startQuiz('${k}')">
          <h3 style="margin-bottom:6px">${quiz.title}</h3>
          <p class="mt sm mb14">${quiz.description}</p>
          <div class="fc jsb"><div><span class="tag tm xs">${quiz.questions.length} questions</span> <span class="tag ty xs">Up to ${totalXP} XP</span></div>
          <button class="btn ba bsm">Start →</button></div>
        </div>`;}).join('')}
    </div>
  </div>`;
}

function startQuiz(key){
  activeQuiz={key,...GK_QUIZZES[key]};quizAnswers=Array(activeQuiz.questions.length).fill(null);quizSub=false;render();
}

function renderActiveQuiz(){
  const {title,questions}=activeQuiz;const answered=quizAnswers.filter(a=>a!==null).length;
  return `<div>
    <div class="fc jsb mb14 wrap gap8"><div><h2>${title}</h2><p class="mt sm">${answered}/${questions.length} answered</p></div>
      <button class="btn bm bsm" onclick="activeQuiz=null;render()">✖ Exit</button></div>
    ${questions.map((q,i)=>{
      const ans=quizAnswers[i];const sub=ans!==null;
      const correct=sub&&ans===q.answer;
      const diffClass={easy:'tg',medium:'to',hard:'tp'}[q.difficulty||'medium'];
      const opts=q.options.map((opt,oi)=>{
        let c='opt';if(ans===oi&&!sub)c+=' sel';
        if(sub){c+=' dis';if(oi===q.answer)c+=' cor';else if(ans===oi)c+=' wrg';}
        const tick=sub&&oi===q.answer?'<span class="otick">✓</span>':sub&&ans===oi&&oi!==q.answer?'<span class="otick">✗</span>':'';
        const click=!sub?`onclick="quizAnswers[${i}]=${oi};${correct?'':''}render()"` :'';
        return `<div class="${c}" ${click}><span class="oltr">${'ABCD'[oi]}.</span><span style="flex:1">${opt}</span>${tick}</div>`;
      }).join('');
      const expHtml=sub&&q.exp?`<div class="exp"><strong style="color:var(--accent)">Explanation:</strong>\n${q.exp}</div>`:'';
      return `<div class="qcard ${sub?correct?'correct':'wrong':''}"><div class="mb8 fc gap8"><span class="tag ${diffClass}">${q.difficulty}</span><span class="tag ty xs">+${q.xp||20} XP</span></div><div class="qtxt">Q${i+1}. ${q.q}</div>${opts}${expHtml}</div>`;
    }).join('')}
    <button class="btn ba bfull mt20" style="padding:13px" onclick="submitQuiz()" ${answered===questions.length?'':'disabled'}>${answered===questions.length?'✅ Submit Quiz':'Answer all ('+answered+'/'+questions.length+')'}</button>
  </div>`;
}

function submitQuiz(){
  quizSub=true;const{questions}=activeQuiz;
  const correct=quizAnswers.filter((a,i)=>a===questions[i].answer).length;
  const pct=Math.round(correct/questions.length*100);
  if(currentUser){
    questions.forEach((q,i)=>{if(quizAnswers[i]!==null)Profiles.recordAnswer(currentUser,{...q,section:'nsw_thinking',difficulty:q.difficulty||'medium'},quizAnswers[i]===q.answer);});
    if(pct===100){const d=Profiles.loadData(currentUser);d.perfectQuizzes=(d.perfectQuizzes||0)+1;Profiles.saveData(d);}
    Profiles.recordSession(currentUser,questions.map(q=>({...q,section:'quiz',answer:q.answer})),quizAnswers,'quiz',{title:activeQuiz.title,id:'quiz_'+activeQuiz.key});
  }
  render();
}

function renderQuizResults(){
  const{title,questions}=activeQuiz;const correct=quizAnswers.filter((a,i)=>a===questions[i].answer).length;const pct=Math.round(correct/questions.length*100);
  const xpEarned=questions.filter((q,i)=>quizAnswers[i]===q.answer).reduce((s,q)=>s+(q.xp||20),0);
  const stars=pct===100?3:pct>=75?2:pct>=50?1:0;
  return `<div>
    <div class="session-result ${pct>=60?'pass':'fail'}">
      <h2 style="margin-bottom:10px">${title}</h2>
      <div class="stars-display">${starsHtml(stars)}</div>
      <div class="quiz-score-big" style="color:var(--${pct>=60?'green':'orange'})">${correct}/${questions.length}</div>
      <div style="font-size:22px;margin-top:4px;color:var(--${pct>=60?'green':'orange'})">${pct}%</div>
      ${pct===100?'<div class="tag ty mt14" style="display:inline-block">🌠 Perfect Score! Quiz Ace badge unlocked!</div>':''}
      <div class="tag ty mt14" style="display:inline-block">+${xpEarned} XP earned</div>
    </div>
    <div class="fc gap8 mb20 wrap" style="justify-content:center">
      <button class="btn ba" onclick="startQuiz(activeQuiz.key)">🔄 Retry</button>
      <button class="btn bm" onclick="activeQuiz=null;render()">← All Quizzes</button>
      <button class="btn bm" onclick="nav('profile')">👤 My Profile</button>
    </div>
    ${questions.map((q,i)=>{const correct=quizAnswers[i]===q.answer;const opts=q.options.map((opt,oi)=>{let c='opt dis';if(oi===q.answer)c+=' cor';else if(quizAnswers[i]===oi)c+=' wrg';const tick=oi===q.answer?'<span class="otick">✓</span>':quizAnswers[i]===oi?'<span class="otick">✗</span>':'';return `<div class="${c}"><span class="oltr">${'ABCD'[oi]}.</span><span style="flex:1">${opt}</span>${tick}</div>`;}).join('');const expHtml=q.exp?`<div class="exp">${q.exp}</div>`:'';return `<div class="qcard ${correct?'correct':'wrong'}"><div class="qtxt">Q${i+1}. ${q.q}</div>${opts}${expHtml}</div>`;}).join('')}
  </div>`;
}

// ── HOME ──────────────────────────────────────────────────────────────────────
function renderHome(){
  const d=currentUser?Profiles.loadData(currentUser):null;
  const lv=d?Profiles.getLevel(d.xp||0):null;
  const stats=d?Profiles.getStats(currentUser):null;
  const weakSpots=stats?.weakTopics?.slice(0,3)||[];
  const PROVIDERS=[{s:'acer',l:'ACER',e:'🏛️',c:'var(--accent)'},{s:'hendersons',l:'Hendersons',e:'📐',c:'var(--green)'},{s:'psle',l:'PSLE',e:'🇸🇬',c:'var(--orange)'},{s:'contour',l:'Contour',e:'🎯',c:'var(--purple)'},{s:'james_ann',l:'James & Ann',e:'📖',c:'var(--pink)'},{s:'edutest',l:'EduTest',e:'🧪',c:'var(--teal)'},{s:'matrix',l:'Matrix',e:'📊',c:'var(--yellow)'},{s:'hast',l:'HAST',e:'⚡',c:'var(--red)'},{s:'oc',l:'OC Test',e:'🌟',c:'var(--green)'}];

  return `<div class="page">
    ${profileBar()}
    <div class="hero">
      <div class="mb8"><span class="tag ta">FREE · GRADES 4–10 · VIC & NSW · ${QUESTIONS.length} QUESTIONS · 9 STYLES</span></div>
      <h1>Welcome back${d?`, <span class="grad">${d.nickname}</span>`:''}! 🎓</h1>
      ${lv?`<div class="fc gap8 mb14 wrap"><span class="level-badge" style="background:${lv.color}22;color:${lv.color};border:1px solid ${lv.color}44;font-size:14px;padding:6px 14px">${lv.title}</span><span class="tag ty">Level ${lv.level} · ${d.xp||0} XP</span></div>`:''}
      <p class="mt sm" style="max-width:520px;margin:0 0 20px;line-height:1.75">${QUESTIONS.length} questions across 9 styles. AI coaching on every answer. Stars, XP and achievements for every session.</p>
      <div class="fc gap8 wrap">
        <button class="btn ba blg" onclick="startPractice({},'oneByOne',12)">✏️ Start Practising</button>
        <button class="btn bfun blg" onclick="nav('funzone')">🎮 Fun Zone</button>
        <button class="btn bm blg" onclick="nav('selective')">🏆 Selective Prep</button>
      </div>
    </div>

    <div class="g4 mb24">
      <div class="card tc hov" onclick="nav('browse')"><div style="font-size:22px;margin-bottom:4px">📋</div><div style="font-weight:900;font-size:22px;color:var(--accent)">${QUESTIONS.length}</div><div class="mt sm">Questions</div></div>
      <div class="card tc"><div style="font-size:22px;margin-bottom:4px">🎯</div><div style="font-weight:900;font-size:22px;color:${stats?pctColor(stats.acc):'var(--muted)'}">${stats?.totalAnswered?stats.acc+'%':'—'}</div><div class="mt sm">Accuracy</div></div>
      <div class="card tc"><div style="font-size:22px;margin-bottom:4px">🔥</div><div style="font-weight:900;font-size:22px;color:var(--orange)">${d?.streak||0}</div><div class="mt sm">Day Streak</div></div>
      <div class="card tc hov" onclick="nav('profile')"><div style="font-size:22px;margin-bottom:4px">🏅</div><div style="font-weight:900;font-size:22px;color:var(--yellow)">${(d?.achievements||[]).length}/${Profiles.ACHIEVEMENTS.length}</div><div class="mt sm">Achievements</div></div>
    </div>

    <!-- Daily Challenge -->
    <div class="daily-card mb24">
      <div class="fc jsb mb14 wrap gap8"><div><span class="tag ty" style="display:inline-block;margin-bottom:6px">⭐ DAILY CHALLENGE</span><h2 style="margin:0">3 Quick Questions (+15 XP each)</h2></div><span style="font-size:28px;animation:bounce .8s ease-in-out infinite alternate">🔥</span></div>
      <div class="g3">${['m','e','b'].map(k=>{const item=k==='m'?DAILY_PUZZLE.math:k==='e'?DAILY_PUZZLE.english:DAILY_PUZZLE.brain;const ans=dailyAnswers[k];const correct=ans===item.answer;
        return `<div class="card" style="${ans!==null?`border-color:${correct?'var(--green)':'var(--red)'}44`:''}">
          <div class="tag ${k==='m'?'tg':k==='e'?'tp':'tpu'} mb8" style="display:inline-block">${k==='m'?'🔢 Maths':k==='e'?'📖 English':'🧠 Brain'}</div>
          <div class="sm mb10" style="font-weight:700;margin-top:6px;line-height:1.5">${item.q}</div>
          ${ans===null?`<div style="display:flex;flex-direction:column;gap:5px">${item.options.map((o,oi)=>`<button class="btn bm bsm" style="justify-content:flex-start;font-size:12px;text-align:left;padding:5px 10px" onclick="dailyAnswers['${k}']=${oi};${oi===item.answer&&currentUser?`Profiles.recordAnswer('${currentUser}',{id:'daily_${k}',topic:'Daily',section:'nsw_thinking',difficulty:'medium',style:'acer'},true);`:''}render()">${'ABCD'[oi]}. ${o}</button>`).join('')}</div>`
          :`<div class="${correct?'':'mt'} sm">${correct?'✅ Correct! +15 XP':'❌ Not quite.'}</div><div class="exp" style="margin-top:8px;font-size:12px">${item.exp}</div>`}
        </div>`;}).join('')}
      </div>
    </div>

    ${weakSpots.length?`<div class="card mb24" style="border-color:rgba(247,79,79,.3)"><h3 style="color:var(--red);margin-bottom:10px">⚠️ Your Weak Spots — Practise to Level Up!</h3><div class="fc gap8 wrap">${weakSpots.map(t=>`<button class="btn bm bsm" onclick="startPractice({topic:'${t.topic}'},'oneByOne',8)">${t.topic} — ${t.pct}% · Fix it ✏️</button>`).join('')}</div></div>`:''}

    <h2 class="mb14">Practice by Provider Style</h2>
    <div class="g3 mb20">${PROVIDERS.map(p=>`<div class="card hov" style="border-color:${p.c}44" onclick="startPractice({style:'${p.s}'},'oneByOne',10)"><div style="font-size:22px;margin-bottom:6px">${p.e}</div><div style="font-weight:800;margin-bottom:3px">${p.l}</div><div class="mt xs mb10">${filterQs({style:p.s}).length} questions</div><button class="btn bsm" style="background:${p.c};color:${p.c.includes('yellow')?'#1a1200':'#fff'};font-size:11px">Practice</button></div>`).join('')}</div>

    <div class="g2"><div class="card"><strong style="color:var(--red)">❌ NOT tested in selective</strong><p class="mt sm" style="margin-top:5px">Memorised facts, curriculum content, prior subject knowledge.</p></div><div class="card" style="border-color:rgba(79,142,247,.3)"><strong style="color:var(--accent)">✅ What IS tested</strong><p class="mt sm" style="margin-top:5px">HOW you reason — patterns, inference, problem-solving, argument quality, writing.</p></div></div>
  </div>`;
}

// ── BOOT ──────────────────────────────────────────────────────────────────────
// Try to restore last used profile
const lastUser = Profiles.getProfileList()[0];
if(lastUser) currentUser = lastUser.nickname;
nav('home');
