
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { nanoid } = require("nanoid");

const app = express();
const DB_PATH = path.join(__dirname, "db.json");

app.use(cors());
app.use(express.json());

// --- tiny file-based "database" -------------------------------------------
function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ tasks: [] }, null, 2));
  }

  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// --- routes -----------------------------------------------------------------

// GET /api/tasks?search=keyword -> list all tasks (optionally filtered)
app.get("/api/tasks", (req, res) => {
  const { search } = req.query;
  const { tasks } = readDB();

  if (!search) {
    return res.json(tasks);
  }

  const q = search.toLowerCase();

  const filtered = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      (t.description || "").toLowerCase().includes(q)
  );

  res.json(filtered);
});

// POST /api/tasks -> create a task
app.post("/api/tasks", (req, res) => {
  const { title, description, dueDate, priority } = req.body;

  if (!title || !dueDate) {
    return res.status(400).json({
      error: "title and dueDate are required",
    });
  }

  const db = readDB();

  const task = {
    id: nanoid(),
    title,
    description: description || "",
    dueDate,
    priority: priority || "Low",
    status: "In Progress",
    createdAt: new Date().toISOString(),
  };

  db.tasks.push(task);
  writeDB(db);

  res.status(201).json(task);
});

// PUT /api/tasks/:id -> update a task
app.put("/api/tasks/:id", (req, res) => {
  const db = readDB();

  const idx = db.tasks.findIndex(
    (t) => t.id === req.params.id
  );

  if (idx === -1) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  db.tasks[idx] = {
    ...db.tasks[idx],
    ...req.body,
    id: db.tasks[idx].id,
  };

  writeDB(db);

  res.json(db.tasks[idx]);
});

// DELETE /api/tasks/:id -> delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const db = readDB();

  const exists = db.tasks.some(
    (t) => t.id === req.params.id
  );

  if (!exists) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  db.tasks = db.tasks.filter(
    (t) => t.id !== req.params.id
  );

  writeDB(db);

  res.status(204).end();
});

// Root route
app.get("/", (_req, res) => {
  res.send("To-Do List API is running.");
});

// Export Express app for Vercel
module.exports = app;

