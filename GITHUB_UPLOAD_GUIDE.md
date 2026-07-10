# How to Upload StudySpark to GitHub

There are **3 methods** below — pick whichever suits you.

---

## ✅ Method 1: Python script (recommended — uploads everything automatically)

This script uses the GitHub API to upload each file individually.
No batch size limits. Takes about 2–3 minutes for all files.

### Step 1 — Get a GitHub Personal Access Token

1. Go to **github.com** → click your profile photo → **Settings**
2. Scroll down → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. Click **Generate new token (classic)**
4. Give it any name (e.g. "StudySpark upload")
5. Set expiry to **90 days**
6. Tick the **`repo`** checkbox (gives full repo access)
7. Click **Generate token** at the bottom
8. **Copy the token** — you only see it once!

### Step 2 — Edit the script

Open `github_upload.py` in any text editor (Notepad, TextEdit, VS Code, etc.)

Find these three lines near the top and fill them in:

```python
GITHUB_TOKEN  = "ghp_xxxxxxxxxxxxxxxxxxxx"   # paste your token here
GITHUB_OWNER  = "kargold100"                  # your GitHub username
GITHUB_REPO   = "studyspark"                  # your repo name
```

Save the file.

### Step 3 — Run the script

**On Mac or Linux**, open Terminal in the `studyspark2` folder and run:
```bash
python3 github_upload.py
```

**On Windows**, open Command Prompt in the folder and run:
```
python github_upload.py
```

You'll see each file being uploaded with a progress counter.
When it says "✅ All files uploaded" — you're done!

---

## ✅ Method 2: GitHub Desktop (free app, easy, no limits)

1. Download **GitHub Desktop** from **desktop.github.com** and install it
2. Open GitHub Desktop → **File → Clone repository**
3. Choose your `studyspark` repository → click **Clone**
4. Note where it clones to (e.g. `Documents/GitHub/studyspark/`)
5. Open that folder in Finder/Explorer
6. **Select all files** from the `studyspark2` folder and **copy them** into the cloned folder (replacing existing files)
7. Back in GitHub Desktop, you'll see all the changed files listed
8. At the bottom left, type a commit message (e.g. "Update StudySpark")
9. Click **Commit to main** → then **Push origin**
10. Done! ✅

---

## Method 3: GitHub web upload in 2 batches

If you prefer the web interface, you must split the upload into **2 separate commits**
because GitHub's web uploader limits each commit to ~25MB total.

### Batch 1 (~22MB) — upload to `data/questions/`

Go to your repo on GitHub → navigate into `data/questions/` → 
click **Add file → Upload files**. Select these 18 files and commit:

```
gen_maths_a_a1.js    gen_maths_a_a2.js    gen_maths_a_b.js
gen_maths_a_c.js     gen_maths_b_a.js     gen_maths_b_b.js
gen_maths_b_c.js     gen_maths_c_a.js     gen_maths_c_b.js
gen_maths_c_c.js     gen_science_a.js     gen_science_b.js
gen_puzzles_a_a.js   gen_puzzles_a_b.js   gen_puzzles_b_a.js
gen_puzzles_b_b.js   vic_maths_a_a.js     vic_maths_a_b.js
```

### Batch 2 (~21MB) — upload remaining files

Still in `data/questions/` → **Add file → Upload files**. Select all remaining
question files (vic_maths_a_c.js, vic_maths_b_a.js ... icas_digital.js).

Then go back to the repo root and upload:
```
index.html    css/style.css    js/app.js    js/questions.js
```

### ⚠️ Important: delete old files first

If your repo still has the old unsplit files (`gen_maths.js`, `vic_maths.js`, etc.),
delete them first: navigate to each file on GitHub, click it, then click the
trash icon (Delete this file) and commit.

---

## Need help?

If any method fails, try the **Python script** — it's the most reliable
because it uploads one file at a time with no size restrictions.
