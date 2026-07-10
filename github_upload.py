#!/usr/bin/env python3
"""
StudySpark — GitHub Upload Script
===================================
Uploads every file in the project to GitHub one at a time using the GitHub API.
Bypasses the 25MB web-upload limit entirely. Each file is uploaded individually.

USAGE:
  python3 github_upload.py

REQUIREMENTS:
  - Python 3.7+  (already installed on Mac/Linux; Windows: python.org/downloads)
  - A GitHub Personal Access Token (see instructions below)

HOW TO GET A TOKEN:
  1. Go to github.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. Click "Generate new token (classic)"
  3. Give it a name, set expiry to 90 days, tick the "repo" checkbox
  4. Click Generate and COPY the token (you only see it once)
"""

import os
import sys
import base64
import json
import time
import urllib.request
import urllib.error

# ─── CONFIGURE THESE THREE VALUES ────────────────────────────────────────────
GITHUB_TOKEN  = "YOUR_TOKEN_HERE"       # paste your token between the quotes
GITHUB_OWNER  = "kargold100"            # your GitHub username
GITHUB_REPO   = "studyspark"            # your repository name
BRANCH        = "main"                  # usually "main" or "master"
# ─────────────────────────────────────────────────────────────────────────────

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Files and folders to upload (relative to this script's folder)
UPLOAD_PATTERNS = [
    "index.html",
    "netlify.toml",
    "css/style.css",
    "js/app.js",
    "js/questions.js",
    "js/profiles.js",
    "js/history.js",
    "data/funzone.js",
    "data/tips.js",
    "data/languages.js",
    "data/writing.js",
]

# Upload entire data/questions/ folder
def get_all_files():
    files = list(UPLOAD_PATTERNS)
    q_dir = os.path.join(SCRIPT_DIR, "data", "questions")
    if os.path.isdir(q_dir):
        for f in sorted(os.listdir(q_dir)):
            if f.endswith(".js"):
                files.append(f"data/questions/{f}")
    return files

def get_sha(path):
    """Get the current SHA of a file in the repo (needed to update existing files)."""
    url = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents/{path}?ref={BRANCH}"
    req = urllib.request.Request(url, headers={
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "StudySpark-Uploader"
    })
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())["sha"]
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None  # File doesn't exist yet — that's fine
        raise

def upload_file(repo_path, local_path):
    """Upload a single file to GitHub."""
    with open(local_path, "rb") as f:
        content = base64.b64encode(f.read()).decode()

    sha = get_sha(repo_path)
    size_kb = os.path.getsize(local_path) / 1024

    payload = {
        "message": f"Update {repo_path}",
        "content": content,
        "branch": BRANCH,
    }
    if sha:
        payload["sha"] = sha  # Required when updating an existing file

    url = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents/{repo_path}"
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, method="PUT", headers={
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "StudySpark-Uploader"
    })
    with urllib.request.urlopen(req) as r:
        result = json.loads(r.read())
        action = "Updated" if sha else "Created"
        return action, size_kb

def main():
    print("=" * 60)
    print("  StudySpark GitHub Uploader")
    print("=" * 60)

    # Check token is configured
    if GITHUB_TOKEN == "YOUR_TOKEN_HERE":
        print("\n❌  Please edit this script and set your GITHUB_TOKEN.")
        print("    See the instructions at the top of this file.\n")
        sys.exit(1)

    files = get_all_files()
    total = len(files)
    print(f"\n  Repository : {GITHUB_OWNER}/{GITHUB_REPO}")
    print(f"  Branch     : {BRANCH}")
    print(f"  Files      : {total}")
    print(f"\n  Starting upload...\n")

    ok = 0
    failed = []

    for i, repo_path in enumerate(files, 1):
        local_path = os.path.join(SCRIPT_DIR, repo_path)
        if not os.path.exists(local_path):
            print(f"  [{i:3}/{total}] SKIP  (not found) {repo_path}")
            continue

        try:
            action, size_kb = upload_file(repo_path, local_path)
            print(f"  [{i:3}/{total}] {action:8s} {repo_path}  ({size_kb:.0f}KB)")
            ok += 1
            time.sleep(0.3)  # Be polite to the API — avoid rate limiting

        except Exception as e:
            print(f"  [{i:3}/{total}] ERROR   {repo_path} — {e}")
            failed.append(repo_path)
            time.sleep(1)

    print(f"\n{'=' * 60}")
    print(f"  Done: {ok}/{total} files uploaded successfully")
    if failed:
        print(f"  Failed ({len(failed)}):")
        for f in failed:
            print(f"    - {f}")
    else:
        print(f"  ✅  All files uploaded. Visit your site!")
        print(f"  🌐  https://{GITHUB_OWNER}.github.io/{GITHUB_REPO}/")
    print("=" * 60)

if __name__ == "__main__":
    main()
