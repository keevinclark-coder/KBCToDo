# Deploy KBCToDo to GitHub and Render

## Option A: One command (requires GitHub token)

From the `KBCToDo` directory:

```bash
export GITHUB_TOKEN=your_personal_access_token
./scripts/create-github-repo.sh
```

Create a token at: GitHub → Settings → Developer settings → Personal access tokens (classic), scope **repo**. Then deploy to Render (see below).

## Option B: Create repo with GitHub CLI, then push

From the `KBCToDo` directory:

```bash
gh repo create KBCToDo --public --source=. --remote=origin --push --description "Todo list app"
```

## Deploy to Render

After the repo exists and code is pushed:

1. Go to [Render Dashboard](https://dashboard.render.com).
2. **New** → **Blueprint** (this repo has a `render.yaml`).
3. Connect the **KBCToDo** repository.
4. Review and click **Apply**.

Or create a static site manually: **New** → **Static Site**, connect **KBCToDo**, set build command `npm install && npm run build`, publish directory `dist`.

The site URL will be like `https://kbctodo.onrender.com`.
