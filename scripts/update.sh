#!/usr/bin/env bash
# Updates this folder to the latest code on GitHub. Run from anywhere:  bash scripts/update.sh
# It never touches node_modules, .env or your Supabase link.
set -euo pipefail

REPO="Rezk212/fabric-care-app"
BRANCH="claude/tender-maxwell-7i2mxo"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "Checking the latest version..."
SHA="$(curl -fsS -H 'Accept: application/vnd.github.sha' "https://api.github.com/repos/$REPO/commits/$BRANCH")"
case "$SHA" in ([0-9a-f]*) ;; (*) echo "Could not read the latest version. Check your internet and try again."; exit 1;; esac

echo "Downloading ${SHA:0:7}..."
curl -fsSL -o "$TMP/naqa.zip" "https://github.com/$REPO/archive/$SHA.zip"
unzip -q "$TMP/naqa.zip" -d "$TMP"
SRC="$(ls -d "$TMP"/*/ | head -1)"
SRC="${SRC%/}"

# Backend files changed? Remember before copying, so we can tell you what to deploy.
FN_CHANGED=0; DB_CHANGED=0
diff -rq "$ROOT/supabase/functions" "$SRC/supabase/functions" >/dev/null 2>&1 || FN_CHANGED=1
diff -rq "$ROOT/supabase/migrations" "$SRC/supabase/migrations" >/dev/null 2>&1 || DB_CHANGED=1

# Dependencies changed?
DEPS_CHANGED=0
for f in package.json apps/mobile/package.json packages/shared/package.json; do
  cmp -s "$ROOT/$f" "$SRC/$f" || DEPS_CHANGED=1
done

mkdir -p apps/mobile/src packages/shared/src supabase/functions supabase/migrations scripts
cp -R "$SRC/apps/mobile/src/." apps/mobile/src/
cp -R "$SRC/packages/shared/src/." packages/shared/src/
cp "$SRC/apps/mobile/app.json" apps/mobile/app.json
cp -R "$SRC/supabase/functions/." supabase/functions/
cp -R "$SRC/supabase/migrations/." supabase/migrations/
cp "$SRC/scripts/update.sh" scripts/update.sh
for f in package.json package-lock.json apps/mobile/package.json packages/shared/package.json; do
  cp "$SRC/$f" "$ROOT/$f"
done

if [ "$DEPS_CHANGED" = 1 ]; then
  echo "New packages are needed. Installing (a few minutes)..."
  npm install
fi

echo
echo "Done. Version ${SHA:0:7} is in place."
echo "If the app is running, your phone refreshes by itself. If not: cd apps/mobile && npx expo start"
if [ "$FN_CHANGED" = 1 ]; then
  echo
  echo "!! A backend function changed. Deploy it with:"
  echo "   npx supabase functions deploy analyze --use-api"
  echo "   npx supabase functions deploy delete-account --use-api"
fi
if [ "$DB_CHANGED" = 1 ]; then
  echo
  echo "!! The database changed. Ask Claude which new SQL file to run in the Supabase SQL Editor."
fi
