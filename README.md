# KBCToDo

A simple, modern todo list app built with React, TypeScript, and Vite. Tasks are stored in the browser (localStorage).

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

Output is in `dist/`. Preview with:

```bash
npm run preview
```

## Deploy to Render

This app is a **static site**. On [Render](https://render.com):

1. **New** → **Blueprint** (this repo has a `render.yaml`)
2. Connect your GitHub repo **kclark-wip/KBCToDo**
3. Review and click **Apply**

Or manually: **New** → **Static Site**, connect **kclark-wip/KBCToDo**, build command `npm install && npm run build`, publish directory `dist`.

## Lint

```bash
npm run lint
```

## License

MIT
