// Small date helpers used to key monthly / weekly / daily records.
// Weeks run 1-4 inside each calendar month, matching the physical journal.

export const monthKeyOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

export const dateKeyOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

/** Week 1-4 within the month (capped at 4, per the journal format). */
export const currentWeekIndex = (d = new Date()) =>
  Math.min(4, Math.ceil(d.getDate() / 7));

export const weekKeyOf = (monthKey: string, weekIndex: number) =>
  `${monthKey}-${weekIndex}`;

export const parseWeekKey = (weekKey: string) => {
  const [year, month, week] = weekKey.split("-").map(Number);
  return { year, month, week };
};

export const formatMonth = (monthKey: string) => {
  const [y, m] = monthKey.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

export const formatMonthShort = (monthKey: string) => {
  const [y, m] = monthKey.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

export const formatDate = (dateKey: string) => {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export const todayKey = () => dateKeyOf(new Date());

export const tomorrowKey = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return dateKeyOf(d);
};

/** Months from the start of the selected year up to now, newest first. */
export const recentMonthKeys = (year: number, limit = 12) => {
  const keys: string[] = [];
  const now = new Date();
  const endMonth = now.getFullYear() === year ? now.getMonth() + 1 : 12;
  for (let m = endMonth; m >= 1 && keys.length < limit; m--) {
    keys.push(`${year}-${String(m).padStart(2, "0")}`);
  }
  return keys;
};
