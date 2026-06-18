// app.js — StudySpark v3: Personalised profiles, quizzes, achievements
// ─────────────────────────────────────────────────────────────────────────────

const SL  = {vic_reading:'📖 VIC Reading',vic_maths:'🔢 VIC Maths',vic_verbal:'🧠 VIC Verbal',vic_quant:'📐 VIC Quant',nsw_reading:'📖 NSW Reading',nsw_maths:'🔢 NSW Maths',nsw_thinking:'🧩 NSW Thinking'};
const SC  = {vic_reading:'ta',vic_maths:'tg',vic_verbal:'tpu',vic_quant:'to',nsw_reading:'ta',nsw_maths:'tg',nsw_thinking:'tpu'};
const DC  = {easy:'tg',medium:'to',hard:'tp'};
const STL = {acer:'ACER',hendersons:'Hendersons',psle:'PSLE',contour:'Contour',james_ann:'James & Ann',edutest:'EduTest',matrix:'Matrix',oc:'OC Test',hast:'HAST'};

const NAV_ITEMS = [
  {id:'home',l:'🏠 Home'},{id:'browse',l:'📋 Questions'},
  {id:'practice',l:'✏️ Practice'},{id:'exams',l:'📝 Exams'},
  {id:'selective',l:'🏆 Selective'},{id:'tips',l:'💡 Tips'},
  {id:'study',l:'📚 Study'},{id:'tutor',l:'🤖 Tutor'},
  {id:'funzone',l:'🎮 Fun Zone'},{id:'languages',l:'🗣️ Languages'},{id:'profile',l:'👤 Profile'},
];

const EXAM_DEFS = [
  {id:'e1',title:'VIC – Reading',section:'vic_reading',duration:30,count:25,color:'var(--accent)',state:'VIC'},
  {id:'e2',title:'VIC – Mathematics',section:'vic_maths',duration:30,count:30,color:'var(--green)',state:'VIC'},
  {id:'e3',title:'VIC – Verbal Reasoning',section:'vic_verbal',duration:30,count:30,color:'var(--purple)',state:'VIC'},
  {id:'e4',title:'VIC – Quantitative Reasoning',section:'vic_quant',duration:30,count:25,color:'var(--orange)',state:'VIC'},
  {id:'e5',title:'NSW – Thinking Skills',section:'nsw_thinking',duration:40,count:30,color:'var(--purple)',state:'NSW'},
  {id:'e6',title:'NSW – Mathematical Reasoning',section:'nsw_maths',duration:40,count:30,color:'var(--green)',state:'NSW'},
  {id:'e7',title:'NSW – Reading',section:'nsw_reading',duration:30,count:25,color:'var(--accent)',state:'NSW'},
  {id:'e8',title:'VIC Full Selective (Mixed)',section:'ALL',duration:60,count:60,color:'var(--accent)',state:'VIC'},
  {id:'e9',title:'NSW Full Selective (Mixed)',section:'ALL',duration:50,count:50,color:'var(--yellow)',state:'NSW'},
  {id:'e10',title:'Hendersons E/SHS Style',section:'ALL',style:'hendersons',duration:30,count:30,color:'var(--green)'},
  {id:'e11',title:'PSLE Singapore Maths',section:'vic_maths',style:'psle',duration:30,count:25,color:'var(--orange)'},
  {id:'e12',title:'Contour Logic & Reasoning',section:'ALL',style:'contour',duration:30,count:25,color:'var(--purple)'},
  {id:'e13',title:'EduTest Full Practice',section:'ALL',style:'edutest',duration:30,count:25,color:'var(--teal)'},
  {id:'e14',title:'Matrix Education Style',section:'ALL',style:'matrix',duration:30,count:25,color:'var(--yellow)'},
  {id:'e15',title:'HAST Academic Scholarship',section:'ALL',style:'hast',duration:30,count:25,color:'var(--red)'},
  {id:'e16',title:'OC Opportunity Class (Yr4-5)',section:'ALL',style:'oc',duration:25,count:25,color:'var(--green)'},
  {id:'e17',title:'James & Ann Reading Comp',section:'vic_reading',style:'james_ann',duration:30,count:25,color:'var(--pink)'},
  {id:'e18',title:'Easy Confidence Builder',section:'ALL',difficulty:'easy',duration:15,count:20,color:'var(--teal)'},
  {id:'e19',title:'Tamil Hub – Language & Culture',section:'vic_verbal',style:'tamil_hub',duration:20,count:20,color:'var(--orange)'},
  {id:'e20',title:'Brightminds Academy',section:'ALL',style:'brightminds',duration:30,count:25,color:'var(--purple)'},
  {id:'e21',title:'Maths Sprint (Quick 10)',section:'vic_maths',duration:5,count:10,color:'var(--green)'},
  {id:'e22',title:'Vocab Challenge (Hard)',section:'vic_verbal',difficulty:'hard',duration:15,count:20,color:'var(--pink)'},
  {id:'e23',title:'Indian Languages Quiz',section:'vic_verbal',duration:10,count:15,color:'var(--orange)'},
  {id:'e24',title:'VIC Maths (Hard Only)',section:'vic_maths',difficulty:'hard',duration:30,count:25,color:'var(--red)'},
  {id:'e25',title:'NSW Thinking (Hard Only)',section:'nsw_thinking',difficulty:'hard',duration:30,count:25,color:'var(--red)'},
  {id:'e26',title:'SEAL – Maths (Grade 7)',section:'vic_maths',style:'seal',duration:30,count:30,color:'var(--green)'},
  {id:'e27',title:'SEAL – Verbal (Grade 7)',section:'vic_verbal',style:'seal',duration:30,count:25,color:'var(--purple)'},
  {id:'e28',title:'SEAL – Reading (Grade 7)',section:'vic_reading',style:'seal',duration:25,count:20,color:'var(--accent)'},
  {id:'e29',title:'SEAL – Quantitative (Grade 7)',section:'vic_quant',style:'seal',duration:25,count:20,color:'var(--orange)'},
  {id:'e30',title:'SEAL Full Mixed (Grade 7)',section:'ALL',style:'seal',duration:60,count:50,color:'var(--red)'},
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
  Mathematics:{e:'🔢',c:'var(--accent)',t:[
    'Algebra — Equations & Inequalities','Algebra — Simultaneous Equations','Algebra — Quadratics & Factorising',
    'Geometry — Angles & Lines','Geometry — Circles & Arcs','Geometry — Pythagoras & Trigonometry',
    'Geometry — 3D Shapes & Volume','Fractions, Decimals & Percentages','Ratios & Proportions',
    'Number Theory — Primes, HCF, LCM','Indices & Surds','Statistics & Data Analysis',
    'Probability — Basic to Advanced','Sequences & Series','Coordinate Geometry & Linear Graphs',
    'Measurement — Area & Perimeter','Compound Interest & Financial Maths','Venn Diagrams & Sets',
    'Combinatorics — Counting & Arrangements','Word Problems & Problem Solving'
  ]},
  English:{e:'📖',c:'var(--pink)',t:[
    'Reading Comprehension — Inference','Reading Comprehension — Main Idea','Vocabulary in Context',
    'Grammar — Parts of Speech','Grammar — Punctuation & Apostrophes','Grammar — Sentence Types',
    'Persuasive Writing — Techniques','Persuasive Writing — Structure','Creative Writing — Narrative',
    'Poetry — Literary Devices','Poetry — Analysis & Interpretation','Author\'s Purpose & Tone',
    'Text Structure & Organisation','Figurative Language — Metaphor & Simile','Figurative Language — Personification & Onomatopoeia',
    'Critical Analysis — Evaluating Arguments','Essay Writing — Introduction & Conclusion','Spelling & Word Formation'
  ]},
  Science:{e:'🔬',c:'var(--green)',t:[
    'Cells — Structure & Function','Genetics & Heredity','Human Body Systems','Plant Biology & Photosynthesis',
    'Ecosystems & Food Webs','Periodic Table & Elements','Chemical Reactions & Equations','Acids, Bases & pH',
    'Forces — Newton\'s Laws','Energy — Types & Transformation','Electricity & Circuits','Waves — Light & Sound',
    'Earth Science — Rocks & Plate Tectonics','Weather & Climate Systems','Space — Solar System & Universe',
    'Scientific Method & Experimental Design','Environmental Science & Sustainability'
  ]},
  History:{e:'🏛️',c:'var(--orange)',t:[
    'Australian History — First Nations People','Australian History — Federation & Federation Era','Australian History — World War I',
    'Australian History — World War II','Australian History — Post-War Immigration','Cold War & Superpower Rivalry',
    'Ancient Egypt — Society & Culture','Ancient Greece — Democracy & Philosophy','Ancient Rome — Republic & Empire',
    'Democracy & Government Systems','Civil Rights Movements — Global','Industrial Revolution',
    'French Revolution','Human Rights & The UN','Significant Historical Figures'
  ]},
  Geography:{e:'🌍',c:'var(--purple)',t:[
    'Australian Geography — States & Capitals','Australian Geography — Physical Features','Climate Zones & Biomes',
    'Natural Disasters — Earthquakes & Volcanoes','Natural Disasters — Cyclones & Floods','Landforms — Mountains, Rivers, Coasts',
    'Population — Distribution & Growth','Urbanisation & Cities','Sustainability & Environmental Issues',
    'Global Trade & Economic Geography','Maps, Scale & Grid References','Human Impact on the Environment'
  ]},
  Tamil:{e:'🌺',c:'var(--orange)',t:[
    'Tamil Alphabet — Vowels (உயிர் எழுத்துக்கள்)','Tamil Alphabet — Consonants (மெய் எழுத்துக்கள்)',
    'Tamil Numbers 1–100','Basic Vocabulary — Home & Family','Basic Vocabulary — Food & Colours',
    'Tamil Grammar — Cases (வேற்றுமை)','Tamil Grammar — Verb Tenses','Tamil Grammar — SOV Sentence Structure',
    'Classical Tamil Literature — Thirukkural','Classical Tamil Literature — Sangam Poetry',
    'Tamil Festivals — Pongal & Diwali','Tamil Culture — Music & Dance (Bharatanatyam)',
    'Tamil Proverbs & Idioms','Tamil Writing Practice','Tamil in Australia & the World'
  ]},
};

// ── STATE ─────────────────────────────────────────────────────────────────────
let screen='home', currentUser=null;
let browseFilters={section:'ALL',grade:'ALL',topic:'ALL',difficulty:'ALL',style:'ALL'};
let revealedIds=new Set(), hintVisible={};
let pQs=[],pAns=[],pSub=false,pMode='oneByOne',pScore=0,pIdx=0,pResult=null;
let pPageSize=10,pPagePool=[],pPageFilters={},pTotalDone=0,pTotalCorrect=0; // pagination
let exam=null,examSub=false,examTL=0,examTimer=null,examStart=null,examResult=null;
let selState='VIC',selSec=null,selPQs=[],selPAns=[],selPSub=false;
let selWritingPrompt=null,selWritingText='',selWritingFeedback='',selWritingLoading=false;
let studySub=null,studyTopic=null,studyNotes='',studyLoading=false;
let tutorQ='',tutorR='',tutorLoading=false;
let funTab='little',funAnswered={},funShowExp={},littleZone='early',littleSection=null;
let langSelected=null,langSection=null,langAnswered={},langShowExp={};
let browseAnswered={},browseShowExp={}; // per-question state in browse mode
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

// ── API KEY MANAGEMENT ───────────────────────────────────────────────────────
function getApiKey(){return localStorage.getItem('ss_apikey')||'';}
function setApiKey(k){localStorage.setItem('ss_apikey',k.trim());}
function hasApiKey(){return !!getApiKey();}

function showApiKeyPrompt(onSave){
  const existing=getApiKey();
  const modal=document.createElement('div');
  modal.className='modal-overlay';modal.id='apikey-modal';
  modal.innerHTML=`<div class="modal" style="max-width:500px">
    <h3 class="mb8">🔑 Enter your Anthropic API Key</h3>
    <p class="mt sm mb14" style="line-height:1.7">AI features (coaching, study notes, writing feedback, tutor) need an Anthropic API key.<br/>
    Get a free key at <a href="https://console.anthropic.com" target="_blank" style="color:var(--accent)">console.anthropic.com</a></p>
    <p class="mt xs mb14">Your key is stored only in this browser — never sent anywhere except Anthropic.</p>
    <input type="password" id="apikey-input" placeholder="sk-ant-api03-..." value="${existing}" style="margin-bottom:12px;font-family:monospace;font-size:12px"/>
    <div class="fc gap8">
      <button class="btn ba" onclick="
        const k=document.getElementById('apikey-input').value.trim();
        if(!k){alert('Please paste your API key.');return;}
        setApiKey(k);
        document.getElementById('apikey-modal').remove();
        ${onSave?onSave:'render();'}
      ">Save & Continue</button>
      <button class="btn bm" onclick="document.getElementById('apikey-modal').remove()">Cancel</button>
    </div>
    <p class="xs mt" style="margin-top:12px;line-height:1.6">💡 Tip: after pasting your key once, it's remembered in this browser. You only need to enter it again if you clear your browser data or switch devices.</p>
  </div>`;
  document.body.appendChild(modal);
  setTimeout(()=>document.getElementById('apikey-input')?.focus(),100);
}

async function callClaude(system,user,maxTok=400,model='fast'){
  const key=getApiKey();
  if(!key) return '__NO_KEY__';
  // Use Haiku for speed on feedback/tutor, Sonnet only for writing marking
  const modelId = model==='smart'
    ? 'claude-sonnet-4-6'
    : 'claude-haiku-4-5-20251001';
  const controller = new AbortController();
  const timeout = setTimeout(()=>controller.abort(), 25000); // 25s timeout
  try{
    const r=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      signal:controller.signal,
      headers:{
        'Content-Type':'application/json',
        'x-api-key':key,
        'anthropic-version':'2023-06-01',
        'anthropic-dangerous-direct-browser-access':'true'
      },
      body:JSON.stringify({
        model:modelId,
        max_tokens:maxTok,
        system,
        messages:[{role:'user',content:user}]
      })
    });
    clearTimeout(timeout);
    const d=await r.json();
    if(d.error){
      console.error('API error:',d.error.type, d.error.message);
      if(d.error.type==='authentication_error'||d.error.type==='permission_error'){
        localStorage.removeItem('ss_apikey');
        return '__BAD_KEY__';
      }
      return '';
    }
    return d.content?.map(c=>c.text||'').join('')||'';
  }catch(e){
    clearTimeout(timeout);
    if(e.name==='AbortError') console.error('API timeout');
    else console.error('callClaude error:',e.message);
    return '';
  }
}

// Wrapper that handles key errors gracefully
async function callClaudeUI(system,user,maxTok=400,onNoKey,model='fast'){
  const result=await callClaude(system,user,maxTok,model);
  if(result==='__NO_KEY__'){
    showApiKeyPrompt(onNoKey||'render()');
    return null;
  }
  if(result==='__BAD_KEY__'){
    showApiKeyPrompt("alert('Key saved. Please try again.');render();");
    return null;
  }
  return result;
}
async function getAIFeedback(q,userAns,correct){
  if(!hasApiKey()) return;
  const key=`${q.id}_${userAns}`;
  if(AIcache[key]||AIloading.has(key)) return;
  AIloading.add(key);
  const sys=`Selective exam tutor. 3 short lines, plain text:
${correct?'✅ [why correct, 8 words]':'❌ [what went wrong, 8 words]'}
💡 [key rule for this question type, 8 words]
🎯 [one practice tip, 8 words]`;
  const usr=`${q.topic} Q: ${q.q.slice(0,100)}. Chosen: ${q.options[userAns]}. Correct: ${q.options[q.answer]}.`;
  const fb=await callClaude(sys,usr,120);
  if(fb && fb!=='__NO_KEY__' && fb!=='__BAD_KEY__') AIcache[key]=fb;
  else if(fb==='__BAD_KEY__') localStorage.removeItem('ss_apikey');
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
  try{
  if(!currentUser&&screen!=='profile'){el.innerHTML=renderProfilePicker();return;}
  const R={home:renderHome,browse:renderBrowse,practice:renderPractice,exams:renderExams,examrun:renderExamRun,selective:renderSelective,tips:renderTips,study:renderStudy,tutor:renderTutor,funzone:renderFunZone,languages:renderLanguages,profile:renderProfile};
  el.innerHTML=(R[screen]||renderHome)();
  }catch(err){
    console.error('render error:',err);
    el.innerHTML=`<div class="page"><div class="card" style="border-color:rgba(247,79,79,.4);padding:24px;text-align:center">
      <div style="font-size:32px;margin-bottom:12px">⚠️</div>
      <h3 style="color:var(--red);margin-bottom:8px">Something went wrong</h3>
      <p class="mt sm mb16">${err.message||'Unexpected error'}</p>
      <button class="btn ba" onclick="screen='home';render()">🏠 Go Home</button>
    </div></div>`;
  }
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
      <button class="btn bm bsm" onclick="showApiKeyPrompt('render()')" style="border-color:${hasApiKey()?'rgba(61,214,140,.5)':'rgba(247,144,79,.5)'}">🔑 ${hasApiKey()?'✅ API Key Set':'⚠️ Set API Key'}</button>
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
    if(mode!=='browse'&&mode!=='review'&&sel&&!submitted)c+=' sel';
    if(submitted||revealed){c+=' dis';if(oi===q.answer)c+=' cor';else if(submitted&&sel)c+=' wrg';}
    const tick=(submitted||revealed)&&oi===q.answer?'<span class="otick">✓</span>':submitted&&sel&&oi!==q.answer?'<span class="otick">✗</span>':'';
    const click=(!submitted&&!revealed&&mode!=='browse')?`onclick="handleAnswer('${mode}',${idx},${oi})"` :'';
    return `<div class="${c}" ${click}><span class="oltr">${'ABCD'[oi]}.</span><span style="flex:1">${opt}</span>${tick}</div>`;
  }).join('');
  const expHtml=(submitted&&userAns!==null||revealed||mode==='review')&&q.exp?`<div class="exp"><strong style="color:var(--accent)">Explanation:</strong>\n${q.exp}</div>`:'';
  const hintHtml=showHint&&q.hint&&!submitted&&!revealed?`<div class="hint-box">💡 ${q.hint}</div>`:'';
  let aiFb='';
  if(submitted&&userAns!==null){
    if(fbLoad){
      aiFb=`<div class="aifb ${correct?'correct':'wrong'}"><span class="spin">⏳</span> <em style="color:var(--muted)">Getting tip...</em></div>`;
    } else if(fb){
      const lines=fb.split('\n').filter(l=>l.trim());
      aiFb=`<div class="aifb ${correct?'correct':'wrong'}">
        <div class="aifb-hdr" style="color:var(--${correct?'green':'orange'})">🤖 Quick Tip</div>
        ${lines.map(l=>`<div style="margin-bottom:3px">${l}</div>`).join('')}
      </div>`;
    } else if(hasApiKey()){
      // Show a small "get tip" button instead of auto-loading
      aiFb=`<div style="margin-top:8px"><button class="btn bm bsm" style="font-size:12px" onclick="getAIFeedback(QUESTIONS.find(x=>x.id==='${q.id}')||{id:'${q.id}',topic:'${q.topic||''}',difficulty:'${q.difficulty||'medium'}',q:'',options:${JSON.stringify(q.options)},answer:${q.answer},exp:''},${userAns},${correct})">🤖 Get quick tip</button></div>`;
    }
  }
  const browseActs=mode==='browse'?`<div class="fc gap8 mt14 wrap"><button class="btn bm bsm" onclick="toggleReveal('${q.id}')">${revealed?'🙈 Hide':'👁 Show'}</button>${!revealed?`<button class="btn bm bsm" onclick="toggleHint('${q.id}')">💡 Hint</button>`:''}<button class="btn ba bsm" onclick="practiceOne('${q.id}')">✏️ Practice</button></div>`:'';
  return `<div class="${cls}"><div class="mb8 fc gap8 wrap">${q.section?`<span class="tag ${SC[q.section]||'tm'}">${SL[q.section]||q.section}</span>`:''} ${q.topic?`<span class="tag tm">${q.topic}</span>`:''} ${q.difficulty?`<span class="tag ${DC[q.difficulty]||'tm'}">${q.difficulty}</span>`:''} ${q.style?`<span class="tag tm xs">${STL[q.style]||q.style}</span>`:''}</div><div class="qtxt">Q${idx+1}. ${q.q}</div>${hintHtml}${opts}${expHtml}${aiFb}${browseActs}</div>`;
}

// ── HANDLERS ──────────────────────────────────────────────────────────────────
function handleAnswer(mode,idx,oi){
  if(mode==='oneByOne'){
    if(pSub)return;
    pAns[pIdx]=oi;render();
  }else if(mode==='batch'){if(pSub)return;pAns[idx]=oi;render();}
  else if(mode==='exam'){if(examSub)return;exam.answers[idx]=oi;render();}
  else if(mode==='sel'){if(selPSub)return;selPAns[idx]=oi;render();}
  else if(mode==='quiz'){if(quizSub)return;quizAnswers[idx]=oi;render();}
}

function submitOneByOne(){
  const ans=pAns[pIdx];
  if(ans===null||pSub)return;
  const q=pQs[pIdx];const ok=ans===q.answer;
  if(ok)pScore++;
  if(currentUser)Profiles.recordAnswer(currentUser,q,ok);
  pSub=true;
  getAIFeedback(q,ans,ok);
  render();
}
function toggleReveal(id){revealedIds.has(id)?revealedIds.delete(id):revealedIds.add(id);render();}
function toggleHint(id){hintVisible[id]=!hintVisible[id];render();}
function practiceOne(id){const q=QUESTIONS.find(x=>x.id===id);if(!q)return;pQs=[q];pAns=[null];pSub=false;pMode='oneByOne';pScore=0;pIdx=0;pResult=null;screen='practice';nav('practice');}

// ── PRACTICE ──────────────────────────────────────────────────────────────────
function startPractice(f={},mode='oneByOne',pageSize=10,qList=null){
  const fullPool=qList||shuffle(filterQs(f));
  if(!fullPool.length){alert('No questions match those filters. Try different settings.');return;}
  pPagePool=fullPool;
  pPageFilters=f;
  pPageSize=Math.min(pageSize,fullPool.length);
  pMode=mode; // set mode BEFORE loadPracticePage
  pTotalDone=0;pTotalCorrect=0;
  loadPracticePage(0);
  nav('practice');
}

function loadPracticePage(startIdx){
  const page=pPagePool.slice(startIdx,startIdx+pPageSize);
  pQs=page;
  pAns=Array(page.length).fill(null);
  pSub=false;pMode=pMode||'oneByOne';pScore=0;pIdx=0;pResult=null;
}
function nextQ(){
  if(pIdx<pQs.length-1){pIdx++;pSub=pAns[pIdx]!==null;render();return;}
  pIdx=pQs.length;
  if(!pResult)pResult=currentUser?Profiles.recordSession(currentUser,pQs,pAns,pMode,null):null;
  render();
}
function goToQ(i){
  if(i>=pQs.length){
    if(!pResult)pResult=currentUser?Profiles.recordSession(currentUser,pQs,pAns,pMode,null):null;
    pIdx=pQs.length;render();return;
  }
  pIdx=i;pSub=pAns[i]!==null;render();
}
function submitBatch(){
  pSub=true;let c=0;
  pQs.forEach((q,i)=>{if(pAns[i]!==null){const ok=pAns[i]===q.answer;if(ok)c++;if(currentUser)Profiles.recordAnswer(currentUser,q,ok);}});
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
      <div class="card" style="border-color:rgba(79,142,247,.4)">
        <div style="font-size:28px;margin-bottom:8px">1️⃣</div>
        <h3 class="mb8">One at a Time</h3>
        <p class="mt sm mb14">Select → Check → get tip → Next. Pages of 10 — keep going as long as you like!</p>
        <p class="xs mt mb10">How many per page?</p>
        <div class="fc gap8 wrap">
          <button class="btn ba bsm" onclick="startPractice({},'oneByOne',5)">5 per page</button>
          <button class="btn ba bsm" onclick="startPractice({},'oneByOne',10)">10 per page</button>
          <button class="btn ba bsm" onclick="startPractice({},'oneByOne',20)">20 per page</button>
        </div>
      </div>
      <div class="card" style="border-color:rgba(61,214,140,.4)">
        <div style="font-size:28px;margin-bottom:8px">📋</div>
        <h3 class="mb8">Answer All Then Submit</h3>
        <p class="mt sm mb14">Answer a full page, submit it, review answers, then keep going to the next page.</p>
        <p class="xs mt mb10">How many per page?</p>
        <div class="fc gap8 wrap">
          <button class="btn bg bsm" onclick="startPractice({},'batch',5)">5 per page</button>
          <button class="btn bg bsm" onclick="startPractice({},'batch',10)">10 per page</button>
          <button class="btn bg bsm" onclick="startPractice({},'batch',20)">20 per page</button>
        </div>
      </div>
    </div>
    <h2 class="mb14">By Section</h2><div class="g3 mb20">${rows.map(s=>{const cnt=filterQs({section:s.s}).length;return `<div class="card hov" onclick="startPractice({section:'${s.s}'},'oneByOne',9999)"><div style="font-weight:800;margin-bottom:3px">${s.l}</div><div class="mt xs">${cnt} questions available</div><div class="fc gap8 mt14 wrap"><button class="btn bsm" style="background:${s.c};color:#fff" onclick="event.stopPropagation();startPractice({section:'${s.s}'},'oneByOne',10)">10 Qs</button><button class="btn bsm" style="background:${s.c};color:#fff" onclick="event.stopPropagation();startPractice({section:'${s.s}'},'oneByOne',9999)">All ${cnt}</button></div></div>`;}).join('')}</div>
    <h2 class="mb14">By Provider Style</h2><div class="g3">${styles.map(st=>{const cnt=filterQs({style:st}).length;return `<div class="card hov" onclick="startPractice({style:'${st}'},'oneByOne',9999)"><div style="font-weight:800;margin-bottom:3px">${STL[st]}</div><div class="mt xs">${cnt} questions</div><div class="fc gap8 mt14 wrap"><button class="btn bm bsm" onclick="event.stopPropagation();startPractice({style:'${st}'},'oneByOne',10)">10 Qs</button><button class="btn bm bsm" onclick="event.stopPropagation();startPractice({style:'${st}'},'oneByOne',9999)">All ${cnt}</button></div></div>`;}).join('')}</div>
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
  // ── RESULTS + FULL REVIEW SCREEN ──────────────────────────────────────────
  if(pIdx>=pQs.length){
    const pct=Math.round(pScore/pQs.length*100);
    const wrongQs=pQs.filter((_,i)=>pAns[i]!==null&&pAns[i]!==pQs[i].answer);
    // Accumulate totals across pages (only once per result view)
    if(!pResult){
      pTotalDone=(pTotalDone||0)+pQs.length;
      pTotalCorrect=(pTotalCorrect||0)+pScore;
    }
    // Work out pagination position
    const currentPageStart=pPagePool.indexOf(pQs[0]);
    const nextStart=currentPageStart+pQs.length;
    const hasMore=pPagePool.length>0&&nextStart<pPagePool.length;
    const pagesTotal=Math.ceil(pPagePool.length/pPageSize);
    const pageCurrent=Math.ceil((currentPageStart+1)/pPageSize);

    if(!pResult)pResult=currentUser?Profiles.recordSession(currentUser,pQs,pAns,pMode,null):null;

    return `<div class="page">
      ${sessionResultBlock(pct,pScore,pQs.length,pResult)}

      ${hasMore?`<div class="card mb20" style="border-color:rgba(79,142,247,.4);padding:22px;text-align:center">
        <div style="font-size:28px;margin-bottom:8px">➡️</div>
        <h3 class="mb8">Page ${pageCurrent} of ${pagesTotal} complete</h3>
        <p class="mt sm mb14">${pPagePool.length-nextStart} more questions available in this set.</p>
        <div class="fc gap8 wrap" style="justify-content:center">
          <button class="btn ba blg" onclick="loadPracticePage(${nextStart});pMode='oneByOne';render()">
            ▶ Next ${Math.min(pPageSize,pPagePool.length-nextStart)} Questions →
          </button>
          <button class="btn bm" onclick="pTotalDone=0;pTotalCorrect=0;pPagePool=[];pQs=[];render()">✖ Stop Here</button>
        </div>
        <div class="mt xs mt14">Running total: ${pTotalCorrect}/${pTotalDone} correct (${Math.round(pTotalCorrect/pTotalDone*100)}%)</div>
      </div>`
      :`<div class="fc gap8 wrap mb20" style="justify-content:center">
        ${pTotalDone>pQs.length?`<div class="card mb14" style="text-align:center;width:100%;border-color:rgba(61,214,140,.4)"><h3>🏁 All Done! Running total: ${pTotalCorrect}/${pTotalDone} (${Math.round(pTotalCorrect/pTotalDone*100)}%)</h3></div>`:''}
        <button class="btn ba" onclick="startPractice(pPageFilters,pMode,pPageSize)">🔄 New Session</button>
        <button class="btn bm" onclick="pTotalDone=0;pTotalCorrect=0;pPagePool=[];pQs=[];render()">← Menu</button>
        <button class="btn bm" onclick="nav('profile')">👤 My Profile</button>
      </div>`
      }

      <h2 class="mb8">📋 Review — Page ${pageCurrent}</h2>
      <p class="mt sm mb14">All answers and explanations for this page.</p>
      ${pQs.map((q,i)=>{
        const ans=pAns[i];const answered=ans!==null;const correct=answered&&ans===q.answer;
        return `<div class="card mb10" style="border-color:${!answered?'var(--border)':correct?'rgba(61,214,140,.4)':'rgba(247,79,79,.35)'}">
          <div class="fc jsb mb8">
            <span class="sm" style="font-weight:700;color:var(--muted)">Q${i+1} ${!answered?'⬜':correct?'✅':'❌'} ${q.topic||''}</span>
            <span class="tag ${DC[q.difficulty]||'tm'}">${q.difficulty}</span>
          </div>
          ${qCard(q,i,'review',ans,answered,false,false)}
        </div>`;
      }).join('')}
      ${wrongQs.length?`<div class="card mt20" style="border-color:rgba(247,79,79,.3);padding:20px">
        <h3 style="color:var(--red);margin-bottom:10px">⚠️ ${wrongQs.length} to redo</h3>
        <button class="btn bo" onclick="pPagePool=[...pQs.filter((_,i)=>pAns[i]!==null&&pAns[i]!==pQs[i].answer)];pPageSize=${Math.min(wrongQs.length,10)};pMode='oneByOne';loadPracticePage(0);render()">🔄 Redo Wrong Questions</button>
      </div>`:''}
    </div>`;
  }

  // ── LIVE QUESTION SCREEN ───────────────────────────────────────────────────
  const q=pQs[pIdx],ans=pAns[pIdx],sub=pSub&&ans!==null;
  const answered=pAns.filter(a=>a!==null).length;
  const dots=pQs.map((_,i)=>{
    const a=pAns[i];
    const bg=i===pIdx?'var(--accent)':a!==null?(a===pQs[i].answer?'var(--green)':'var(--red)'):'var(--border)';
    const icon=i===pIdx?'→':a!==null?(a===pQs[i].answer?'✓':'✗'):(i+1);
    return `<div title="Q${i+1}" style="background:${bg};min-width:24px;height:24px;border-radius:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;flex-shrink:0;padding:0 3px" onclick="goToQ(${i})">${icon}</div>`;
  }).join('');

  return `<div class="page">
    <div class="fc jsb mb14 wrap gap8">
      <div><h1>✏️ Practice</h1><p class="mt sm">Q${pIdx+1}/${pQs.length} · ${pScore} correct · ${answered} answered</p></div>
      <button class="btn bm bsm" onclick="pQs=[];render()">✖ Exit</button>
    </div>
    <div class="pbar mb8"><div class="pfill" style="width:${Math.round((answered)/pQs.length*100)}%"></div></div>
    <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:14px">${dots}</div>
    ${qCard(q,pIdx,'oneByOne',ans,sub,false,hintVisible[q.id])}
    <div class="fc gap8 mt14 wrap">
      ${pIdx>0?`<button class="btn bm bsm" onclick="goToQ(${pIdx-1})">← Back</button>`:''}
      ${!sub
        ?`<button class="btn ba" onclick="submitOneByOne()" ${ans===null?'disabled':''}>✅ Check Answer</button>
           ${q.hint&&!hintVisible[q.id]&&ans===null?`<button class="btn bm bsm" onclick="toggleHint('${q.id}')">💡 Hint</button>`:''}`
        :pIdx<pQs.length-1
          ?`<button class="btn ba" onclick="nextQ()">Next →</button>`
          :`<button class="btn bg" onclick="nextQ()">See Results & Review 🎉</button>`
      }
      ${sub&&pIdx<pQs.length-1?`<button class="btn bm bsm" onclick="goToQ(${pQs.length})" style="margin-left:auto">Skip to Results</button>`:''}
    </div>
  </div>`;
}

function renderBatch(){
  const c=pAns.filter((a,i)=>a===pQs[i]?.answer).length,pct=pSub?Math.round(c/pQs.length*100):0,answered=pAns.filter(a=>a!==null).length;
  const wrongQs=pSub?pQs.filter((_,i)=>pAns[i]!==null&&pAns[i]!==pQs[i].answer):[];
  const currentPageStart=pPagePool.length>0?pPagePool.indexOf(pQs[0]):0;
  const nextStart=currentPageStart+pQs.length;
  const hasMore=pSub&&pPagePool.length>0&&nextStart<pPagePool.length;
  const pagesTotal=pPagePool.length>0?Math.ceil(pPagePool.length/pPageSize):1;
  const pageCurrent=pPagePool.length>0?Math.ceil((currentPageStart+1)/pPageSize):1;
  // Note: totals tracked in result section to avoid double-count on re-renders
  return `<div class="page">
    <div class="fc jsb mb14 wrap gap8"><div><h1>📋 Batch Practice</h1><p class="mt sm">${pQs.length} questions${pSub?` · ${c} correct`:`· ${answered} answered`}${pPagePool.length>pQs.length?` · Page ${pageCurrent}/${pagesTotal}`:''}</p></div><button class="btn bm bsm" onclick="pTotalDone=0;pTotalCorrect=0;pPagePool=[];pQs=[];render()">✖ Exit</button></div>
    ${pSub?`${sessionResultBlock(pct,c,pQs.length,pResult)}
    ${hasMore?`<div class="card mb20" style="border-color:rgba(79,142,247,.4);padding:20px;text-align:center">
      <h3 class="mb8">Page ${pageCurrent} done! ${pPagePool.length-nextStart} more questions available.</h3>
      <div class="fc gap8 wrap" style="justify-content:center">
        <button class="btn ba" onclick="pSub=false;loadPracticePage(${nextStart});pMode='batch';render()">▶ Next ${Math.min(pPageSize,pPagePool.length-nextStart)} Questions →</button>
        <button class="btn bm bsm" onclick="pTotalDone=0;pTotalCorrect=0;pPagePool=[];pQs=[];render()">✖ Stop</button>
      </div>
      ${pTotalDone>pQs.length?`<div class="mt xs mt10">Running total: ${pTotalCorrect}/${pTotalDone} correct</div>`:''}
    </div>`:
    `<div class="fc gap8 mb16 wrap" style="justify-content:center">
      <button class="btn ba" onclick="startPractice(pPageFilters,'batch',pPageSize)">🔄 New Session</button>
      <button class="btn bm" onclick="pTotalDone=0;pTotalCorrect=0;pPagePool=[];pQs=[];render()">← Menu</button>
      ${wrongQs.length?`<button class="btn bo bsm" onclick="pPagePool=[...pQs.filter((_,i)=>pAns[i]!==null&&pAns[i]!==pQs[i].answer)];pPageSize=10;pMode='batch';loadPracticePage(0);render()">🔄 Redo ${wrongQs.length} Wrong</button>`:''}
    </div>`}
    <h2 class="mb8">📋 Full Review — Page ${pageCurrent}</h2><p class="mt sm mb14">All answers and explanations below.</p>`:''}
    ${pQs.map((q,i)=>{
      const a=pAns[i],correct=pSub&&a===q.answer;
      return pSub
        ?`<div class="card mb10" style="border-color:${a===null?'var(--border)':correct?'rgba(61,214,140,.4)':'rgba(247,79,79,.35)'}">
            <div class="fc jsb mb8"><span class="sm" style="font-weight:700;color:var(--muted)">Q${i+1} ${a===null?'⬜':correct?'✅':'❌'} ${q.topic||''}</span><span class="tag ${DC[q.difficulty]||'tm'}">${q.difficulty}</span></div>
            ${qCard(q,i,'review',a,a!==null,false,false)}
          </div>`
        :qCard(q,i,'batch',a,false,false,false);
    }).join('')}
    ${!pSub?`<button class="btn ba bfull mt20" style="padding:13px" onclick="submitBatch()" ${answered===pQs.length?'':'disabled'}>${answered===pQs.length?'✅ Submit & Review All':'Answer all first ('+answered+'/'+pQs.length+')'}</button>`:''}
  </div>`;
}

// ── BROWSE ────────────────────────────────────────────────────────────────────
function renderBrowse(){
  const filtered=filterQs(browseFilters);
  const selEl=(k,lbl,opts)=>`<div>
    <label style="font-size:11px;color:var(--muted);font-weight:700;display:block;margin-bottom:3px">${lbl}</label>
    <select onchange="browseFilters['${k}']=this.value;browseAnswered={};browseShowExp={};render()" style="width:auto;min-width:110px;padding:6px 9px;font-size:12px">
      ${opts.map(v=>`<option value="${v}"${browseFilters[k]===v?' selected':''}>${v==='ALL'?'All':v}</option>`).join('')}
    </select>
  </div>`;
  return `<div class="page">${profileBar()}
    <div class="fc jsb mb14 wrap gap8">
      <div><h1>📋 Question Bank</h1>
        <p class="mt sm">${QUESTIONS.length} total · <strong>${filtered.length}</strong> matching — click any option to answer</p>
      </div>
      <div class="fc gap8 wrap">
        <button class="btn ba bsm" onclick="startPractice(browseFilters,'oneByOne',Math.min(${filtered.length},20))">✏️ Practice ${Math.min(filtered.length,20)} of These</button>
        <button class="btn bm bsm" onclick="browseAnswered={};browseShowExp={};render()">🔄 Reset Answers</button>
      </div>
    </div>
    <div class="fbar" style="gap:8px">
      ${selEl('section','Section',['ALL',...uniq(QUESTIONS.map(q=>q.section))])}
      ${selEl('difficulty','Difficulty',['ALL','easy','medium','hard'])}
      ${selEl('style','Style',['ALL',...uniq(QUESTIONS.map(q=>q.style).filter(Boolean))])}
      ${selEl('topic','Topic',['ALL',...uniq(QUESTIONS.map(q=>q.topic)).sort()])}
    </div>
    ${filtered.length===0
      ? `<div class="loading">🔍 No questions match. Try clearing some filters.</div>`
      : filtered.map((q,i)=>{
          const bKey='br_'+q.id;
          const bAns=browseAnswered[bKey];
          const bSub=bAns!==undefined;
          const bCorrect=bSub&&bAns===q.answer;
          // Build interactive card
          const opts=q.options.map((opt,oi)=>{
            let c='opt';
            if(bSub){c+=' dis';if(oi===q.answer)c+=' cor';else if(bAns===oi)c+=' wrg';}
            const click=!bSub?`onclick="browseAnswered['${bKey}']=${oi};browseShowExp['${bKey}']=true;if(${oi}===${q.answer}&&currentUser)Profiles.recordAnswer(currentUser,QUESTIONS.find(x=>x.id==='${q.id}'),true);render()"` :'';
            const tick=bSub&&oi===q.answer?'<span class="otick">✓</span>':bSub&&bAns===oi?'<span class="otick">✗</span>':'';
            return `<div class="${c}" ${click}><span class="oltr">${'ABCD'[oi]}.</span><span style="flex:1">${opt}</span>${tick}</div>`;
          }).join('');
          const exp=bSub&&q.exp?`<div class="exp"><strong style="color:var(--accent)">Explanation:</strong>\n${q.exp}</div>`:'';
          const hint=browseShowExp[bKey+'_hint']?`<div class="hint-box">💡 ${q.hint}</div>`:
            (!bSub&&q.hint?`<button class="btn bm bsm mt8" onclick="browseShowExp['${bKey}_hint']=true;render()" style="font-size:11px">💡 Hint</button>`:'');
          const result=bSub?`<div class="sm mt10" style="color:var(--${bCorrect?'green':'orange'})">${bCorrect?'✅ Correct!':'❌ Not quite — see the explanation below.'}</div>`:'';
          return `<div class="qcard ${bSub?bCorrect?'correct':'wrong':''}" style="margin-bottom:12px">
            <div class="mb8 fc gap8 wrap">
              ${q.section?`<span class="tag ${SC[q.section]||'tm'}">${SL[q.section]||q.section}</span>`:''}
              ${q.topic?`<span class="tag tm">${q.topic}</span>`:''}
              ${q.difficulty?`<span class="tag ${DC[q.difficulty]||'tm'}">${q.difficulty}</span>`:''}
              ${q.style?`<span class="tag tm xs">${STL[q.style]||q.style}</span>`:''}
            </div>
            <div class="qtxt">Q${i+1}. ${q.q}</div>
            ${opts}${hint}${result}${exp}
          </div>`;
        }).join('')
    }
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
  // AI feedback loads on demand when user taps 'Get Feedback' on each question
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
    <div class="g2 mb20"><div class="card"><strong style="color:var(--red)">❌ NOT tested</strong><p class="mt sm" style="margin-top:5px">Memorised facts, curriculum content, prior subject knowledge.</p></div>
    <div class="card" style="border-color:rgba(79,142,247,.3)"><strong style="color:var(--accent)">✅ What IS tested</strong><p class="mt sm" style="margin-top:5px">HOW you reason — inference, patterns, problem-solving, argument quality, writing.</p></div></div>
    <div class="card" style="border-color:rgba(79,216,247,.3);padding:20px">
      <h3 class="mb12">💡 Section-by-section tips</h3>
      <div class="fc gap8 wrap">
        ${[['reading','📖 Reading Tips'],['maths','🔢 Maths Tips'],['verbal','🧠 Verbal Tips'],['quant','📐 Quant Tips'],['writing','✍️ Writing Tips'],['examday','⏱️ Exam Day']].map(([id,lbl])=>`<button class="btn bm bsm" onclick="tipPage='${id}';nav('tips')">${lbl}</button>`).join('')}
      </div>
    </div>
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
    if(!selPQs.length){body=`<div class="loading"><span class="spin">⏳</span></div>`;setTimeout(()=>{const pool=filterQs({section:selSec});selPQs=shuffle(pool).slice(0,Math.min(pool.length,15));selPAns=Array(selPQs.length).fill(null);render();},50);}
    else{const c=selPAns.filter((a,i)=>a===selPQs[i]?.answer).length;const pct=selPSub?Math.round(c/selPQs.length*100):0;
      body=`${selPSub?`<div class="sbox ${pct>=60?'pass':'fail'} mb14"><div class="stars-display">${starsHtml(pct>=90?3:pct>=70?2:pct>=50?1:0)}</div><div style="font-weight:900;font-size:22px;color:var(--${pct>=60?'green':'orange'})">${c}/${selPQs.length} — ${pct}%</div></div>`:''}
      ${selPQs.map((q,i)=>qCard(q,i,'sel',selPAns[i],selPSub,false,false)).join('')}
      ${!selPSub?`<button class="btn ba bfull mt14" style="padding:11px" onclick="submitSelPractice()">✅ Check Answers</button>`:`<div class="fc gap8 wrap mt14"><button class="btn bm bsm" onclick="selPQs=[];selPAns=[];selPSub=false;render()">🔄 10 New Questions</button><button class="btn ba bsm" onclick="startPractice({section:selSec},'oneByOne',9999)">✏️ Do All in Practice Mode</button></div>`}`;}
  }
  return `<div class="card mb24" style="border-color:rgba(79,142,247,.3)"><div class="fc jsb mb14 wrap gap8"><h2 style="margin:0">${sec.e} ${sec.l}</h2><div class="fc gap8">${!isW?`<button class="btn bm bsm" onclick="selPQs=[];selPAns=[];selPSub=false;render()">🔄 New</button>`:''}<button class="btn bm bsm" onclick="selSec=null;render()">✖</button></div></div>${body}</div>`;
}
function submitSelPractice(){selPSub=true;selPQs.forEach((q,i)=>{if(selPAns[i]!==null){if(currentUser)Profiles.recordAnswer(currentUser,q,selPAns[i]===q.answer);}});render();}
async function doWritingMark(){if(selWritingText.split(/\s+/).filter(Boolean).length<20)return;selWritingLoading=true;render();
  const prompt=selWritingPrompt||WRITING_PROMPTS[0];
  const fb=await callClaudeUI('Selective exam writing marker. Format exactly:\nSCORES: Ideas X/10, Structure X/10, Language X/10, Mechanics X/10, TOTAL X/40\nSTRENGTH: [one line]\nIMPROVE: [one line]\nVERDICT: [one encouraging sentence]',`Prompt: ${prompt.text.slice(0,100)}\nResponse: ${selWritingText.slice(0,600)}`,250,null,'smart');
  if(fb===null){selWritingLoading=false;render();return;}
  selWritingFeedback=fb||'Unable to retrieve feedback. Please try again.';selWritingLoading=false;if(currentUser)Profiles.recordWriting(currentUser);render();
}

// ── STUDY NOTES ───────────────────────────────────────────────────────────────
function renderStudy(){
  if(!studySub)return `<div class="page">${profileBar()}<h1>📚 Study Notes</h1><p class="mt mb20">AI-generated revision notes for Grades 6–10.</p><div class="g3">${Object.entries(SUBJECTS).map(([sub,info])=>`<div class="card hov" style="border-color:${info.c}44" onclick="studySub='${sub}';studyTopic=null;studyNotes='';render()"><div style="font-size:28px;margin-bottom:8px">${info.e}</div><h3>${sub}</h3><p class="mt sm">${info.t.length} topics</p><button class="btn bsm mt14" style="background:${info.c};color:${info.c.includes('yellow')?'#1a1200':'#fff'}">Explore →</button></div>`).join('')}</div></div>`;
  if(!studyTopic){const info=SUBJECTS[studySub];return `<div class="page">${profileBar()}<button class="btn bm bsm mb14" onclick="studySub=null;render()">← Subjects</button><h1>${info.e} ${studySub}</h1><p class="mt mb18">Select a topic for instant notes.</p><div class="g2">${info.t.map(t=>`<div class="card hov" style="border-color:${info.c}44" onclick="studyTopic='${t}';doLoadNotes()"><h3 style="margin-bottom:4px">${t}</h3><p class="mt xs">Tap to generate ⚡</p></div>`).join('')}</div></div>`;}
  return `<div class="page">${profileBar()}<button class="btn bm bsm mb14" onclick="studyTopic=null;studyNotes='';render()">← ${studySub}</button><h1>${studyTopic}</h1>
    ${studyLoading?`<div class="loading"><span class="spin" style="font-size:28px">⏳</span><div style="margin-top:10px">Generating...</div></div>`
    :studyNotes==='__ERROR__'
    ?`<div class="card mb14" style="border-color:rgba(247,79,79,.4);padding:24px;text-align:center">
      <div style="font-size:28px;margin-bottom:8px">⚠️</div>
      <h3 style="color:var(--red);margin-bottom:8px">Could not generate notes</h3>
      <p class="mt sm mb16">Please set a valid Anthropic API key to use AI features.</p>
      <div class="fc gap8 wrap" style="justify-content:center">
        <button class="btn bo" onclick="showApiKeyPrompt('doLoadNotes()')">🔑 Set API Key</button>
        <button class="btn bm" onclick="doLoadNotes()">🔄 Try Again</button>
      </div>
    </div>`
    :`<div class="card mb14" style="padding:22px 26px;line-height:1.9;font-size:14px">${studyNotes.replace(/^## (.+)$/gm,'<h3 style="color:var(--accent);margin:16px 0 8px;font-size:15px">$1</h3>').replace(/^• (.+)$/gm,'<div style="padding-left:12px">• $1</div>').replace(/\n/g,'<br>')}</div>
    <div class="fc gap8 wrap"><button class="btn ba" onclick="startPractice({topic:'${studyTopic}'},'oneByOne',8)">✏️ Practice</button><button class="btn bog" onclick="doLoadNotes()">🔄 Regenerate</button><button class="btn bm" onclick="tutorQ='Give me 3 practice questions about ${studyTopic} with full solutions';nav('tutor')">🤖 Ask Tutor</button></div>`}
  </div>`;
}
async function doLoadNotes(){
  if(!hasApiKey()){showApiKeyPrompt('doLoadNotes()');return;}
  studyNotes='';studyLoading=true;render();
  try{
    const t=await callClaudeUI(
      'Australian selective school tutor, Grades 4-10. Write clear study notes:\n## Key Concepts\n• 3-5 concise bullet points covering the core ideas\n## Formula / Rule\n[The key formula or rule to remember]\n## Worked Example\n[One step-by-step example]\n## Exam Tips\n• 2-3 tips specific to selective exams\nUnder 300 words. Plain text, use ## headings and bullet points.',
      `Topic: ${studyTopic} | Subject: ${studySub} | Australian curriculum, selective exam focus.`
    );
    if(t===null){studyLoading=false;return;}  // user shown API key prompt
    studyNotes=t||'__ERROR__';
  }catch(e){
    console.error('Study notes error:',e);
    studyNotes='__ERROR__';
  }
  studyLoading=false;render();
}


function renderTutor(){
  const QUICK_PROMPTS=[
    'How do I solve number sequence questions quickly?',
    'Explain verbal analogies with 3 worked examples',
    'How to structure a persuasive essay for selective exams?',
    'Key difference between VIC ACER and NSW Selective tests?',
    'Give me 3 PSLE-style maths word problems with solutions',
    'Explain the Pythagorean theorem with examples',
    'Best reading comprehension strategies for inference?',
    'What are main types of EduTest verbal reasoning questions?',
    'Explain necessary vs sufficient conditions with examples',
    'How do I manage time pressure in selective exams?',
    'Explain common logical fallacies with everyday examples',
    'Give me 5 hard vocabulary words with memory tricks',
    'How to find the nth term of a sequence — step by step',
    'Explain probability with dice and card examples',
    'What is the difference between simile, metaphor and personification?',
    'Give me a practice reading passage with questions and answers',
    'How do I solve simultaneous equations? Show me 2 methods',
    'Tips for writing a creative narrative in exam conditions',
    'Explain Venn diagrams and inclusion-exclusion principle',
    'What are the key geometry formulas I need to memorise?',
  ];
  return `<div class="page"><div style="max-width:700px;margin:0 auto">
    <div class="tc mb24">
      <div style="font-size:52px;margin-bottom:10px">🤖</div>
      <h1>AI Study Tutor</h1>
      <p class="mt">Ask anything about school, selective prep, exam strategy, or any subject.</p>
    </div>
    <div class="mb14">
      <p class="xs mt mb8" style="opacity:.6;text-transform:uppercase;letter-spacing:.05em">Quick questions:</p>
      <div class="fc wrap gap8">
        ${QUICK_PROMPTS.map(q=>`<button class="btn bm bsm" style="text-align:left;max-width:280px" onclick="tutorQ='${q.replace(/'/g,"\'")}';doAsk()">${q.length>55?q.slice(0,52)+'...':q}</button>`).join('')}
      </div>
    </div>
    <div class="fc gap8 mb20">
      <input type="text" id="tutor-input" placeholder="Ask your tutor anything..." value="${tutorQ.replace(/"/g,'&quot;')}"
        onkeydown="if(event.key==='Enter'){tutorQ=this.value;doAsk()}"
        oninput="tutorQ=this.value"/>
      <button class="btn ba" onclick="tutorQ=document.getElementById('tutor-input').value;doAsk()" ${tutorLoading?'disabled':''}>
        ${tutorLoading?'<span class="spin">⏳</span>':'Ask →'}
      </button>
    </div>
    ${tutorLoading?`<div class="loading"><span class="spin">⏳</span> Thinking...</div>`:''}
    ${tutorR&&!tutorLoading?`<div class="card" style="border-color:rgba(79,142,247,.4);padding:22px">
      <div style="font-weight:800;color:var(--accent);margin-bottom:12px">🤖 Tutor Response</div>
      <div style="line-height:1.85;font-size:14px;white-space:pre-wrap">${tutorR}</div>
      <div class="fc gap8 mt14 wrap">
        <button class="btn bm bsm" onclick="tutorQ='Can you give me another example of that?';doAsk()">Another example</button>
        <button class="btn bm bsm" onclick="tutorQ='Now give me 3 practice questions on that topic with answers';doAsk()">Quiz me</button>
        <button class="btn bm bsm" onclick="tutorQ='';tutorR='';render()">Clear</button>
      </div>
    </div>`
    :!tutorR&&!tutorLoading?`<div class="card tc" style="padding:44px;opacity:.5">
      <div style="font-size:38px;margin-bottom:10px">💬</div>
      <div class="mt">Ask me anything — I'm here to help!</div>
    </div>`:''
    }
  </div></div>`;
}

async function doAsk(){
  const inp=document.getElementById('tutor-input');if(inp)tutorQ=inp.value;
  if(!tutorQ.trim())return;
  if(!hasApiKey()){showApiKeyPrompt('doAsk()');return;}
  tutorLoading=true;tutorR='';render();
  const t=await callClaudeUI('Australian selective exam tutor, Grades 4-10. Clear explanation, show full working for maths. Under 200 words. Plain text only.',tutorQ,400);
  if(t===null){tutorLoading=false;render();return;}
  tutorR=t||'__TUTOR_ERROR__';
  tutorLoading=false;if(currentUser)Profiles.recordTutor(currentUser);render();
}

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
        <div class="fc gap8 wrap">
          <button class="fun-tab" style="${funTab==='little'?'background:linear-gradient(135deg,var(--green),var(--teal));color:#fff':'background:var(--card2);color:var(--muted);border:1px solid var(--border)'}" onclick="funTab='little';render()">🌱 Little Learners (KG–Gr5)</button>
          <button class="fun-tab ${funTab==='math'?'on':''}" onclick="funTab='math';render()">🔢 Maths Puzzles</button>
          <button class="fun-tab ${funTab==='english'?'on':''}" onclick="funTab='english';render()">📖 English Games</button>
          <button class="fun-tab ${funTab==='brain'?'on':''}" onclick="funTab='brain';render()">🧠 Brain Gym</button>
          <button class="fun-tab ${funTab==='quiz'?'on':''}" onclick="funTab='quiz';render()">📋 GK Quizzes</button>
        </div>
      </div>
    </div>
    ${funTab==='little'?renderLittleLearners():funTab==='math'?renderFunMath():funTab==='english'?renderFunEnglish():funTab==='brain'?renderFunBrain():renderQuizzes()}
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

// ── LITTLE LEARNERS RENDERER ─────────────────────────────────────────────────
function renderLittleLearners() {
  const zones = LITTLE_LEARNERS;

  // Zone picker
  if (!littleSection) {
    const zoneKeys = ['early','junior','rising'];
    return `<div>
      <h2 class="mb8">🌱 Little Learners</h2>
      <p class="mt sm mb20">Fun learning activities for younger students — pick your level!</p>
      ${zoneKeys.map(zk => {
        const z = zones[zk];
        // Count total activities
        const total = z.sections.reduce((sum,s) => sum + s.activities.length, 0);
        const done = z.sections.reduce((sum,s) =>
          sum + s.activities.filter(a => funAnswered[zk+'_'+a.id] !== undefined).length, 0);
        return `<div class="card hov mb14" style="border-color:${z.color}44" onclick="littleZone='${zk}';littleSection='picker';render()">
          <div class="fc gap12 mb8">
            <span style="font-size:36px">${zk==='early'?'🌱':zk==='junior'?'🌿':'⭐'}</span>
            <div style="flex:1">
              <h3 style="margin-bottom:3px">${z.label}</h3>
              <div class="sm mt">${z.subtitle}</div>
            </div>
            <div style="text-align:right">
              <div style="font-weight:800;color:${z.color}">${done}/${total}</div>
              <div class="xs mt">completed</div>
            </div>
          </div>
          <div class="pbar"><div class="pfill" style="width:${total?Math.round(done/total*100):0}%;background:${z.color}"></div></div>
          <div class="fc gap8 mt14 wrap">
            ${z.sections.map(s => `<span class="tag tm">${s.emoji} ${s.title}</span>`).join('')}
          </div>
          <button class="btn bsm mt14" style="background:${z.color};color:${z.color.includes('purple')?'#fff':'#0a1a0a'}">Start Learning →</button>
        </div>`;
      }).join('')}
    </div>`;
  }

  // Section picker within a zone
  const zone = zones[littleZone];
  if (littleSection === 'picker') {
    return `<div>
      <div class="fc gap8 mb14">
        <button class="btn bm bsm" onclick="littleSection=null;render()">← All Levels</button>
      </div>
      <div class="fc gap12 mb20">
        <span style="font-size:36px">${littleZone==='early'?'🌱':littleZone==='junior'?'🌿':'⭐'}</span>
        <div><h2 style="margin-bottom:3px">${zone.label}</h2><p class="mt sm">${zone.subtitle}</p></div>
      </div>
      <div class="g2">
        ${zone.sections.map(sec => {
          const done = sec.activities.filter(a => funAnswered[littleZone+'_'+a.id] !== undefined).length;
          const allDone = done === sec.activities.length;
          return `<div class="card hov" style="border-color:${zone.color}44;${allDone?'border-color:rgba(61,214,140,.5)':''}" onclick="littleSection='${sec.id}';render()">
            <div style="font-size:30px;margin-bottom:8px">${sec.emoji}</div>
            <h3 style="margin-bottom:4px">${sec.title}</h3>
            <div class="sm mt mb10">${sec.activities.length} activities</div>
            <div class="pbar mb10"><div class="pfill" style="width:${Math.round(done/sec.activities.length*100)}%;background:${zone.color}"></div></div>
            <div class="fc jsb">
              <span class="xs mt">${done}/${sec.activities.length} done</span>
              ${allDone?'<span class="tag tg xs">✅ Complete!</span>':''}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }

  // Show activities in a section
  const sec = zone.sections.find(s => s.id === littleSection);
  if (!sec) { littleSection = 'picker'; return renderLittleLearners(); }

  const allDone = sec.activities.every(a => funAnswered[littleZone+'_'+a.id] !== undefined);
  const correct = sec.activities.filter(a => {
    const ans = funAnswered[littleZone+'_'+a.id];
    return ans !== undefined && ans === a.answer;
  }).length;

  return `<div>
    <div class="fc gap8 mb14 wrap">
      <button class="btn bm bsm" onclick="littleSection='picker';render()">← ${zone.label}</button>
    </div>
    <div class="fc gap12 mb20">
      <span style="font-size:30px">${sec.emoji}</span>
      <div>
        <h2 style="margin-bottom:3px">${sec.title}</h2>
        <p class="mt sm">${zone.subtitle}</p>
      </div>
    </div>
    ${allDone ? `<div class="sbox pass mb20">
      <div style="font-size:32px;margin-bottom:8px">🎉</div>
      <div style="font-weight:900;font-size:22px;color:var(--green)">${correct}/${sec.activities.length} Correct!</div>
      <div class="mt sm mt14">Amazing work! You completed this section.</div>
      <button class="btn bg bsm mt14" onclick="littleSection='picker';render()">Try Another Section →</button>
    </div>` : ''}
    ${sec.activities.map(item => {
      const key = littleZone + '_' + item.id;
      const answered = funAnswered[key];
      const showExp = funShowExp[key];
      const correct = answered !== undefined && answered === item.answer;
      const wrong = answered !== undefined && answered !== item.answer;

      const opts = item.options.map((opt, oi) => {
        let style = 'background:#090b18;border:1px solid var(--border);border-radius:8px;padding:10px 14px;cursor:pointer;color:var(--text);font-size:14px;display:flex;align-items:center;gap:10px;margin-bottom:8px;transition:all .12s;';
        if (answered !== undefined) {
          style += 'cursor:default;';
          if (oi === item.answer) style += 'border-color:var(--green);background:rgba(61,214,140,.1);color:var(--green);font-weight:700;font-size:15px;';
          else if (answered === oi) style += 'border-color:var(--red);background:rgba(247,79,79,.1);color:var(--red);';
        }
        const tick = answered !== undefined && oi === item.answer ? ' ✓' : answered === oi && oi !== item.answer ? ' ✗' : '';
        const click = answered === undefined ? `onclick="littleAnswer('${key}',${oi},${item.answer},'${littleZone}')"` : '';
        return `<div style="${style}" ${click}><span style="font-weight:700;min-width:22px;opacity:.5">${'ABCD'[oi]}.</span><span style="flex:1">${opt}</span>${tick ? `<span style="font-weight:900">${tick}</span>` : ''}</div>`;
      }).join('');

      const expHtml = (answered !== undefined) && item.exp
        ? `<div style="margin-top:12px;padding:12px 16px;background:#12152a;border-radius:8px;font-size:13px;color:var(--muted);line-height:1.85;white-space:pre-line">${item.exp}</div>` : '';

      const hintHtml = item.hint && answered === undefined
        ? `<button class="btn bm bsm mt10" onclick="funShowExp['${key}_hint']=!funShowExp['${key}_hint'];render()" style="font-size:11px">💡 Need a hint?</button>
           ${funShowExp[key+'_hint'] ? `<div class="hint-box mt10">${item.hint}</div>` : ''}` : '';

      return `<div class="card mb14" style="border-color:${wrong?'rgba(247,79,79,.4)':correct?'rgba(61,214,140,.4)':'var(--border)'}">
        <div class="fc jsb mb10">
          <span class="tag tm xs">${item.type}</span>
          <span class="tag ty xs">+${item.xp} XP</span>
        </div>
        <h3 style="margin-bottom:12px;font-size:15px">${item.title}</h3>
        <div style="font-weight:600;font-size:14px;line-height:1.7;margin-bottom:12px;white-space:pre-line">${item.q}</div>
        ${opts}
        ${hintHtml}
        ${expHtml}
        ${answered !== undefined ? `<div class="sm mt14" style="color:${correct?'var(--green)':'var(--red)'};">${correct ? '🌟 Well done!' : '💪 Good try — read the explanation above to learn!'}</div>` : ''}
      </div>`;
    }).join('')}
    ${allDone ? '' : `<div class="card tc mt14" style="padding:20px;border-style:dashed"><p class="mt sm">Answer all questions above to complete this section and earn your stars! ⭐</p></div>`}
  </div>`;
}

function littleAnswer(key, chosen, correct_answer, zone) {
  funAnswered[key] = chosen;
  funShowExp[key] = true;
  if (chosen === correct_answer && currentUser) Profiles.recordFun(currentUser, zone);
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
    ${!hasApiKey()?`<div class="card mb14" style="border-color:rgba(247,144,79,.5);background:rgba(247,144,79,.06);padding:14px 18px"><div class="fc gap10 wrap" style="align-items:center"><span style="font-size:20px">⚠️</span><div style="flex:1"><strong>AI features need an API key</strong><p class="sm mt" style="margin-top:3px">Study Notes, AI Tutor, Writing Feedback and AI Coaching all need a free Anthropic API key.</p></div><button class="btn bo bsm" onclick="showApiKeyPrompt('render()')">🔑 Set API Key</button></div></div>`:''}
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

    <!-- Tips & techniques callout -->
    <div class="card mb24" style="border-color:rgba(79,216,247,.35);background:linear-gradient(135deg,rgba(79,216,247,.05),transparent);padding:22px">
      <div class="fc gap12 mb14 wrap">
        <span style="font-size:36px">💡</span>
        <div>
          <h2 style="margin-bottom:4px">Tips & Techniques</h2>
          <p class="mt sm">Written for you — not your parents. Real strategies that work for every section.</p>
        </div>
      </div>
      <div class="g4">
        ${['mindset','reading','maths','verbal','quant','writing','examday','habits'].map(id => {
          const c = TIPS_DATA.overview.find(x=>x.id===id);
          if (!c) return '';
          return `<div class="card hov" style="border-color:${c.color}33;padding:12px;text-align:center;cursor:pointer" onclick="tipPage='${id}';nav('tips')">
            <div style="font-size:22px;margin-bottom:5px">${c.emoji}</div>
            <div style="font-size:12px;font-weight:700;line-height:1.4">${c.title}</div>
          </div>`;
        }).join('')}
      </div>
      <button class="btn bt bsm mt14" onclick="tipPage=null;nav('tips')">View All Tips & Guides →</button>
    </div>

    <!-- Languages callout -->
    <div class="card mb24" style="border-color:rgba(155,89,247,.35);background:linear-gradient(135deg,rgba(155,89,247,.05),transparent);padding:22px">
      <div class="fc gap12 mb14 wrap">
        <span style="font-size:36px">🗣️</span>
        <div>
          <h2 style="margin-bottom:4px">Indian Language Zone</h2>
          <p class="mt sm">Explore Tamil, Telugu, Malayalam and Hindi — script, numbers, words, culture and riddles.</p>
        </div>
      </div>
      <div class="g4">
        ${Object.entries(LANGUAGES).map(([key,lang]) => `<div class="card hov" style="border-color:${lang.color}33;padding:12px;text-align:center;cursor:pointer" onclick="langSelected='${key}';langSection=null;nav('languages')">
          <div style="font-size:26px;margin-bottom:5px">${lang.emoji}</div>
          <div style="font-size:13px;font-weight:800">${lang.name}</div>
          <div style="font-size:12px;color:${lang.color};margin-top:2px">${lang.nativeName}</div>
        </div>`).join('')}
      </div>
      <button class="btn bsm mt14" style="background:var(--purple);color:#fff" onclick="langSelected=null;nav('languages')">Explore All Languages →</button>
    </div>

    <h2 class="mb14">Practice by Provider Style</h2>
    <div class="g3 mb20">${PROVIDERS.map(p=>`<div class="card hov" style="border-color:${p.c}44" onclick="startPractice({style:'${p.s}'},'oneByOne',10)"><div style="font-size:22px;margin-bottom:6px">${p.e}</div><div style="font-weight:800;margin-bottom:3px">${p.l}</div><div class="mt xs mb10">${filterQs({style:p.s}).length} questions</div><button class="btn bsm" style="background:${p.c};color:${p.c.includes('yellow')?'#1a1200':'#fff'};font-size:11px">Practice</button></div>`).join('')}</div>

    <div class="g2"><div class="card"><strong style="color:var(--red)">❌ NOT tested in selective</strong><p class="mt sm" style="margin-top:5px">Memorised facts, curriculum content, prior subject knowledge.</p></div><div class="card" style="border-color:rgba(79,142,247,.3)"><strong style="color:var(--accent)">✅ What IS tested</strong><p class="mt sm" style="margin-top:5px">HOW you reason — patterns, inference, problem-solving, argument quality, writing.</p></div></div>
  </div>`;
}

// ── TIPS & TECHNIQUES ────────────────────────────────────────────────────────
let tipPage = null; // null = overview, string = page id

function renderTips() {
  if (tipPage && TIPS_DATA.pages[tipPage]) return renderTipPage(tipPage);
  return renderTipsOverview();
}

function renderTipsOverview() {
  const cards = TIPS_DATA.overview;
  return `<div class="page">
    ${profileBar()}
    <div class="hero" style="background:linear-gradient(135deg,#0d1a18,#0d0f1a);border-color:rgba(79,216,247,.25)">
      <div class="mb8"><span class="tag tt">💡 TIPS & TECHNIQUES · SELECTIVE EXAM PREP</span></div>
      <h1>Study Smarter, <span class="grad">Not Harder</span></h1>
      <p class="mt sm" style="max-width:540px;margin:10px 0 0;line-height:1.75">
        Everything you need to know about how to prepare — written for you, not your parents.
        Click any topic to read the full guide with worked examples and tricks.
      </p>
    </div>

    <div class="g2 mb24" style="margin-top:22px">
      ${cards.map(c => `
        <div class="card hov" style="border-color:${c.color}44;cursor:pointer" onclick="tipPage='${c.id}';render()">
          <div class="fc gap12 mb8">
            <span style="font-size:32px">${c.emoji}</span>
            <div>
              <h3 style="margin-bottom:4px">${c.title}</h3>
              <div class="xs mt" style="font-style:italic;line-height:1.5">"${c.tagline}"</div>
            </div>
          </div>
          <p class="sm mt" style="line-height:1.6">${c.preview}</p>
          <button class="btn bsm mt14" style="background:${c.color};color:${c.color.includes('yellow')?'#1a1200':'#fff'}">Read Guide →</button>
        </div>
      `).join('')}
    </div>

    <div class="card" style="border-color:rgba(79,216,247,.3);padding:22px">
      <div class="fc gap12 mb14">
        <span style="font-size:28px">🎯</span>
        <div><h3>How to use these tips</h3><p class="mt sm" style="margin-top:4px">Read a guide, then immediately try questions in that area. Tips without practice don't stick.</p></div>
      </div>
      <div class="fc gap8 wrap">
        <button class="btn ba bsm" onclick="startPractice({},'oneByOne',10)">✏️ Practice Now</button>
        <button class="btn bm bsm" onclick="nav('selective')">🏆 Selective Prep</button>
        <button class="btn bm bsm" onclick="nav('exams')">📝 Mock Exam</button>
      </div>
    </div>
  </div>`;
}

function renderTipPage(id) {
  const page = TIPS_DATA.pages[id];
  const overview = TIPS_DATA.overview.find(c => c.id === id);
  if (!page) return renderTipsOverview();

  // Related practice suggestions per section
  const practiceMap = {
    reading: {section:'vic_reading', label:'Reading Questions'},
    maths:   {section:'vic_maths',   label:'Maths Questions'},
    verbal:  {section:'vic_verbal',  label:'Verbal Reasoning'},
    quant:   {section:'vic_quant',   label:'Quantitative Questions'},
    writing: {section:'vic_writing', label:'Writing Practice'},
    examday: null,
    habits:  null,
    mindset: null,
  };
  const practice = practiceMap[id];

  return `<div class="page">
    <button class="btn bm bsm mb20" onclick="tipPage=null;render()">← All Tips</button>

    <div style="background:${page.color}11;border:2px solid ${page.color}33;border-radius:var(--r);padding:26px 28px;margin-bottom:24px">
      <div class="fc gap12 mb12">
        <span style="font-size:40px">${page.emoji}</span>
        <div>
          <h1 style="margin-bottom:4px">${page.title}</h1>
          ${overview ? `<div class="sm" style="color:${page.color};font-style:italic">"${overview.tagline}"</div>` : ''}
        </div>
      </div>
      <p class="sm" style="line-height:1.8;max-width:640px">${page.intro}</p>
    </div>

    ${page.sections.map((sec, i) => `
      <div class="card mb14" style="padding:22px 24px">
        <h2 style="margin-bottom:16px;font-size:16px">${sec.heading}</h2>
        <div class="sm" style="line-height:1.95;white-space:pre-line;color:var(--text)">${sec.content}</div>
        ${sec.tip ? `<div style="margin-top:16px;padding:12px 16px;background:rgba(247,200,79,.07);border-left:3px solid var(--yellow);border-radius:0 8px 8px 0;font-size:13px;line-height:1.7;color:var(--text)">${sec.tip}</div>` : ''}
      </div>
    `).join('')}

    <!-- Quick summary box -->
    <div class="card mb20" style="border-color:${page.color}44;padding:20px">
      <h3 class="mb12">⚡ Quick Summary — ${page.title}</h3>
      <ul class="sm" style="padding-left:18px;line-height:2.1;color:var(--text)">
        ${page.sections.map(s => {
          // Extract the key tip from each section's tip field
          const tipText = s.tip ? s.tip.replace('💡 Tip: ','') : s.heading.replace(/^[^\s]+ /,'');
          return `<li>${tipText}</li>`;
        }).join('')}
      </ul>
    </div>

    <!-- Navigation between pages -->
    <div class="g2 mb20">
      <div>
        ${(() => {
          const ids = TIPS_DATA.overview.map(c=>c.id);
          const idx = ids.indexOf(id);
          if (idx > 0) {
            const prev = TIPS_DATA.overview[idx-1];
            return `<div class="card hov" onclick="tipPage='${prev.id}';render();window.scrollTo(0,0)">
              <div class="xs mt mb4">← Previous</div>
              <div style="font-weight:700">${prev.emoji} ${prev.title}</div>
            </div>`;
          }
          return '<div></div>';
        })()}
      </div>
      <div>
        ${(() => {
          const ids = TIPS_DATA.overview.map(c=>c.id);
          const idx = ids.indexOf(id);
          if (idx < ids.length - 1) {
            const next = TIPS_DATA.overview[idx+1];
            return `<div class="card hov" style="text-align:right" onclick="tipPage='${next.id}';render();window.scrollTo(0,0)">
              <div class="xs mt mb4">Next →</div>
              <div style="font-weight:700">${next.emoji} ${next.title}</div>
            </div>`;
          }
          return '<div></div>';
        })()}
      </div>
    </div>

    <!-- Practice CTA -->
    ${practice ? `<div class="card" style="border-color:rgba(79,142,247,.3);padding:22px;text-align:center">
      <div style="font-size:32px;margin-bottom:8px">✏️</div>
      <h3>Put it into practice</h3>
      <p class="mt sm mt14 mb14">Reading about techniques only gets you so far — practise them now while they're fresh.</p>
      <div class="fc gap8 wrap" style="justify-content:center">
        <button class="btn ba" onclick="startPractice({section:'${practice.section}'},'oneByOne',10)">Practice ${practice.label} →</button>
        <button class="btn bm" onclick="nav('exams')">📝 Try a Timed Exam</button>
      </div>
    </div>` : `<div class="card" style="border-color:rgba(79,142,247,.3);padding:22px;text-align:center">
      <div style="font-size:32px;margin-bottom:8px">🚀</div>
      <h3>Ready to apply these strategies?</h3>
      <div class="fc gap8 wrap mt14" style="justify-content:center">
        <button class="btn ba" onclick="startPractice({},'oneByOne',12)">✏️ Start Practising</button>
        <button class="btn bm" onclick="nav('exams')">📝 Mock Exam</button>
        <button class="btn bm" onclick="tipPage=null;render()">← More Tips</button>
      </div>
    </div>`}
  </div>`;
}

// ── LANGUAGES ─────────────────────────────────────────────────────────────────
function renderLanguages() {

  // ── LANGUAGE OVERVIEW ────────────────────────────────────────────────────
  if (!langSelected) {
    const langs = Object.entries(LANGUAGES);
    return `<div class="page">
      ${profileBar()}
      <div class="hero" style="background:linear-gradient(135deg,#1a0d2a,#0d1a1a);border-color:rgba(155,89,247,.3)">
        <div class="mb8"><span class="tag tpu">🗣️ LANGUAGE ZONE · TAMIL · TELUGU · MALAYALAM · HINDI</span></div>
        <h1>🗣️ <span class="grad">Indian Language Zone</span></h1>
        <p class="mt sm" style="max-width:560px;margin:10px 0 0;line-height:1.8">
          Explore four beautiful Indian languages — script, numbers, words, culture and riddles.
          No previous knowledge needed. Each activity teaches you something new!
        </p>
      </div>

      <div class="g2 mt20 mb24">
        ${langs.map(([key, lang]) => {
          const totalActs = lang.sections.reduce((s,sec) => s + sec.activities.length, 0);
          const doneActs  = lang.sections.reduce((s,sec) =>
            s + sec.activities.filter(a => langAnswered[key+'_'+a.id] !== undefined).length, 0);
          const pct = totalActs ? Math.round(doneActs/totalActs*100) : 0;
          return `<div class="card hov" style="border-color:${lang.color}44;cursor:pointer" onclick="langSelected='${key}';langSection=null;render()">
            <div class="fc gap12 mb10">
              <span style="font-size:40px">${lang.emoji}</span>
              <div style="flex:1">
                <h2 style="margin-bottom:2px">${lang.name}</h2>
                <div style="font-size:20px;color:${lang.color};font-weight:700">${lang.nativeName}</div>
              </div>
              <div style="text-align:right;flex-shrink:0">
                <div style="font-weight:800;color:${lang.color};font-size:18px">${pct}%</div>
                <div class="xs mt">${doneActs}/${totalActs} done</div>
              </div>
            </div>
            <div class="pbar mb12"><div class="pfill" style="width:${pct}%;background:${lang.color}"></div></div>
            <p class="sm mt" style="line-height:1.65;margin-bottom:12px">${lang.fact}</p>
            <div class="fc gap8 wrap mb12">
              ${lang.sections.map(s => `<span class="tag tm xs">${s.emoji} ${s.title}</span>`).join('')}
            </div>
            <button class="btn bsm" style="background:${lang.color};color:${lang.color.includes('green')?'#0a1a0a':'#fff'}">Start Learning ${lang.name} →</button>
          </div>`;
        }).join('')}
      </div>

      <div class="card" style="border-color:rgba(79,216,247,.3);padding:22px">
        <h3 class="mb10">🌏 About These Languages</h3>
        <div class="g2">
          <div class="sm" style="line-height:1.9">
            <strong style="color:var(--orange)">Tamil (தமிழ்)</strong> — Over 2,000 years old, spoken across Tamil Nadu, Sri Lanka, Singapore and Australia.<br/>
            <strong style="color:var(--teal)">Telugu (తెలుగు)</strong> — "Italian of the East", spoken in Andhra Pradesh and Telangana.
          </div>
          <div class="sm" style="line-height:1.9">
            <strong style="color:var(--green)">Malayalam (മലയാളം)</strong> — The palindrome language, spoken in Kerala.<br/>
            <strong style="color:var(--purple)">Hindi (हिन्दी)</strong> — Most spoken language in India; Devanagari script also used for Sanskrit.
          </div>
        </div>
      </div>
    </div>`;
  }

  const lang = LANGUAGES[langSelected];
  if (!lang) { langSelected = null; return renderLanguages(); }

  // ── SECTION PICKER ───────────────────────────────────────────────────────
  if (!langSection) {
    return `<div class="page">
      <button class="btn bm bsm mb20" onclick="langSelected=null;render()">← All Languages</button>
      <div class="fc gap14 mb20">
        <span style="font-size:44px">${lang.emoji}</span>
        <div>
          <h1 style="margin-bottom:4px">${lang.name}</h1>
          <div style="font-size:22px;color:${lang.color};font-weight:700">${lang.nativeName}</div>
          <p class="mt sm" style="margin-top:6px;max-width:520px">${lang.fact}</p>
        </div>
      </div>
      <h2 class="mb14">Choose a section</h2>
      <div class="g2">
        ${lang.sections.map(sec => {
          const done = sec.activities.filter(a => langAnswered[langSelected+'_'+a.id] !== undefined).length;
          const total = sec.activities.length;
          const allDone = done === total;
          return `<div class="card hov" style="border-color:${allDone?'rgba(61,214,140,.5)':lang.color+'33'}" onclick="langSection='${sec.id}';render()">
            <div style="font-size:32px;margin-bottom:8px">${sec.emoji}</div>
            <h3 style="margin-bottom:4px">${sec.title}</h3>
            <p class="mt sm mb12" style="line-height:1.5">${sec.description}</p>
            <div class="pbar mb8"><div class="pfill" style="width:${Math.round(done/total*100)}%;background:${lang.color}"></div></div>
            <div class="fc jsb">
              <span class="xs mt">${done}/${total} activities</span>
              ${allDone ? '<span class="tag tg xs">✅ Complete!</span>' : ''}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }

  // ── ACTIVITIES IN A SECTION ───────────────────────────────────────────────
  const sec = lang.sections.find(s => s.id === langSection);
  if (!sec) { langSection = null; return renderLanguages(); }

  const doneInSec = sec.activities.filter(a => langAnswered[langSelected+'_'+a.id] !== undefined);
  const correctInSec = doneInSec.filter(a => langAnswered[langSelected+'_'+a.id] === a.answer);
  const allDone = doneInSec.length === sec.activities.length;

  return `<div class="page">
    <div class="fc gap8 mb14 wrap">
      <button class="btn bm bsm" onclick="langSection=null;render()">← ${lang.name}</button>
    </div>
    <div class="fc gap12 mb20">
      <span style="font-size:30px">${sec.emoji}</span>
      <div>
        <h2 style="margin-bottom:2px">${sec.title}</h2>
        <div style="font-size:16px;color:${lang.color};font-weight:700">${lang.name} · ${lang.nativeName}</div>
      </div>
    </div>

    ${allDone ? `<div class="sbox pass mb20">
      <div style="font-size:32px;margin-bottom:8px">${correctInSec.length === sec.activities.length ? '🌟' : '🎉'}</div>
      <div style="font-weight:900;font-size:22px;color:var(--green)">${correctInSec.length}/${sec.activities.length} Correct!</div>
      <div class="mt sm mt14">Section complete! ${correctInSec.length === sec.activities.length ? 'Perfect score!' : 'Well done!'}</div>
      <div class="fc gap8 mt14" style="justify-content:center">
        <button class="btn bg bsm" onclick="langSection=null;render()">← Try Another Section</button>
      </div>
    </div>` : ''}

    ${sec.activities.map(item => {
      const key = langSelected + '_' + item.id;
      const answered = langAnswered[key];
      const showExp = langShowExp[key];
      const isCorrect = answered !== undefined && answered === item.answer;
      const isWrong = answered !== undefined && answered !== item.answer;

      const opts = item.options.map((opt, oi) => {
        let style = 'background:#090b18;border:1px solid var(--border);border-radius:9px;padding:11px 16px;cursor:pointer;color:var(--text);font-size:14px;display:flex;align-items:center;gap:10px;margin-bottom:8px;transition:all .15s;line-height:1.5;';
        if (answered !== undefined) {
          style += 'cursor:default;';
          if (oi === item.answer) style += `border-color:var(--green);background:rgba(61,214,140,.1);color:var(--green);font-weight:700;`;
          else if (answered === oi) style += 'border-color:var(--red);background:rgba(247,79,79,.08);color:var(--red);';
        }
        const tick = answered !== undefined && oi === item.answer ? '<span style="margin-left:auto;font-weight:900">✓</span>'
          : answered === oi && oi !== item.answer ? '<span style="margin-left:auto">✗</span>' : '';
        const click = answered === undefined ? `onclick="langAnswer('${key}',${oi},${item.answer},'${langSelected}')"` : '';
        return `<div style="${style}" ${click}><span style="font-weight:700;opacity:.4;min-width:20px">${'ABCD'[oi]}.</span><span style="flex:1">${opt}</span>${tick}</div>`;
      }).join('');

      const expHtml = answered !== undefined && item.exp
        ? `<div style="margin-top:12px;padding:14px 18px;background:#12152a;border-radius:10px;font-size:13px;line-height:1.9;white-space:pre-line;color:var(--text)">${item.exp}</div>` : '';

      const hintHtml = item.hint && answered === undefined
        ? `<button class="btn bm bsm mt10" onclick="langShowExp['${key}_h']=!langShowExp['${key}_h'];render()" style="font-size:11px">💡 Hint</button>
           ${langShowExp[key+'_h'] ? `<div class="hint-box mt10">${item.hint}</div>` : ''}` : '';

      return `<div class="card mb14" style="border-color:${isCorrect?'rgba(61,214,140,.4)':isWrong?'rgba(247,79,79,.35)':'var(--border)'}">
        <div class="fc jsb mb10 wrap gap8">
          <h3 style="font-size:15px">${item.title}</h3>
          <span class="tag ty xs">+${item.xp} XP</span>
        </div>
        <div style="font-size:14px;font-weight:600;line-height:1.75;margin-bottom:14px;white-space:pre-line">${item.q}</div>
        ${opts}
        ${hintHtml}
        ${expHtml}
        ${answered !== undefined ? `<div class="sm mt12" style="color:${isCorrect?'var(--green)':'var(--orange)'};">${isCorrect ? '🌟 Great answer!' : '💡 Have a read of the explanation above — it\'s interesting!'}</div>` : ''}
      </div>`;
    }).join('')}

    ${!allDone ? `<div class="card tc mt14" style="padding:20px;border-style:dashed">
      <p class="mt sm">Complete all ${sec.activities.length} activities in this section to earn your reward! ⭐</p>
    </div>` : ''}
  </div>`;
}

function langAnswer(key, chosen, correct_answer, langKey) {
  langAnswered[key] = chosen;
  langShowExp[key] = true;
  if (chosen === correct_answer && currentUser) {
    Profiles.recordFun(currentUser, 'brain'); // reuse brain XP category
  }
  render();
}

// ── BOOT ──────────────────────────────────────────────────────────────────────
// Try to restore last used profile
const lastUser = Profiles.getProfileList()[0];
if(lastUser) currentUser = lastUser.nickname;
nav('home');
