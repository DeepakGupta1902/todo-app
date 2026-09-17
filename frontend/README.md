# Weekly — To-Do List (frontend)

A mobile-first React + Tailwind UI for the SDE-1 assignment's To-Do List app.
Tasks are grouped into Monday–Sunday weeks, each week shows an open/completed
summary, and tasks can be created, edited, completed, deleted, and searched.

If a backend (see `../backend`) is reachable at `VITE_API_URL`, the app uses
it. Otherwise it falls back to `localStorage` automatically, so the app is
fully usable as a standalone static deploy too.

## Run locally

```bash
npm install
npm run dev
```

Optionally copy `.env.example` to `.env` and point `VITE_API_URL` at your
running backend.

## Build

```bash
npm run build
```

Outputs a static build to `dist/`, ready to drag-and-drop onto Netlify or
deploy via the Netlify CLI (`netlify deploy --prod`).

## Structure

```
src/
  components/   TaskItem, WeekCard, TaskFormSheet, SearchOverlay, PriorityTag
  lib/
    api.js      Talks to the backend, falls back to localStorage
    weeks.js    Groups tasks into Mon–Sun week buckets
  App.jsx       Screen layout & state
```
