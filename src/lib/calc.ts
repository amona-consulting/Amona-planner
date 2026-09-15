import type { AppState, WeeklyPlan, WeeklyReflection } from "./types";
import { parseWeekKey, weekKeyOf, monthKeyOf } from "./dates";

/** Completed actions / total actions (falls back to priorities when no actions). */
export function executionRate(plan: WeeklyPlan): number {
  const totalActions = plan.priorities.reduce(
    (n, p) => n + p.actions.length,
    0,
  );
  const doneActions = plan.priorities.reduce(
    (n, p) => n + p.actions.filter((a) => a.done).length,
    0,
  );
  if (totalActions > 0) return Math.round((doneActions / totalActions) * 100);
  if (plan.priorities.length > 0) {
    const done = plan.priorities.filter((p) => p.done).length;
    return Math.round((done / plan.priorities.length) * 100);
  }
  return 0;
}

interface ScoreBreakdown {
  score: number; // 0-100
  planningRate: number; // 0-1
  reviewRate: number; // 0-1
  executionAvg: number; // 0-100
  weeksPlanned: number;
  weeksReviewed: number;
  totalWeeks: number;
}

/**
 * Accountability Score (brief §20): rewards consistency over perfection.
 * 30% planning consistency + 30% review consistency + 40% average execution.
 */
export function accountabilityScore(state: AppState): ScoreBreakdown {
  const year = state.year?.year ?? new Date().getFullYear();
  const totalWeeks = state.monthly
    ? Object.values(state.monthly)
        .filter((m) => m.monthKey.startsWith(String(year)))
        .reduce((n, m) => n + 4, 0)
    : 0;

  const plans = Object.values(state.weekly).filter((w) =>
    w.weekKey.startsWith(String(year)),
  );
  const reflections = Object.values(state.reflections).filter((r) =>
    r.weekKey.startsWith(String(year)),
  );

  const weeksPlanned = plans.length;
  const weeksReviewed = reflections.length;
  const planningRate = totalWeeks > 0 ? weeksPlanned / totalWeeks : 0;
  const reviewRate = totalWeeks > 0 ? weeksReviewed / totalWeeks : 0;
  const executionAvg =
    plans.length > 0
      ? plans.reduce((n, p) => n + executionRate(p), 0) / plans.length
      : 0;

  const score =
    totalWeeks === 0
      ? 0
      : Math.round(planningRate * 30 + reviewRate * 30 + executionAvg * 0.4);

  return {
    score,
    planningRate,
    reviewRate,
    executionAvg: Math.round(executionAvg),
    weeksPlanned,
    weeksReviewed,
    totalWeeks,
  };
}

/** Consecutive completed weeks ending at the most recent week with data. */
export function streak(
  weekKeys: string[],
  maxWeek = 52,
): { current: number; best: number } {
  if (weekKeys.length === 0) return { current: 0, best: 0 };
  const set = new Set(weekKeys);
  const now = new Date();
  const currentKey = weekKeyOf(
    monthKeyOf(now),
    Math.min(4, Math.ceil(now.getDate() / 7)),
  );

  // Current streak: walk backwards from the current week.
  let run = 0;
  let { year, month, week } = parseWeekKey(currentKey);
  for (let i = 0; i < maxWeek; i++) {
    const key = weekKeyOf(`${year}-${String(month).padStart(2, "0")}`, week);
    if (set.has(key)) {
      run++;
    } else if (i > 0) {
      break; // first miss after a completed run ends the current streak
    }
    // if the current week is simply not reviewed yet, keep scanning
    week -= 1;
    if (week < 1) {
      month -= 1;
      week = 4;
      if (month < 1) {
        year -= 1;
        month = 12;
      }
    }
  }

  // Best streak: scan all completed weeks in order.
  let best = 0;
  let runBest = 0;
  let prev: { year: number; month: number; week: number } | null = null;
  for (const key of [...set].sort()) {
    const cur = parseWeekKey(key);
    if (prev) {
      const expected = { year: prev.year, month: prev.month, week: prev.week + 1 };
      if (expected.week > 4) {
        expected.week = 1;
        expected.month += 1;
        if (expected.month > 12) {
          expected.month = 1;
          expected.year += 1;
        }
      }
      runBest =
        cur.year === expected.year &&
        cur.month === expected.month &&
        cur.week === expected.week
          ? runBest + 1
          : 1;
    } else {
      runBest = 1;
    }
    best = Math.max(best, runBest);
    prev = cur;
  }

  return { current: run, best };
}

/** Average of the user's 1-10 weekly ratings. */
export function averageWeekScore(
  reflections: WeeklyReflection[],
): number | null {
  if (reflections.length === 0) return null;
  const sum = reflections.reduce((n, r) => n + r.weekScore, 0);
  return Math.round((sum / reflections.length) * 10) / 10;
}
