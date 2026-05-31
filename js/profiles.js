// profiles.js — Multi-user profile system (no personal data required)
// ─────────────────────────────────────────────────────────────────────────────

const Profiles = (() => {
  const PROFILES_KEY = 'ss_profiles_v1';
  const DATA_PREFIX  = 'ss_data_v1_';

  // ── LEVELS ──────────────────────────────────────────────────────────────────
  const LEVELS = [
    {min:0,    max:99,   level:1,  title:'🌱 Cadet',      color:'#7b80a8'},
    {min:100,  max:249,  level:2,  title:'⭐ Rookie',      color:'#4fd8f7'},
    {min:250,  max:499,  level:3,  title:'📚 Scholar',    color:'#4f8ef7'},
    {min:500,  max:849,  level:4,  title:'🔢 Explorer',   color:'#3dd68c'},
    {min:850,  max:1299, level:5,  title:'🎯 Sharpshooter',color:'#f7c84f'},
    {min:1300, max:1849, level:6,  title:'🧠 Thinker',    color:'#f7904f'},
    {min:1850, max:2499, level:7,  title:'🔥 Achiever',   color:'#f74fa0'},
    {min:2500, max:3299, level:8,  title:'💡 Strategist', color:'#9b59f7'},
    {min:3300, max:4299, level:9,  title:'🏅 Champion',   color:'#f7904f'},
    {min:4300, max:5499, level:10, title:'🎓 Scholar Pro', color:'#4fd8f7'},
    {min:5500, max:6999, level:11, title:'🌟 Star',        color:'#f7c84f'},
    {min:7000, max:8999, level:12, title:'🚀 Prodigy',     color:'#4f8ef7'},
    {min:9000, max:11499,level:13, title:'💎 Diamond',    color:'#4fd8f7'},
    {min:11500,max:14499,level:14, title:'⚡ Elite',       color:'#f7c84f'},
    {min:14500,max:17999,level:15, title:'🔮 Master',     color:'#9b59f7'},
    {min:18000,max:22499,level:16, title:'👑 Grand Master',color:'#f7c84f'},
    {min:22500,max:27999,level:17, title:'🌠 Luminary',   color:'#4fd8f7'},
    {min:28000,max:34999,level:18, title:'🏆 Legend',     color:'#f7904f'},
    {min:35000,max:44999,level:19, title:'🎆 Icon',       color:'#f74fa0'},
    {min:45000,max:Infinity,level:20,title:'🌌 Genius',   color:'#f7c84f'},
  ];

  function getLevel(xp) {
    return LEVELS.find(l => xp >= l.min && xp <= l.max) || LEVELS[LEVELS.length-1];
  }
  function getLevelProgress(xp) {
    const lv = getLevel(xp);
    if (lv.level === 20) return {pct:100, xpInLevel:xp-lv.min, xpNeeded:Infinity};
    const xpInLevel = xp - lv.min;
    const xpNeeded  = lv.max - lv.min + 1;
    return {pct: Math.min(100, Math.round(xpInLevel/xpNeeded*100)), xpInLevel, xpNeeded};
  }

  // ── ACHIEVEMENTS ────────────────────────────────────────────────────────────
  const ACHIEVEMENTS = [
    // Study achievements
    {id:'first_answer',  emoji:'🌟',label:'First Step',      desc:'Answer your first question',         cat:'study', check:d=>d.totalAnswered>=1},
    {id:'ten_correct',   emoji:'🎯',label:'Sharp Shooter',   desc:'Get 10 correct answers',             cat:'study', check:d=>d.totalCorrect>=10},
    {id:'fifty_q',       emoji:'💪',label:'Half Century',    desc:'Answer 50 questions',                cat:'study', check:d=>d.totalAnswered>=50},
    {id:'hundred_q',     emoji:'🏅',label:'Century',         desc:'Answer 100 questions',               cat:'study', check:d=>d.totalAnswered>=100},
    {id:'five_hundred_q',emoji:'🚀',label:'500 Club',        desc:'Answer 500 questions',               cat:'study', check:d=>d.totalAnswered>=500},
    {id:'perfect_exam',  emoji:'🏆',label:'Perfect Score',   desc:'Score 100% in an exam',              cat:'study', check:d=>d.sessions.some(s=>s.type==='exam'&&s.pct===100)},
    {id:'five_exams',    emoji:'📝',label:'Exam Veteran',    desc:'Complete 5 exams',                   cat:'study', check:d=>d.sessions.filter(s=>s.type==='exam').length>=5},
    {id:'all_sections',  emoji:'🗺️',label:'Explorer',        desc:'Try all 7 exam sections',            cat:'study', check:d=>Object.keys(d.sectionScores||{}).length>=7},
    {id:'all_styles',    emoji:'📚',label:'Polymath',        desc:'Try all 9 provider styles',          cat:'study', check:d=>Object.keys(d.styleScores||{}).length>=9},
    {id:'hard_twenty',   emoji:'🧗',label:'Hard Mode',       desc:'Answer 20 hard questions correctly', cat:'study', check:d=>(d.difficultyScores?.hard?.correct||0)>=20},
    {id:'writing_three', emoji:'✍️', label:'Storyteller',    desc:'Complete 3 writing tasks',           cat:'study', check:d=>(d.writingCount||0)>=3},
    {id:'study_notes',   emoji:'📖',label:'Note Taker',      desc:'Generate 5 sets of study notes',    cat:'study', check:d=>(d.studyCount||0)>=5},
    {id:'tutor_five',    emoji:'🤖',label:'Ask Away',        desc:'Ask the AI Tutor 5 questions',       cat:'study', check:d=>(d.tutorCount||0)>=5},
    // Streak achievements
    {id:'streak_3',  emoji:'🔥',  label:'3-Day Streak',    desc:'Study 3 days in a row',   cat:'streak', check:d=>(d.streak||0)>=3},
    {id:'streak_7',  emoji:'🔥🔥',label:'Week Warrior',    desc:'Study 7 days in a row',   cat:'streak', check:d=>(d.streak||0)>=7},
    {id:'streak_14', emoji:'🌟', label:'Fortnight Star',   desc:'Study 14 days in a row',  cat:'streak', check:d=>(d.streak||0)>=14},
    {id:'streak_30', emoji:'🏆', label:'Month Master',     desc:'Study 30 days in a row',  cat:'streak', check:d=>(d.streak||0)>=30},
    // Fun zone achievements
    {id:'fun_first',   emoji:'🎮',label:'Puzzle Starter',  desc:'Solve your first puzzle',             cat:'fun', check:d=>(d.funSolved||0)>=1},
    {id:'fun_five',    emoji:'🧩',label:'Puzzle Fan',      desc:'Solve 5 Fun Zone puzzles',            cat:'fun', check:d=>(d.funSolved||0)>=5},
    {id:'fun_ten',     emoji:'🎯',label:'Puzzle Master',   desc:'Solve 10 Fun Zone puzzles',           cat:'fun', check:d=>(d.funSolved||0)>=10},
    {id:'fun_all_math',emoji:'🔢',label:'Maths Wizard',   desc:'Complete all Maths Puzzles',          cat:'fun', check:d=>(d.funMathSolved||0)>=12},
    {id:'fun_all_eng', emoji:'📖',label:'Word Smith',      desc:'Complete all English Games',          cat:'fun', check:d=>(d.funEngSolved||0)>=12},
    {id:'fun_all_brain',emoji:'🧠',label:'Brain Power',   desc:'Complete all Brain Gym challenges',   cat:'fun', check:d=>(d.funBrainSolved||0)>=8},
    {id:'quiz_ace',    emoji:'🌠',label:'Quiz Ace',        desc:'Score 100% in any General Knowledge quiz', cat:'fun', check:d=>(d.perfectQuizzes||0)>=1},
    // XP milestones
    {id:'xp_500',  emoji:'⚡',label:'500 XP',    desc:'Earn 500 XP',   cat:'xp', check:d=>(d.xp||0)>=500},
    {id:'xp_1000', emoji:'💎',label:'1000 XP',   desc:'Earn 1000 XP',  cat:'xp', check:d=>(d.xp||0)>=1000},
    {id:'xp_5000', emoji:'🌟',label:'5000 XP',   desc:'Earn 5000 XP',  cat:'xp', check:d=>(d.xp||0)>=5000},
    {id:'xp_10000',emoji:'👑',label:'10000 XP',  desc:'Earn 10000 XP', cat:'xp', check:d=>(d.xp||0)>=10000},
  ];

  // ── STORAGE ──────────────────────────────────────────────────────────────────
  function getProfileList() {
    try { return JSON.parse(localStorage.getItem(PROFILES_KEY)||'[]'); } catch { return []; }
  }
  function saveProfileList(list) {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(list));
  }

  function defaultData(nickname, avatar) {
    return {
      nickname, avatar,
      created: new Date().toISOString(),
      xp: 0,
      totalAnswered: 0,
      totalCorrect: 0,
      streak: 0,
      bestStreak: 0,
      lastActiveDate: null,
      sessions: [],
      topicScores: {},
      sectionScores: {},
      styleScores: {},
      difficultyScores: {},
      achievements: [],
      funSolved: 0,
      funMathSolved: 0,
      funEngSolved: 0,
      funBrainSolved: 0,
      writingCount: 0,
      studyCount: 0,
      tutorCount: 0,
      perfectQuizzes: 0,
      recentStars: [],   // [{date,count,label}] for the star display
    };
  }

  function loadData(nickname) {
    try {
      const raw = localStorage.getItem(DATA_PREFIX + nickname);
      return raw ? {...defaultData(nickname,'🎓'), ...JSON.parse(raw)} : defaultData(nickname,'🎓');
    } catch { return defaultData(nickname,'🎓'); }
  }

  function saveData(data) {
    localStorage.setItem(DATA_PREFIX + data.nickname, JSON.stringify(data));
  }

  // ── STREAK ───────────────────────────────────────────────────────────────────
  function updateStreak(data) {
    const today = new Date().toDateString();
    if (data.lastActiveDate === today) return;
    const yesterday = new Date(Date.now()-86400000).toDateString();
    data.streak = data.lastActiveDate === yesterday ? (data.streak||0)+1 : 1;
    if (data.streak > (data.bestStreak||0)) data.bestStreak = data.streak;
    data.lastActiveDate = today;
  }

  // ── ACHIEVEMENTS CHECK ───────────────────────────────────────────────────────
  function checkAchievements(data, onNew) {
    const earned = new Set(data.achievements||[]);
    const newlyEarned = [];
    ACHIEVEMENTS.forEach(a => {
      if (!earned.has(a.id) && a.check(data)) {
        data.achievements.push(a.id);
        earned.add(a.id);
        newlyEarned.push(a);
      }
    });
    if (newlyEarned.length && onNew) newlyEarned.forEach(a => onNew(a));
    return newlyEarned;
  }

  // ── XP AWARD ─────────────────────────────────────────────────────────────────
  function awardXP(data, amount, label) {
    const oldLevel = getLevel(data.xp||0).level;
    data.xp = (data.xp||0) + amount;
    const newLevel = getLevel(data.xp).level;
    if (newLevel > oldLevel) {
      const lv = getLevel(data.xp);
      showAchievementToast({emoji:'🎉', label:`Level Up! → ${lv.title}`, desc:`You're now Level ${lv.level}`});
    }
  }

  // ── RECORD ANSWER ────────────────────────────────────────────────────────────
  function recordAnswer(nickname, q, correct) {
    const data = loadData(nickname);
    updateStreak(data);
    data.totalAnswered = (data.totalAnswered||0)+1;
    if (correct) data.totalCorrect = (data.totalCorrect||0)+1;

    const xpMap = {easy:10, medium:20, hard:35};
    if (correct) awardXP(data, xpMap[q.difficulty]||10, q.topic);

    ['topic','section','style','difficulty'].forEach(k => {
      if (!q[k]) return;
      const key = k+'Scores';
      if (!data[key]) data[key]={};
      if (!data[key][q[k]]) data[key][q[k]]={correct:0,total:0};
      data[key][q[k]].total++;
      if (correct) data[key][q[k]].correct++;
    });

    checkAchievements(data, showAchievementToast);
    saveData(data);
    updateProfileListEntry(data);
  }

  // ── RECORD SESSION ───────────────────────────────────────────────────────────
  function recordSession(nickname, questions, answers, mode, examDef) {
    const data = loadData(nickname);
    updateStreak(data);
    const correct = answers.filter((a,i)=>a===questions[i]?.answer).length;
    const pct = Math.round(correct/questions.length*100);
    const stars = pct>=90?3:pct>=70?2:pct>=50?1:0;
    const type = examDef ? 'exam' : 'practice';
    const session = {
      id: Date.now(),
      date: new Date().toISOString(),
      type, mode,
      label: examDef ? examDef.title : `Practice — ${mode==='oneByOne'?'One by One':'Batch'}`,
      correct, total:questions.length, pct, stars,
    };
    data.sessions = [session, ...(data.sessions||[])].slice(0,100);
    if (stars>0) data.recentStars = [{date:new Date().toISOString(),count:stars,label:session.label}, ...(data.recentStars||[])].slice(0,20);

    // XP for session bonus
    if (pct===100) { awardXP(data, 50, 'Perfect session bonus!'); if(examDef) data.perfectQuizzes=(data.perfectQuizzes||0)+1; }
    else if (pct>=80) awardXP(data, 20, 'Great session!');

    // Update totals for exam type
    if (examDef) {
      data.totalAnswered=(data.totalAnswered||0)+questions.length;
      data.totalCorrect=(data.totalCorrect||0)+correct;
    }
    checkAchievements(data, showAchievementToast);
    saveData(data);
    updateProfileListEntry(data);
    return {stars, pct, session};
  }

  function recordWriting(nickname) { const d=loadData(nickname); d.writingCount=(d.writingCount||0)+1; awardXP(d,30,'Writing task'); checkAchievements(d,showAchievementToast); saveData(d); }
  function recordStudy(nickname)   { const d=loadData(nickname); d.studyCount=(d.studyCount||0)+1;   awardXP(d,15,'Study notes'); checkAchievements(d,showAchievementToast); saveData(d); }
  function recordTutor(nickname)   { const d=loadData(nickname); d.tutorCount=(d.tutorCount||0)+1;   awardXP(d,5,'Tutor question');  checkAchievements(d,showAchievementToast); saveData(d); }

  function recordFun(nickname, zone) {
    const d = loadData(nickname);
    d.funSolved=(d.funSolved||0)+1;
    const xpMap={math:15,english:15,brain:20,gk:20};
    awardXP(d, xpMap[zone]||15, 'Fun Zone');
    const zoneKey={math:'funMathSolved',english:'funEngSolved',brain:'funBrainSolved',gk:'funBrainSolved'}[zone]||'funMathSolved';
    d[zoneKey]=(d[zoneKey]||0)+1;
    checkAchievements(d,showAchievementToast);
    saveData(d); updateProfileListEntry(d);
  }

  // ── PROFILE LIST ─────────────────────────────────────────────────────────────
  function updateProfileListEntry(data) {
    const list = getProfileList();
    const idx = list.findIndex(p=>p.nickname===data.nickname);
    const entry = {nickname:data.nickname, avatar:data.avatar, xp:data.xp||0, level:getLevel(data.xp||0).level, lastActive:data.lastActiveDate};
    if (idx>=0) list[idx]=entry; else list.push(entry);
    saveProfileList(list);
  }

  function createProfile(nickname, avatar) {
    if (!nickname.trim()) return {error:'Please enter a nickname.'};
    if (nickname.length<2) return {error:'Nickname must be at least 2 characters.'};
    if (nickname.length>20) return {error:'Nickname must be 20 characters or less.'};
    const list = getProfileList();
    if (list.find(p=>p.nickname.toLowerCase()===nickname.toLowerCase())) return {error:'That nickname is already taken on this device.'};
    const data = defaultData(nickname.trim(), avatar||'🎓');
    saveData(data);
    updateProfileListEntry(data);
    return {success:true, data};
  }

  function deleteProfile(nickname) {
    localStorage.removeItem(DATA_PREFIX + nickname);
    const list = getProfileList().filter(p=>p.nickname!==nickname);
    saveProfileList(list);
  }

  function getStats(nickname) {
    const d = loadData(nickname);
    const lv = getLevel(d.xp||0);
    const lvProg = getLevelProgress(d.xp||0);
    const acc = d.totalAnswered>0 ? Math.round(d.totalCorrect/d.totalAnswered*100) : 0;
    const earned = ACHIEVEMENTS.filter(a=>(d.achievements||[]).includes(a.id));
    const weakTopics = Object.entries(d.topicScores||{}).filter(([,s])=>s.total>=3&&s.correct/s.total<0.6).sort((a,b)=>a[1].correct/a[1].total-b[1].correct/b[1].total).slice(0,5).map(([t,s])=>({topic:t,pct:Math.round(s.correct/s.total*100),total:s.total}));
    const strongTopics = Object.entries(d.topicScores||{}).filter(([,s])=>s.total>=3&&s.correct/s.total>=0.75).sort((a,b)=>b[1].correct/b[1].total-a[1].correct/a[1].total).slice(0,5).map(([t,s])=>({topic:t,pct:Math.round(s.correct/s.total*100),total:s.total}));
    const sectionPerf = Object.entries(d.sectionScores||{}).map(([sec,s])=>({sec,pct:Math.round(s.correct/s.total*100),total:s.total}));
    const stylePerf = Object.entries(d.styleScores||{}).map(([style,s])=>({style,pct:Math.round(s.correct/s.total*100),total:s.total}));
    const recentActivity = Array.from({length:14},(_,i)=>{
      const date=new Date(Date.now()-i*86400000).toDateString();
      const daySessions=(d.sessions||[]).filter(s=>new Date(s.date).toDateString()===date);
      const answered=daySessions.reduce((sum,s)=>sum+s.total,0);
      const correct=daySessions.reduce((sum,s)=>sum+s.correct,0);
      return{date,answered,correct,pct:answered?Math.round(correct/answered*100):null};
    }).reverse();
    return {
      ...d, lv, lvProg, acc,
      earnedAchievements:earned, allAchievements:ACHIEVEMENTS,
      weakTopics, strongTopics, sectionPerf, stylePerf, recentActivity,
      totalExams:(d.sessions||[]).filter(s=>s.type==='exam').length,
      totalStars:(d.recentStars||[]).reduce((sum,s)=>sum+s.count,0),
    };
  }

  // ── TOAST ─────────────────────────────────────────────────────────────────────
  function showAchievementToast(a) {
    const el = document.createElement('div');
    el.className = 'achievement-toast';
    el.innerHTML = `<div style="font-size:22px">${a.emoji}</div><div><div style="font-weight:800;font-size:13px">${a.label} Unlocked!</div><div style="font-size:11px;opacity:.8">${a.desc}</div></div>`;
    document.body.appendChild(el);
    setTimeout(()=>el.classList.add('show'),50);
    setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),400);},3500);
  }

  const AVATARS = ['🎓','⭐','🦁','🐯','🦊','🐼','🦄','🐉','🦅','🦋','🌟','🏆','🔮','🌈','🚀','🎮','📚','🎯','🧠','⚡','🔥','💎','🎸','🌸','🦈','🦉','🐬','🌺','🎩','🦸'];

  return {
    getProfileList, createProfile, deleteProfile,
    loadData, saveData, getStats,
    recordAnswer, recordSession, recordWriting, recordStudy, recordTutor, recordFun,
    LEVELS, ACHIEVEMENTS, AVATARS, getLevel, getLevelProgress,
    showAchievementToast,
  };
})();
