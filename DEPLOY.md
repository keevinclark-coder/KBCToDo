# Deploy KBCToDo to GitHub and Render

## Option A: One command (requires GitHub token)

From the `KBCToDo` directory:

```bash
export GITHUB_TOKEN=your_personal_access_token
./scripts/create-github-repo.sh
```

Create a token at: GitHub → Settings → Developer settings → Personal access tokens (classic), scope **repo**. Then deploy to Render (see below).

## Option B: Create repo under kclark-wip, then push

The remote is set to **kclark-wip/KBCToDo**. Create the repo on GitHub first:

1. Create the org **kclark-wip** if it doesn’t exist: [GitHub New organization](https://github.com/organizations/new).
2. In that org (or at [github.com/kclark-wip](https://github.com/kclark-wip)), click **New repository**, name it **KBCToDo**, set to Public, leave “Add a README” unchecked, then **Create repository**.
3. From the `KBCToDo` directory (remote is already `https://github.com/kclark-wip/KBCToDo.git`):

```bash
git push -u origin main
```

## Deploy to Render

After the repo exists and code is pushed:

1. Go to [Render Dashboard](https://dashboard.render.com).
2. **New** → **Blueprint** (this repo has a `render.yaml`).
3. Connect the **kclark-wip/KBCToDo** repository.
4. Review and click **Apply**.

Or create a static site manually: **New** → **Static Site**, connect **kclark-wip/KBCToDo**, set build command `npm install && npm run build`, publish directory `dist`.

The site URL will be like `https://kbctodo.onrender.com`.
