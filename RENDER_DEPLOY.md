# Deploy KBCToDo to Render

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

## 2. Get the service ID for monitoring

After the service is created, open it in the Dashboard. The URL is like:

`https://dashboard.render.com/static/srv-XXXXXXXXX`

The **service ID** is `srv-XXXXXXXXX`. Share this so deploys and logs can be checked via CLI.

## 3. Repo status

- **keevinclark-coder/KBCToDo** – exists and has the latest code (including validated `render.yaml`). Use this to connect Render if **kclark-wip/KBCToDo** does not exist yet.
- **kclark-wip/KBCToDo** – create the repo and push when ready, then you can point the Render service at it in **Settings** → **Build & Deploy** → **Repository**.
