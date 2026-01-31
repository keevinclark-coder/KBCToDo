#!/usr/bin/env bash
# Create GitHub repo KBCToDo and push this code. Requires GITHUB_TOKEN.
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_NAME="KBCToDo"
GITHUB_TOKEN="${GITHUB_TOKEN:-$GH_TOKEN}"

if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: Set GITHUB_TOKEN or GH_TOKEN (GitHub Settings → Developer settings → Personal access tokens, repo scope)"
  exit 1
fi

cd "$REPO_ROOT"

# Get GitHub username for remote URL
USER_LOGIN=$(curl -s -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json" https://api.github.com/user | grep '"login"' | head -1 | sed 's/.*"login": *"\([^"]*\)".*/\1/')
[ -z "$USER_LOGIN" ] && { echo "Error: Could not get GitHub user"; exit 1; }

# Create repo via API (idempotent if repo already exists)
RESP=$(curl -s -w "\n%{http_code}" -X POST -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json" \
  -d "{\"name\":\"$REPO_NAME\",\"description\":\"Todo list app\",\"private\":false}" \
  https://api.github.com/user/repos)
HTTP_BODY=$(echo "$RESP" | head -n -1)
HTTP_CODE=$(echo "$RESP" | tail -n 1)

if [ "$HTTP_CODE" = "201" ]; then
  echo "Created GitHub repo $REPO_NAME"
elif [ "$HTTP_CODE" = "422" ]; then
  if echo "$HTTP_BODY" | grep -q "name already exists"; then
    echo "Repo $REPO_NAME already exists"
  else
    echo "API error: $HTTP_BODY"
    exit 1
  fi
else
  echo "API error ($HTTP_CODE): $HTTP_BODY"
  exit 1
fi

# Use token in URL for push (avoids interactive auth)
PUSH_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/${USER_LOGIN}/${REPO_NAME}.git"
if git remote get-url origin 2>/dev/null; then
  git remote set-url origin "https://github.com/${USER_LOGIN}/${REPO_NAME}.git"
else
  git remote add origin "https://github.com/${USER_LOGIN}/${REPO_NAME}.git"
fi

git branch -M main
git push "$PUSH_URL" main
git branch --set-upstream-to=origin/main main
echo "Pushed to https://github.com/${USER_LOGIN}/${REPO_NAME}"
