import {
  startOfWeek,
  endOfWeek,
  format,
  isSameWeek,
  addWeeks,
} from "date-fns";

// Weeks start Monday, end Sunday (per spec).
const WEEK_OPTS = { weekStartsOn: 1 };

export function weekKey(date) {
  return format(startOfWeek(date, WEEK_OPTS), "yyyy-MM-dd");
}

export function weekLabel(date, today = new Date()) {
  const start = startOfWeek(date, WEEK_OPTS);
  const end = endOfWeek(date, WEEK_OPTS);

  if (isSameWeek(date, today, WEEK_OPTS)) return "This week";
  if (isSameWeek(date, addWeeks(today, 1), WEEK_OPTS)) return "Next week";
  if (isSameWeek(date, addWeeks(today, -1), WEEK_OPTS)) return "Last week";

  const sameYear = start.getFullYear() === end.getFullYear();
  const startFmt = format(start, "MMM d");
  const endFmt = format(end, sameYear ? "MMM d" : "MMM d, yyyy");
  return `${startFmt} \u2013 ${endFmt}`;
}

/**
 * Groups tasks by the Mon-Sun week their dueDate falls in.
 * Returns an array of { key, label, start, tasks: [...] } sorted
 * chronologically (soonest week first), keeping weeks with tasks only.
 */
export function groupByWeek(tasks) {
  const groups = new Map();

  for (const task of tasks) {
    const due = new Date(task.dueDate);
    const key = weekKey(due);
    if (!groups.has(key)) {
      groups.set(key, { key, start: startOfWeek(due, WEEK_OPTS), tasks: [] });
    }
    groups.get(key).tasks.push(task);
  }

  const groupList = Array.from(groups.values()).sort(
    (a, b) => a.start - b.start
  );

  for (const g of groupList) {
    g.label = weekLabel(g.start);
    g.tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  return groupList;
}
