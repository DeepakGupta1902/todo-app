import { X, Search } from "lucide-react";
import { format } from "date-fns";
import PriorityTag from "./PriorityTag";

export default function SearchOverlay({
  query,
  setQuery,
  results,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-paper animate-fade-in">
      <div className="flex items-center gap-2 border-b border-rule px-4 py-3">
        <Search size={18} className="text-inkfaint" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks by title or description"
          className="flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-inkfaint"
        />
        <button
          onClick={onClose}
          className="rounded-full p-1.5 text-inkfaint hover:bg-rule/60"
          aria-label="Close search"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {query && results.length === 0 && (
          <p className="mt-10 text-center text-[14px] text-inkfaint">
            No tasks match &ldquo;{query}&rdquo;.
          </p>
        )}

        <div className="space-y-2">
          {results.map((task) => {
            const isDone = task.status === "Completed";
            return (
              <button
                key={task.id}
                onClick={() => onEdit(task)}
                className="flex w-full items-start justify-between gap-3 rounded-2xl border border-rule bg-white px-4 py-3 text-left"
              >
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-[15px] font-medium ${
                      isDone ? "text-inkfaint line-through" : "text-ink"
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="mt-0.5 truncate text-[13px] text-inkfaint">
                      {task.description}
                    </p>
                  )}
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-[12px] text-inkfaint">
                      {format(new Date(task.dueDate), "EEE, MMM d")}
                    </span>
                    <PriorityTag priority={task.priority} />
                  </div>
                </div>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                  }}
                  className="shrink-0 rounded-full px-2 py-1 text-[12px] text-coral"
                >
                  Delete
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
