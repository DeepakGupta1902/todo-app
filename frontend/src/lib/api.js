// Talks to the Express API when it's reachable; otherwise falls back to
// localStorage so the app still works when opened standalone (e.g. a static
// Netlify deploy with no backend attached).

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const LS_KEY = "todo-app:tasks";

let backendAvailable = null; // null = unknown, true/false once checked

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveLocal(tasks) {
  localStorage.setItem(LS_KEY, JSON.stringify(tasks));
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

async function checkBackend() {
  if (backendAvailable !== null) return backendAvailable;
  try {
    const res = await fetch(`${API_URL}/api/tasks`, { method: "GET" });
    backendAvailable = res.ok;
  } catch {
    backendAvailable = false;
  }
  return backendAvailable;
}

export async function fetchTasks(search = "") {
  const useBackend = await checkBackend();

  if (useBackend) {
    const url = search
      ? `${API_URL}/api/tasks?search=${encodeURIComponent(search)}`
      : `${API_URL}/api/tasks`;
    const res = await fetch(url);
    return res.json();
  }

  const tasks = loadLocal();
  if (!search) return tasks;
  const q = search.toLowerCase();
  return tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      (t.description || "").toLowerCase().includes(q)
  );
}

export async function createTask(payload) {
  const useBackend = await checkBackend();

  if (useBackend) {
    const res = await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  const tasks = loadLocal();
  const task = {
    id: uid(),
    status: "In Progress",
    priority: "Low",
    description: "",
    createdAt: new Date().toISOString(),
    ...payload,
  };
  tasks.push(task);
  saveLocal(tasks);
  return task;
}

export async function updateTask(id, patch) {
  const useBackend = await checkBackend();

  if (useBackend) {
    const res = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    return res.json();
  }

  const tasks = loadLocal();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx !== -1) {
    tasks[idx] = { ...tasks[idx], ...patch };
    saveLocal(tasks);
    return tasks[idx];
  }
  return null;
}

export async function deleteTask(id) {
  const useBackend = await checkBackend();

  if (useBackend) {
    await fetch(`${API_URL}/api/tasks/${id}`, { method: "DELETE" });
    return;
  }

  const tasks = loadLocal().filter((t) => t.id !== id);
  saveLocal(tasks);
}

export async function isUsingBackend() {
  return checkBackend();
}
