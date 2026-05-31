# 🎓 StudySpark — Australian Selective Exam Prep Portal

Free study portal for Australian students Grades 4–10.
401+ original questions across 9 provider styles. AI-powered coaching on every answer.

---

## 🚀 Hosting on Netlify (Recommended — Free)

### Option A: Drag & Drop (instant, no account needed)
1. Go to **netlify.com/drop**
2. Drag the entire `studyspark` folder onto the page
3. Done — you get a live URL like `https://amazing-name-123.netlify.app`

### Option B: GitHub + Netlify (best for updates)
1. Create a free GitHub account at github.com
2. Create a new repository called `studyspark`
3. Upload all files (or use GitHub Desktop)
4. Go to **netlify.com**, sign up with GitHub
5. Click "Add new site" → "Import an existing project" → select your repo
6. Leave build settings empty (no build command needed)
7. Click **Deploy site**
8. Every time you push to GitHub, Netlify auto-deploys 🎉

### Option C: GitHub Pages (free, no Netlify needed)
1. Create GitHub repo named `studyspark`
2. Upload all files
3. Go to repo Settings → Pages → Source: "Deploy from branch" → main → / (root)
4. Your site is live at `https://yourusername.github.io/studyspark/`

---

## 📁 Project Structure

```
studyspark/
├── index.html          ← Main HTML shell (tiny)
├── netlify.toml        ← Netlify configuration
├── css/
│   └── style.css       ← All styles
├── data/
│   ├── questions.json  ← 401 questions (update anytime)
│   └── funzone.js      ← Fun Zone puzzle data
└── js/
    ├── history.js      ← Progress tracking & history
    ├── questions.js    ← Question bank loader & helpers
    ├── practice.js     ← Practice mode
    ├── exams.js        ← Timed mock exams
    ├── selective.js    ← VIC/NSW selective prep
    ├── browse.js       ← Question browser
    ├── study.js        ← Study notes
    ├── tutor.js        ← AI Tutor
    ├── funzone.js      ← Fun Zone (puzzles & games)
    ├── home.js         ← Home screen
    └── app.js          ← Router & main controller
```

---

## 📚 Adding Questions

Questions are in `data/questions.json`. Each question looks like:

```json
{
  "id": "unique_id",
  "state": "VIC",
  "section": "vic_maths",
  "grade": "selective",
  "topic": "Algebra",
  "difficulty": "medium",
  "style": "acer",
  "q": "Question text here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": 0,
  "exp": "Explanation here",
  "hint": "Optional hint"
}
```

**Sections:** `vic_maths`, `vic_verbal`, `vic_quant`, `vic_reading`, `nsw_maths`, `nsw_thinking`, `nsw_reading`  
**Styles:** `acer`, `hendersons`, `psle`, `contour`, `james_ann`, `edutest`, `matrix`, `hast`, `oc`  
**Grades:** `selective`, `6`, `7`, `8`, `9`, `10`  
**Difficulty:** `easy`, `medium`, `hard`

---

## 🔑 API Key Setup

The portal uses the Anthropic Claude API for:
- AI feedback on every answer
- AI Tutor responses
- AI-generated study notes
- Writing marking

The API key is called directly from the browser. For a production site:
1. Set `ANTHROPIC_API_KEY` in your browser's localStorage: `localStorage.setItem('ss_api_key', 'sk-ant-...')`
2. Or add a settings page to enter it in the UI

For development/testing, the API calls in `js/app.js` include a note about where to add your key.

---

## 🎯 Features

- **401 questions** across 9 provider styles (ACER, Hendersons, PSLE, Contour, James & Ann, EduTest, Matrix, HAST, OC)
- **AI feedback** on every answer — 4 lines of personalised coaching (correct AND wrong)
- **Full session history** — see every session, export/import JSON
- **Achievement system** — 15 achievements to unlock
- **Activity heatmap** — 14-day visual history
- **Mock exams** — 15 timed exams with countdown timer
- **Fun Zone** — 30+ maths puzzles, English games, brain teasers
- **Study Notes** — AI-generated notes for any topic
- **AI Tutor** — ask any question
- **Writing practice** — AI marking with scores out of 40
- **Daily Challenge** — 3 quick questions every day
- **Weak spot detection** — identifies topics needing work
- **Progress tracking** — streaks, accuracy by section/style/topic/difficulty

---

## 📱 Compatible With

- Chrome, Firefox, Safari, Edge (all modern browsers)
- Desktop, tablet, and mobile
- Works offline for browsing questions (AI features require internet)

---

Built with ❤️ for Australian students. All questions are original.
