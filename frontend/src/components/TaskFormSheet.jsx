import { useState } from "react";
import { X, Trash2 } from "lucide-react";

const PRIORITIES = ["Low", "Medium", "High"];

function toLocalInputValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function TaskFormSheet({ initialTask, onClose, onSave, onDelete }) {
  const isEdit = Boolean(initialTask);
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(
    initialTask?.description || ""
  );
  const [dueDate, setDueDate] = useState(
    toLocalInputValue(initialTask?.dueDate) ||
      toLocalInputValue(new Date().toISOString())
  );
  const [priority, setPriority] = useState(initialTask?.priority || "Low");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Give the task a title.");
      return;
    }
    if (!dueDate) {
      setError("Pick a date and time.");
      return;
    }
    onSave({
      title: title.trim(),
      description: description.trim(),
      dueDate: new Date(dueDate).toISOString(),
      priority,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-ink/30 animate-fade-in"
        onClick={onClose}
      />
      <form
        onSubmit={handleSubmit}
        className="animate-sheet-up relative z-10 w-full max-w-md rounded-t-3xl bg-paper px-5 pb-8 pt-4 shadow-2xl"
      >
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-rule" />

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">
            {isEdit ? "Edit task" : "New task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-inkfaint hover:bg-rule/60"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[12px] font-medium text-inkfaint">
              Title
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Submit assignment"
              className="w-full rounded-xl border border-rule bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-indigo"
            />
          </div>

          <div>
            <label className="mb-1 block text-[12px] font-medium text-inkfaint">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Add details..."
              className="w-full resize-none rounded-xl border border-rule bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-indigo"
            />
          </div>

          <div>
            <label className="mb-1 block text-[12px] font-medium text-inkfaint">
              Date & time
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-rule bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-indigo"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-inkfaint">
              Priority (optional)
            </label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 rounded-xl border px-3 py-2 text-[13px] font-medium transition-colors ${
                    priority === p
                      ? "border-indigo bg-indigo text-white"
                      : "border-rule bg-white text-inkfaint"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-[13px] text-coral">{error}</p>}
        </div>

        <div className="mt-5 flex gap-2">
          {isEdit && (
            <button
              type="button"
              onClick={() => onDelete(initialTask.id)}
              className="flex items-center justify-center rounded-xl border border-rule bg-white px-3.5 text-coral"
              aria-label="Delete task"
            >
              <Trash2 size={18} />
            </button>
          )}
          <button
            type="submit"
            className="flex-1 rounded-xl bg-indigo py-3 text-[15px] font-semibold text-white active:bg-indigo-dark"
          >
            {isEdit ? "Save changes" : "Add task"}
          </button>
        </div>
      </form>
    </div>
  );
}
