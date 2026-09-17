# To-Do List API (backend)

A minimal Express REST API used by the frontend. Data is persisted to a local
`db.json` file (swap this out for MongoDB/Mongoose if you want a true MERN
setup — the route logic stays the same).

## Run locally

```bash
npm install
npm start
```

The API listens on `http://localhost:4000`.

## Endpoints

| Method | Route            | Description                          |
|--------|------------------|---------------------------------------|
| GET    | /api/tasks       | List all tasks (`?search=keyword`)    |
| POST   | /api/tasks       | Create a task                         |
| PUT    | /api/tasks/:id   | Update a task                         |
| DELETE | /api/tasks/:id   | Delete a task                         |

### Task shape

```json
{
  "id": "abc123",
  "title": "Finish assignment",
  "description": "Wrap up the MERN to-do app",
  "dueDate": "2026-09-20T10:00:00.000Z",
  "priority": "High",
  "status": "In Progress",
  "createdAt": "2026-09-17T08:00:00.000Z"
}
```

## Deploying

Render, Railway, or Fly.io all work well for a free Node API host. Point the
frontend's `VITE_API_URL` env var at the deployed URL.
