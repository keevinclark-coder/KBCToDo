#!/usr/bin/env bash
# Monitor KBCToDo on Render: list deploys and logs. Run 'render login' first if token expired.
set -e
SERVICE_NAME="KBCToDo"

echo "=== Finding KBCToDo service ==="
SVC_JSON=$(render services -o json 2>/dev/null) || { echo "Error: run 'render login' first"; exit 1; }
SERVICE_ID=$(echo "$SVC_JSON" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    for item in data:
        s = item.get('service')
        if s and (s.get('name') or '').strip().lower() == 'kbctodo':
            print(s.get('id', ''))
            break
except: pass
" 2>/dev/null)

if [ -z "$SERVICE_ID" ]; then
  echo "KBCToDo service not found. Create it: Dashboard → New → Blueprint → connect keevinclark-coder/KBCToDo"
  exit 1
fi

echo "Service ID: $SERVICE_ID"
echo ""
echo "=== Recent deploys ==="
render deploys list "$SERVICE_ID" -o json 2>/dev/null | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    for d in data[:5]:
        c = d.get('commit', {})
        print(d.get('status', '?'), d.get('id', '')[:20], c.get('message', '')[:50])
except: print(sys.stdin.read())
" 2>/dev/null || render deploys list "$SERVICE_ID" -o text 2>/dev/null
echo ""
echo "=== Build logs (last 50 lines) ==="
render logs -r "$SERVICE_ID" --type build --limit 50 -o text 2>/dev/null || true
echo ""
echo "=== Service logs (last 30 lines) ==="
render logs -r "$SERVICE_ID" --limit 30 -o text 2>/dev/null || true
echo ""
echo "Done. Fix any errors above, commit, push; Render will redeploy."
