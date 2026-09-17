import { useEffect, useMemo, useState } from "react";
import { Plus, Search, NotebookPen } from "lucide-react";
import WeekCard from "./components/WeekCard";
import TaskFormSheet from "./components/TaskFormSheet";
import SearchOverlay from "./components/SearchOverlay";
import { groupByWeek, weekKey } from "./lib/weeks";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./lib/api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const data = await fetchTasks();
    setTasks(data);
    setLoading(false);
  }

  useEffect(() => {
    if (!searchOpen) return;
    let active = true;
    fetchTasks(query).then((r) => active && setSearchResults(r));
    return () => {
      active = false;
    };
  }, [query, searchOpen]);

  const weekGroups = useMemo(() => groupByWeek(tasks), [tasks]);
  const currentWeekKey = weekKey(new Date());

  async function handleSave(payload) {
    if (editingTask) {
      const updated = await updateTask(editingTask.id, payload);
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? { ...t, ...updated } : t))
      );
    } else {
      const created = await createTask(payload);
      setTasks((prev) => [...prev, created]);
    }
    closeSheet();
  }

  async function handleDelete(id) {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setSearchResults((prev) => prev.filter((t) => t.id !== id));
    closeSheet();
  }

  async function handleToggleStatus(id, status) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    await updateTask(id, { status });
  }

  function openCreate() {
    setEditingTask(null);
    setSheetOpen(true);
  }

  function openEdit(task) {
    setEditingTask(task);
    setSheetOpen(true);
  }

  function closeSheet() {
    setSheetOpen(false);
    setEditingTask(null);
  }

  const totalOpen = tasks.filter((t) => t.status !== "Completed").length;

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col bg-paper">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-rule bg-paper/90 px-5 pb-4 pt-6 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-wide text-inkfaint">
              {totalOpen} task{totalOpen === 1 ? "" : "s"} open
            </p>
            <h1 className="font-display text-[26px] font-semibold leading-tight text-ink">
              Your week, sorted.
            </h1>
          </div>
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search tasks"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rule bg-white text-ink"
          >
            <Search size={18} />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 space-y-3 px-5 py-4 pb-28">
        {loading && (
          <p className="mt-10 text-center text-[14px] text-inkfaint">
            Loading tasks...
          </p>
        )}

        {!loading && weekGroups.length === 0 && (
          <div className="mt-16 flex flex-col items-center text-center">
            <NotebookPen size={36} className="mb-3 text-inkfaint/60" />
            <p className="font-display text-[18px] font-semibold text-ink">
              Nothing on the list yet
            </p>
            <p className="mt-1 max-w-[26ch] text-[14px] text-inkfaint">
              Add your first task and it'll land in the right week
              automatically.
            </p>
          </div>
        )}

        {weekGroups.map((group) => (
          <WeekCard
            key={group.key}
            group={group}
            defaultOpen={group.key === currentWeekKey}
            onToggleStatus={handleToggleStatus}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        ))}
      </main>

      {/* FAB */}
      <button
        onClick={openCreate}
        aria-label="Add task"
        className="fixed bottom-6 left-1/2 z-30 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-indigo text-white shadow-lg shadow-indigo/30 active:bg-indigo-dark"
      >
        <Plus size={26} />
      </button>

      {sheetOpen && (
        <TaskFormSheet
          initialTask={editingTask}
          onClose={closeSheet}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}

      {searchOpen && (
        <SearchOverlay
          query={query}
          setQuery={setQuery}
          results={query ? searchResults : []}
          onClose={() => {
            setSearchOpen(false);
            setQuery("");
          }}
          onEdit={(task) => {
            setSearchOpen(false);
            setQuery("");
            openEdit(task);
          }}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </div>
  );
}
