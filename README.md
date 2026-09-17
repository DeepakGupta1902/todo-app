# Weekly — To-Do List App (SDE-1 MERN Assignment)

A mobile-first to-do list app: tasks are created with a title, optional
description, mandatory date & time, and optional priority; grouped by
Monday–Sunday week on the home screen; each week shows an open vs. completed
count; tasks can be edited, marked complete, deleted, and searched by
keyword.

```
todo-app/
  frontend/   React + Vite + Tailwind mobile UI
  backend/    Express REST API (file-based storage; swap in MongoDB easily)
```

## Quick start

```bash
# terminal 1 — API
cd backend
npm install
npm start          # http://localhost:4000

# terminal 2 — UI
cd frontend
npm install
npm run dev         # http://localhost:5173
```

The frontend works even without the backend running — it falls back to
`localStorage` automatically (see `frontend/src/lib/api.js`), so it's safe to
deploy as a static site on its own.

## Deploying

- **Frontend → Netlify**: `cd frontend && npm run build`, then drag the
  `dist/` folder into Netlify, or connect the repo and set the build command
  to `npm run build` with publish directory `dist`. Set the `VITE_API_URL`
  env var to your deployed API's URL (skip it and the app just uses
  `localStorage`).
- **Backend → Render/Railway/Fly.io**: any of these can run
  `npm install && npm start` on the `backend/` folder for free.

## Tech notes

- Weeks start Monday and end Sunday, computed with `date-fns`.
- Swiping a task left reveals a delete action (mobile gesture); tapping a
  task opens it for editing.
- To move from the included JSON file storage to MongoDB: replace the
  `readDB`/`writeDB` helpers in `backend/server.js` with Mongoose models —
  the route handlers and request/response shapes don't need to change.
