# StudySpark — Complete Project Log & Continuation Guide
**Last Updated:** June 21, 2026 · **Version:** v400 · **Total Questions:** 44,687

---

## 1. PROJECT OVERVIEW

StudySpark is an Australian Selective Exam Preparation Portal for students Grades 4–10, built as a single-page static HTML/CSS/JS application with no backend. It includes VIC and NSW selective exam content, SEAL Grade 7 content, Indian language learning, mock exams, AI tutoring, and gamified profiles.

**Hosting:** Netlify (drag-drop deploy) or GitHub Pages
**Tech stack:** Vanilla HTML/CSS/JS, no frameworks, no build step
**API:** Anthropic Claude API (optional, for AI tutor feature)

---

## 2. FILE STRUCTURE

```
studyspark2/
  index.html              ← App shell, loads all scripts
  netlify.toml            ← Netlify config (SPA redirects)
  css/style.css           ← Full CSS (~20KB)
  data/
    questions.json        ← 44,687 questions (14MB, source of truth)
    funzone.js            ← Puzzles: MATH_PUZZLES(20), ENGLISH_GAMES(20), BRAIN_GYM(14), GK_QUIZZES, DAILY_PUZZLE, LITTLE_LEARNERS
    tips.js               ← TIPS_DATA for study tips
    languages.js          ← LANGUAGES data (Tamil/Telugu/Malayalam/Hindi/Kannada)
  js/
    profiles.js           ← Profiles object: multi-user, XP, 20 levels, achievements
    questions.js          ← const QUESTIONS array (regenerated from questions.json)
    app.js                ← Full application logic (~1750 lines)
    history.js            ← History tracking object
```

**Script load order (critical):** `funzone.js → tips.js → languages.js → profiles.js → questions.js → app.js`

---

## 3. QUESTION BANK — 44,687 QUESTIONS

### By Section
| Section | Count | Description |
|---------|-------|-------------|
| vic_maths | 17,877 | VIC Mathematics |
| nsw_thinking | 9,681 | NSW Thinking Skills |
| vic_verbal | 6,000 | VIC Verbal Reasoning |
| vic_quant | 4,151 | VIC Quantitative Reasoning |
| nsw_maths | 3,628 | NSW Mathematics |
| vic_reading | 2,107 | VIC Reading Comprehension |
| nsw_reading | 1,243 | NSW Reading Comprehension |

### By Difficulty
- Easy: 2,089 | Medium: 14,355 | Hard: 28,243

### By Style (Copyright-Safe — NO academy names)
| Style Key | Display Label | Count |
|-----------|--------------|-------|
| seal | SEAL | 8,935 |
| standard | Standard | 3,670 |
| logic | Logic | 3,403 |
| eshs | E/SHS Style | 3,366 |
| reading | Reading | 3,244 |
| singapore | Singapore | 3,238 |
| assessment | Assessment | 3,188 |
| tutorial | Tutorial | 3,153 |
| advanced | Advanced | 3,126 |
| scholarship | Scholarship | 3,118 |
| academic | Academic | 3,007 |
| language | Language | 2,973 |
| opportunity | OC Style | 266 |

**Style Rename History:** hendersons→eshs, acer→standard, contour→logic, melbourne_tutorials→tutorial, psle→singapore, edutest→assessment, matrix→advanced, hast→scholarship, james_ann→reading, tamil_hub→language, brightminds→academic, oc→opportunity

### Question Format
```json
{
  "id": "unique_id",
  "state": "VIC" | "NSW",
  "section": "vic_maths" | "vic_verbal" | "vic_reading" | "vic_quant" | "nsw_thinking" | "nsw_maths" | "nsw_reading",
  "grade": "selective" | "7" | "5" | "4",
  "topic": "Algebra" | "Geometry" | "Word Meanings" | etc.,
  "difficulty": "easy" | "medium" | "hard",
  "style": "seal" | "standard" | "logic" | etc.,
  "q": "Question text",
  "options": ["A", "B", "C", "D"],
  "answer": 0-3 (index of correct option),
  "exp": "Explanation of how answer is arrived at",
  "hint": "Optional hint text"
}
```

### Content Coverage
- **Maths:** Algebra (linear/quadratic), factorisation, indices, surds, logs, geometry (circles, triangles, Pythagoras, volumes, SA, polygons, angles), probability (C(n,r), dice, cards), statistics (mean/median/mode, variance, IQR), percentage, measurement, trig exact values, coordinate geometry
- **Verbal:** 150+ vocabulary words with synonym/antonym pairs, 30+ analogy patterns, classification/odd-one-out, sentence completion
- **Reading:** 20+ literary devices (metaphor through stream of consciousness), grammar, inference, author's craft, persuasive techniques
- **Quant:** Number sequences (arithmetic, geometric, Fibonacci, squares, cubes), triangular numbers, handshake problems, diagonal counting, Pascal's triangle
- **Indian Languages:** Tamil, Hindi, Telugu, Malayalam, Kannada, Sanskrit, Bengali, Marathi, Gujarati, Punjabi, Urdu + English loanwords
- **SEAL Grade 7:** Harder content across all sections targeting accelerated Year 7 students

---

## 4. MOCK EXAMS — 30 EXAMS (EXAM_DEFS)

### Core VIC/NSW (e1–e7)
| ID | Title | Section | Count | Duration |
|----|-------|---------|-------|----------|
| e1 | VIC – Reading | vic_reading | 25Q | 30min |
| e2 | VIC – Mathematics | vic_maths | 30Q | 30min |
| e3 | VIC – Verbal Reasoning | vic_verbal | 30Q | 30min |
| e4 | VIC – Quantitative Reasoning | vic_quant | 25Q | 30min |
| e5 | NSW – Thinking Skills | nsw_thinking | 30Q | 40min |
| e6 | NSW – Mathematical Reasoning | nsw_maths | 30Q | 40min |
| e7 | NSW – Reading | nsw_reading | 25Q | 30min |

### Full Practice (e8–e9)
| e8 | VIC Full Selective (Mixed) | ALL (VIC) | 60Q | 60min |
| e9 | NSW Full Selective (Mixed) | ALL (NSW) | 50Q | 50min |

### Style-Based (e10–e17)
| e10 | E/SHS Practice Test | ALL, style:eshs | 30Q | 30min |
| e11 | Singapore Maths Style | vic_maths, style:singapore | 25Q | 30min |
| e12 | Logic & Reasoning Test | ALL, style:logic | 25Q | 30min |
| e13 | Assessment Practice | ALL, style:assessment | 25Q | 30min |
| e14 | Advanced Practice Test | ALL, style:advanced | 25Q | 30min |
| e15 | Scholarship Test | ALL, style:scholarship | 25Q | 30min |
| e16 | Opportunity Class (Yr4-5) | ALL, style:opportunity | 25Q | 25min |
| e17 | Reading Comprehension | vic_reading, style:reading | 25Q | 30min |

### Special (e18–e25)
| e18 | Easy Confidence Builder | ALL, difficulty:easy | 20Q | 15min |
| e19 | Language & Culture Quiz | vic_verbal, style:language | 20Q | 20min |
| e20 | Academic Practice Test | ALL, style:academic | 25Q | 30min |
| e21 | Maths Sprint (Quick 10) | vic_maths | 10Q | 5min |
| e22 | Vocab Challenge (Hard) | vic_verbal, difficulty:hard | 20Q | 15min |
| e23 | Indian Languages Quiz | vic_verbal | 15Q | 10min |
| e24 | VIC Maths (Hard Only) | vic_maths, difficulty:hard | 25Q | 30min |
| e25 | NSW Thinking (Hard Only) | nsw_thinking, difficulty:hard | 25Q | 30min |

### SEAL Grade 7 (e26–e30)
| e26 | SEAL – Maths (Grade 7) | vic_maths, style:seal | 30Q | 30min |
| e27 | SEAL – Verbal (Grade 7) | vic_verbal, style:seal | 25Q | 30min |
| e28 | SEAL – Reading (Grade 7) | vic_reading, style:seal | 20Q | 25min |
| e29 | SEAL – Quantitative (Grade 7) | vic_quant, style:seal | 20Q | 25min |
| e30 | SEAL Full Mixed (Grade 7) | ALL, style:seal | 50Q | 60min |

---

## 5. APP.JS KEY ARCHITECTURE

### State Variables (line ~125-132)
```javascript
let screen='home', currentUser=null;
let exam=null, examSub=false, examTL=0, examTimer=null, examStart=null, examResult=null;
let browsePage=0, examReviewPage=0;
const PAGE_SIZE=20;
```

### Navigation
`nav(screenName)` → sets `screen` → calls `render()` → dispatches to renderer via:
```javascript
const R={home:renderHome, browse:renderBrowse, practice:renderPractice, exams:renderExams,
         examrun:renderExamRun, selective:renderSelective, tips:renderTips, study:renderStudy,
         tutor:renderTutor, funzone:renderFunZone, languages:renderLanguages, profile:renderProfile};
```

### Key Functions
- `filterQs(filters)` — Filters QUESTIONS by section/grade/topic/difficulty/style
- `paginationBar(page, totalPages, onPageFn)` — Renders page navigation controls
- `setBrowsePage(p)` / `setExamReviewPage(p)` — Pagination handlers
- `qCard(q, idx, mode, userAns, submitted, revealed, showHint)` — Renders individual question card
- `startExam(defIdx)` — Starts exam from EXAM_DEFS index
- `submitExam()` — Submits exam, records session, shows review
- `renderExamRun()` — Renders exam (during + paginated review after submission)
- `handleAnswer(mode, idx, optionIndex)` — Handles answer selection across all modes
- `getAIFeedback(q, userAns, isCorrect)` — Calls Claude API for coaching tip
- `getApiKey()` / `setApiKey()` / `hasApiKey()` — localStorage-based API key management

### Answer Review (Post-Exam Submission)
After `submitExam()`, `renderExamRun()` shows:
1. Score summary (sessionResultBlock)
2. Colour-coded question navigator (green=correct, orange=wrong, grey=skipped)
3. Paginated review (20 per page) with:
   - Each option labelled: "✅ Your answer (Correct!)" / "❌ Your answer" / "✅ Correct answer"
   - Result box (green/orange background) showing your answer vs correct answer text
   - Full explanation with `📖 Explanation:` header
   - Optional "🤖 Get AI coaching tip" button

### Profile System (profiles.js)
- `Profiles.createProfile(nickname, avatar)` — Creates user
- `Profiles.recordAnswer(user, question, isCorrect)` — Tracks per-question accuracy
- `Profiles.recordSession(user, questions, answers, mode, examDef)` — Records exam/practice sessions
- `Profiles.getStats(user)` — Returns accuracy, total attempted, streak, etc.
- `Profiles.getLevel(xp)` / `Profiles.getLevelProgress(xp)` — 20 levels from 🌱 Cadet to 🌌 Genius
- All data persists in localStorage

---

## 6. ESTABLISHED RULES

1. **NO academy/provider names** — Styles use generic labels (eshs, standard, logic, etc.). Zero references to Hendersons, Brightminds, James & Ann, Melbourne Tutorials, Tamil Hub, ACER, EduTest, Matrix, HAST in display.
2. **NO hardcoded API key** — `getApiKey()` reads from `localStorage.getItem('ss_apikey')||''`
3. **Always syntax-check** — Run `node --check js/app.js` and `node --check js/questions.js` after any changes
4. **Regenerate questions.js** — After modifying questions.json, regenerate with: `f.write('const QUESTIONS='); json.dump(qs, f, ensure_ascii=False); f.write(';\n')`
5. **Unique ID prefixes** — When adding questions programmatically, use a new prefix to avoid collisions. Used prefixes include: q, vm_, nt_, se, sl, ja, jb, jc, ex, seal, mg, mt, mv, mn, mr, mq, mk, xm, xt, xv, xn, xr, xk, xq, ym, yt, yv, yn, yr, yq, yk, zz, aa, bb, cc, dd, e, f, g, h, j, k, p, r, s, t, v, w, x, sl2, se2, se3
6. **Package output** — Always zip to `/mnt/user-data/outputs/studyspark-final.zip`
7. **Update index.html count** — Keep the "X+ questions" text in sync with actual count

---

## 7. KNOWN ISSUES & PENDING WORK

1. **~2,131 weak explanations** — Some programmatically generated questions have explanations shorter than 15 characters. Need systematic fix pass.
2. **OC style only 266 questions** — Other styles have 3,000+. Could expand.
3. **FunZone not expanded** — Still has original 20 MATH_PUZZLES, 20 ENGLISH_GAMES, 14 BRAIN_GYM from early versions.
4. **Performance** — questions.js is ~14MB. Could benefit from lazy loading, chunked loading, or IndexedDB caching.
5. **Possible duplicate STL** — There may be two STL constant definitions in app.js from successive edits. Check if issues arise.
6. **Indian Languages Quiz (e23)** — Doesn't filter by style; could be more targeted.
7. **Reading comprehension** — Most reading questions test vocabulary/devices, not passage-based comprehension. Could add actual passages.

---

## 8. HOW TO CONTINUE

### Adding More Questions
```python
import json
qs = []
n = 0
def A(st, sec, top, dif, qn, opts, ans, exp):
    global n
    qs.append({'id': f'NEW_PREFIX{n:06d}', 'state': st, 'section': sec,
               'grade': 'selective', 'topic': top, 'difficulty': dif,
               'style': 'standard',  # use copyright-safe style names
               'q': qn, 'options': list(opts), 'answer': ans, 'exp': exp, 'hint': ''})
    n += 1

# ... generate questions ...

with open('data/questions.json') as f:
    existing = json.load(f)
eids = {q['id'] for q in existing['questions']}
unique = [x for x in qs if x['id'] not in eids]
all_qs = existing['questions'] + unique
# Save both files
```

### Modifying Exam Definitions
Edit the `EXAM_DEFS` array in `js/app.js`. Each exam needs: `{id, title, section, [style], [difficulty], [state], duration, count, color}`

### Deploying
1. **Netlify:** Go to netlify.com/drop → drag the `studyspark2/` folder
2. **GitHub:** Push to repo → connect Netlify → auto-deploys

---

## 9. EVOLUTION HISTORY

| Version | Questions | Key Changes |
|---------|-----------|-------------|
| v1 | 953 | Original build |
| v27 | 1,907 | SEAL added, mismatched explanations fixed |
| v70 | 4,765 | 400% growth, Indian languages, 25 exams |
| v95 | 8,751 | All exam pools 250+, J&A reading expanded |
| v100 | 9,758 | SEAL 1,007+, 30 exams (5 SEAL added) |
| v200 | 19,564 | Doubled, pagination + answer review added |
| v300 | 39,210 | Doubled again |
| v400 | 44,687 | Academy names removed, explanations fixed, SEAL 8,935 |
