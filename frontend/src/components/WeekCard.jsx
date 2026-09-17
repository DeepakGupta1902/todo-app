import { useState } from "react";
import { ChevronDown } from "lucide-react";
import TaskItem from "./TaskItem";

export default function WeekCard({ group, defaultOpen, onToggleStatus, onEdit, onDelete }) {
  const [open, setOpen] = useState(defaultOpen);

  const total = group.tasks.length;
  const completed = group.tasks.filter((t) => t.status === "Completed").length;
  const openCount = total - completed;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="overflow-hidden rounded-2xl border border-rule bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5"
      >
        <div className="min-w-0 text-left">
          <p className="font-display text-[17px] font-semibold text-ink">
            {group.label}
          </p>
          <div className="mt-1 flex items-center gap-3">
            <span className="flex items-center gap-1 text-[12px] text-indigo">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo" />
              {openCount} open
            </span>
            <span className="flex items-center gap-1 text-[12px] text-sage">
              <span className="h-1.5 w-1.5 rounded-full bg-sage" />
              {completed} done
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="relative h-9 w-9">
            <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="#E4DDCE"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="#5C8A4E"
                strokeWidth="3"
                strokeDasharray={`${(pct / 100) * 97.4} 97.4`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-ink">
              {pct}%
            </span>
          </div>
          <ChevronDown
            size={18}
            className={`text-inkfaint transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="space-y-2 border-t border-rule px-3 pb-3 pt-3">
          {group.tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
