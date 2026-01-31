# Deploy KBCToDo to Render

## Set RENDER_API_KEY (for API/script)

To create the service via API or use the script:

1. Get your API key: [Render Dashboard → Account → API Keys](https://dashboard.render.com/settings/api-keys).
2. Set it in your environment (use the **full** key; short values like `rnd_ANUc25` often return 401):
   - **Option A:** In terminal: `export RENDER_API_KEY=your_full_key`
   - **Option B:** Create a `.env` file in the KBCToDo root with: `RENDER_API_KEY=your_full_key` (the script will source it; `.env` is in `.gitignore`).
3. Run: `./scripts/render-create-static-site.sh`

## 1. Create the service in the Render Dashboard

**Option A – Blueprint (recommended)**

1. Open [Render Dashboard](https://dashboard.render.com).
2. **New** → **Blueprint**.
3. Connect the repo **keevinclark-coder/KBCToDo** (or **kclark-wip/KBCToDo** after you create that repo).
4. Click **Apply**. Render will create the static site from `render.yaml`.

**Option B – Static site only**

1. Open [Render Dashboard](https://dashboard.render.com).
2. **New** → **Static Site**.
3. Connect **keevinclark-coder/KBCToDo**.
4. Set **Build command:** `npm install && npm run build`
5. Set **Publish directory:** `dist`
6. Click **Create Static Site**.

## 2. Monitor deploys and logs (after render login)

After the service is created and you’ve run `render login` to refresh the CLI token:

```bash
./scripts/monitor-render.sh
```

This finds the KBCToDo service, lists recent deploys, and shows build and service logs so you can correct any errors.

To get the service ID manually: open the service in the Dashboard; the URL is like `https://dashboard.render.com/static/srv-XXXXXXXXX` — the ID is `srv-XXXXXXXXX`.

## 3. Repo status

- **keevinclark-coder/KBCToDo** – exists and has the latest code (including validated `render.yaml`). Use this to connect Render if **kclark-wip/KBCToDo** does not exist yet.
- **kclark-wip/KBCToDo** – create the repo and push when ready, then you can point the Render service at it in **Settings** → **Build & Deploy** → **Repository**.
