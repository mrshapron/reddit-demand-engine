#!/usr/bin/env bash
# Double-click this file in Finder to install deps (if needed) and start the dev server.
set -e

# Move to the directory this script lives in, regardless of where it's invoked from.
cd "$(dirname "$0")"

echo ""
echo "  Reddit Demand Engine — local dev launcher"
echo "  $(pwd)"
echo ""

# Make sure node + npm exist
if ! command -v node >/dev/null 2>&1; then
  echo "  ✗ Node.js is not installed."
  echo "    Install the LTS build from https://nodejs.org and run this again."
  echo ""
  read -n 1 -s -r -p "  Press any key to close…"
  exit 1
fi

NODE_VERSION="$(node -v)"
echo "  ✓ Node $NODE_VERSION detected"

# Decide whether we need a fresh install. Reasons:
#   1. node_modules is missing
#   2. Critical files inside node_modules are missing (broken install)
#   3. The install came from a different OS/arch (e.g. cross-platform copy)
EXPECTED_PLATFORM="$(node -p 'process.platform + "-" + process.arch')"
PLATFORM_MARKER="node_modules/.installed-on"
NEED_INSTALL=0

if [ ! -d "node_modules" ]; then
  NEED_INSTALL=1
elif [ ! -f "node_modules/rollup/dist/native.js" ]; then
  NEED_INSTALL=1
  echo "  → Detected broken node_modules (missing rollup/dist/native.js). Reinstalling…"
elif [ ! -f "$PLATFORM_MARKER" ] || [ "$(cat "$PLATFORM_MARKER" 2>/dev/null)" != "$EXPECTED_PLATFORM" ]; then
  NEED_INSTALL=1
  echo "  → node_modules was built for a different platform. Reinstalling for $EXPECTED_PLATFORM…"
fi

if [ "$NEED_INSTALL" = "1" ]; then
  echo "  → Cleaning previous install…"
  rm -rf node_modules package-lock.json
  echo "  → Running npm install (this can take ~30s on the first run)…"
  npm install --no-audit --no-fund
  printf '%s' "$EXPECTED_PLATFORM" > "$PLATFORM_MARKER"
  echo "  ✓ Dependencies ready"
  echo ""
fi

# Open the browser ~3 seconds after vite boots
( sleep 3 && open "http://localhost:5173" ) &

echo "  → Starting Vite dev server on http://localhost:5173"
echo "    (Ctrl+C in this window to stop)"
echo ""

npm run dev
