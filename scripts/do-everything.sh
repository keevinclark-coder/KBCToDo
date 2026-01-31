#!/usr/bin/env bash
# Do everything possible to deploy KBCToDo: validate, push, try API create, print next steps.
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

echo "=== 1. Validate render.yaml ==="
if render blueprints validate -o text 2>/dev/null; then
  echo "OK"
else
  echo "Warning: render validate failed (run 'render login' if token expired)"
fi
echo ""

echo "=== 2. Git: commit and push to keevinclark-coder/KBCToDo ==="
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "Deploy: sync for Render" || true
fi
git push keevin main 2>/dev/null || echo "Push skipped/failed (check remote keevin)"
echo "OK"
echo ""

echo "=== 3. Verify build (optional) ==="
if command -v npm >/dev/null 2>&1; then
  npm install --silent 2>/dev/null && npm run build 2>/dev/null && echo "Build OK" || echo "Build skipped/failed"
else
  echo "npm not in PATH, skip local build"
fi
echo ""

echo "=== 4. Create Render service via API (if RENDER_API_KEY set) ==="
if [ -n "$RENDER_API_KEY" ]; then
  ./scripts/render-create-static-site.sh 2>/dev/null && echo "Service created." || echo "API create failed (check key at dashboard.render.com/settings/api-keys)"
else
  echo "RENDER_API_KEY not set, skipping API create"
fi
echo ""

echo "=== 5. One manual step (if service not created above) ==="
echo "  Open: https://dashboard.render.com"
echo "  New → Blueprint → Connect repo: keevinclark-coder/KBCToDo → Apply"
echo ""
echo "To monitor via CLI: run 'render login' (token was expired), then:"
echo "  render services -o json  # find KBCToDo service ID"
echo "  render deploys list <SERVICE_ID> -o json"
echo "  render logs -r <SERVICE_ID> -o text"
echo ""
echo "Done."
