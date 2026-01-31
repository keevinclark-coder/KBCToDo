#!/usr/bin/env bash
# Create KBCToDo static site on Render via API. Requires RENDER_API_KEY.
# Set in environment: export RENDER_API_KEY=your_key
# Or add to .env in project root (script will source it if present).
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

if [ -z "$RENDER_API_KEY" ]; then
  echo "Error: Set RENDER_API_KEY (export RENDER_API_KEY=your_key or add to .env)"
  exit 1
fi

# RankinCo-Services workspace
OWNER_ID="${RENDER_OWNER_ID:-tea-d5qerqf5r7bs738jbqmg}"
REPO_URL="${RENDER_REPO_URL:-https://github.com/keevinclark-coder/KBCToDo}"
NAME="KBCToDo"
BRANCH="main"
BUILD_CMD="npm install && npm run build"
PUBLISH_PATH="dist"

# Create static site via Render API
# See https://api-docs.render.com/reference/create-service
TMP=$(mktemp)
HTTP_CODE=$(curl -s -w "%{http_code}" -o "$TMP" -X POST "https://api.render.com/v1/services" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"ownerId\": \"$OWNER_ID\",
    \"name\": \"$NAME\",
    \"type\": \"static_site\",
    \"repo\": \"$REPO_URL\",
    \"branch\": \"$BRANCH\",
    \"buildCommand\": \"$BUILD_CMD\",
    \"publishPath\": \"$PUBLISH_PATH\"
  }")
HTTP_BODY=$(cat "$TMP")
rm -f "$TMP"

if [ "$HTTP_CODE" = "201" ]; then
  echo "Created KBCToDo static site on Render."
  echo "$HTTP_BODY" | python3 -c "import json,sys; d=json.load(sys.stdin); print('Service ID:', d.get('service', d).get('id')); print('URL:', d.get('service', d).get('serviceDetails', {}).get('url', 'N/A'))" 2>/dev/null || echo "$HTTP_BODY"
elif [ "$HTTP_CODE" = "401" ]; then
  echo "Error: Unauthorized. Check RENDER_API_KEY (get full key from https://dashboard.render.com/settings/api-keys)"
  echo "$HTTP_BODY"
  exit 1
else
  echo "API error ($HTTP_CODE): $HTTP_BODY"
  exit 1
fi
