const STYLES = {
  High: "bg-coral/10 text-coral border-coral/30",
  Medium: "bg-amber/10 text-amber border-amber/30",
  Low: "bg-indigo/10 text-indigo border-indigo/30",
};

export default function PriorityTag({ priority }) {
  if (!priority) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
        STYLES[priority] || STYLES.Low
      }`}
    >
      {priority}
    </span>
  );
}
