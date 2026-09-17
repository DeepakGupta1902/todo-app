import { useRef, useState } from "react";
import { format } from "date-fns";
import { Check, Trash2, Pencil } from "lucide-react";
import PriorityTag from "./PriorityTag";

const SWIPE_THRESHOLD = -72;

export default function TaskItem({ task, onToggleStatus, onEdit, onDelete }) {
  const [dragX, setDragX] = useState(0);
  const startX = useRef(null);
  const dragging = useRef(false);

  const isDone = task.status === "Completed";

  function handleTouchStart(e) {
    startX.current = e.touches[0].clientX;
    dragging.current = true;
  }

  function handleTouchMove(e) {
    if (!dragging.current) return;
    const delta = e.touches[0].clientX - startX.current;
    setDragX(Math.max(-96, Math.min(0, delta)));
  }

  function handleTouchEnd() {
    dragging.current = false;
    if (dragX < SWIPE_THRESHOLD) {
      setDragX(-96);
    } else {
      setDragX(0);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* delete affordance revealed on swipe */}
      <div className="absolute inset-y-0 right-0 flex w-24 items-center justify-center bg-coral">
        <button
          onClick={() => onDelete(task.id)}
          aria-label={`Delete ${task.title}`}
          className="flex h-full w-full items-center justify-center text-white active:opacity-80"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateX(${dragX}px)` }}
        className="relative flex items-start gap-3 rounded-2xl border border-rule bg-white px-4 py-3 transition-transform duration-150 ease-out"
      >
        <button
          onClick={() =>
            onToggleStatus(task.id, isDone ? "In Progress" : "Completed")
          }
          aria-label={isDone ? "Mark as in progress" : "Mark as completed"}
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            isDone
              ? "border-sage bg-sage text-white"
              : "border-inkfaint/40 text-transparent"
          }`}
        >
          <Check size={14} strokeWidth={3} />
        </button>

        <button
          onClick={() => onEdit(task)}
          className="min-w-0 flex-1 text-left"
        >
          <div className="flex items-center gap-2">
            <p
              className={`truncate font-body text-[15px] font-medium ${
                isDone ? "text-inkfaint line-through" : "text-ink"
              }`}
            >
              {task.title}
            </p>
          </div>
          {task.description && (
            <p className="mt-0.5 truncate text-[13px] text-inkfaint">
              {task.description}
            </p>
          )}
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-[12px] text-inkfaint">
              {format(new Date(task.dueDate), "EEE, MMM d \u00b7 h:mm a")}
            </span>
            <PriorityTag priority={task.priority} />
          </div>
        </button>

        <Pencil
          size={14}
          className="mt-1 shrink-0 text-inkfaint/50"
          aria-hidden
        />
      </div>
    </div>
  );
}
