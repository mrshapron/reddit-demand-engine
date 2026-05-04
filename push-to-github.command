#!/usr/bin/env bash
# Double-click to push this project to github.com/mrshapron/reddit-demand-engine.
# Requires: git (preinstalled on macOS once Xcode CLT runs) and gh (GitHub CLI).
set -e

cd "$(dirname "$0")"

GH_USER="mrshapron"
REPO_NAME="reddit-demand-engine"
COMMIT_MSG="${1:-Initial commit: Reddit Demand Engine}"

echo ""
echo "  Reddit Demand Engine — push to GitHub"
echo "  Target: $GH_USER/$REPO_NAME"
echo "  Cwd:    $(pwd)"
echo ""

# 1. Tooling check
if ! command -v git >/dev/null 2>&1; then
  echo "  ✗ git is not installed."
  echo "    Run:  xcode-select --install"
  echo "    or install via Homebrew: brew install git"
  read -n 1 -s -r -p "  Press any key to close…"
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "  ✗ GitHub CLI (gh) is not installed."
  echo "    Install with: brew install gh"
  echo "    Then authenticate once: gh auth login"
  echo "    Then re-run this script."
  read -n 1 -s -r -p "  Press any key to close…"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "  ✗ gh is not authenticated."
  echo "    Run: gh auth login"
  echo "    (choose GitHub.com → HTTPS → login with browser)"
  echo "    Then re-run this script."
  read -n 1 -s -r -p "  Press any key to close…"
  exit 1
fi

echo "  ✓ git $(git --version | awk '{print $3}')"
echo "  ✓ gh  $(gh --version | head -1 | awk '{print $3}') (authenticated)"
echo ""

# 2. Ensure a clean .git. The repo may have been pre-initialized in a sandbox
#    with a stuck index.lock; nuke and start fresh on your filesystem.
if [ -f ".git/index.lock" ] || [ ! -f ".git/HEAD" ]; then
  if [ -d ".git" ]; then
    echo "  → Resetting partial .git state…"
    rm -rf .git
  fi
fi

# 3. Init if needed
if [ ! -d ".git" ]; then
  echo "  → git init -b main"
  git init -b main >/dev/null
fi

# 4. Configure user (local to this repo only)
if ! git config user.email >/dev/null 2>&1; then
  GH_EMAIL="$(gh api user --jq '.email // empty' 2>/dev/null || true)"
  GH_NAME="$(gh api user --jq '.name // .login // empty' 2>/dev/null || true)"
  git config user.email "${GH_EMAIL:-${GH_USER}@users.noreply.github.com}"
  git config user.name "${GH_NAME:-$GH_USER}"
fi

# 5. Stage and commit
echo "  → Staging files…"
git add .

if git diff --cached --quiet; then
  echo "  ✓ Working tree already matches HEAD; nothing new to commit."
else
  echo "  → git commit"
  git commit -m "$COMMIT_MSG" >/dev/null
fi

# 6. Create or reuse the GitHub repo
REPO_URL="https://github.com/$GH_USER/$REPO_NAME"

if gh repo view "$GH_USER/$REPO_NAME" >/dev/null 2>&1; then
  echo "  ✓ Repo already exists: $REPO_URL"
  if ! git remote get-url origin >/dev/null 2>&1; then
    git remote add origin "$REPO_URL.git"
  else
    git remote set-url origin "$REPO_URL.git"
  fi
  echo "  → git push -u origin main"
  git push -u origin main
else
  echo "  → Creating $GH_USER/$REPO_NAME on GitHub (public)…"
  gh repo create "$GH_USER/$REPO_NAME" \
    --public \
    --description "Reddit Demand Engine — turn Reddit into a demand engine without spamming. Listen, respond, generate — with human approval." \
    --source=. \
    --remote=origin \
    --push
fi

echo ""
echo "  ✓ Done."
echo "    $REPO_URL"
echo ""
read -n 1 -s -r -p "  Press any key to close…"
