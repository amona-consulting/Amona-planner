import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Award, Flame, Gauge, TrendingUp } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAppData } from "@/lib/store";
import { accountabilityScore, averageWeekScore, executionRate, streak } from "@/lib/calc";
import { LIFE_CATEGORIES } from "@/lib/constants";
import { formatMonthShort, monthKeyOf, weekKeyOf } from "@/lib/dates";

export function ProgressScreen() {
  const { state } = useAppData();
  const breakdown = accountabilityScore(state);

  const reviewStreak = useMemo(
    () => streak(Object.keys(state.reflections)),
    [state.reflections],
  );
  const planStreak = useMemo(
    () => streak(Object.keys(state.weekly)),
    [state.weekly],
  );

  const weeklyBars = useMemo(() => {
    const year = state.year?.year ?? new Date().getFullYear();
    const keys = Object.keys(state.weekly)
      .filter((k) => k.startsWith(String(year)))
      .sort();
    const bars = keys.map((k) => ({
      week: `W${k.slice(-1)}`,
      rate: executionRate(state.weekly[k]),
    }));
    const reflections = Object.values(state.reflections).filter((r) =>
      r.weekKey.startsWith(String(year)),
    );
    const reviewed = new Set(reflections.map((r) => r.weekKey));
    return bars.map((b, i) => ({
      ...b,
      reviewed: reviewed.has(keys[i]),
    }));
  }, [state.weekly, state.reflections, state.year]);

  const goals = Object.values(state.goals).filter((g) => g?.title);
  const avgScore = averageWeekScore(Object.values(state.reflections));
  const year = state.year?.year ?? new Date().getFullYear();
  const currentMonthLabel = formatMonthShort(monthKeyOf(new Date()));

  return (
    <div className="space-y-4">
      <SectionCard variant="navy" className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-green-500/20 blur-2xl" />
        <div className="flex items-center gap-1 text-xs font-semibold text-green-300">
          <Gauge className="h-4 w-4" />
          Accountability Score
        </div>
        <p className="font-display mt-2 text-5xl font-semibold text-white">
          {breakdown.score}
          <span className="text-lg text-white/50">/100</span>
        </p>
        <p className="mt-1 text-xs text-white/70">
          {breakdown.score === 0
            ? "Plan, execute and review to build your score."
            : breakdown.score >= 80
              ? "Excellent consistency. Keep the loop turning."
              : breakdown.score >= 50
                ? "Good momentum — consistency is building."
                : "Getting started is the win. Small repeats add up."}
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Planned", value: `${breakdown.weeksPlanned}/${breakdown.totalWeeks}` },
            { label: "Reviewed", value: `${breakdown.weeksReviewed}/${breakdown.totalWeeks}` },
            { label: "Execution", value: `${breakdown.executionAvg}%` },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white/5 px-2 py-2">
              <p className="text-sm font-bold text-white">{s.value}</p>
              <p className="text-[10px] text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid grid-cols-2 gap-3">
        <SectionCard title="Review Streak">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-warning" />
            <span className="font-display text-2xl font-semibold text-foreground">
              {reviewStreak.current}
            </span>
            <span className="text-xs text-muted-foreground">weeks</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Best: {reviewStreak.best}
          </p>
        </SectionCard>
        <SectionCard title="Planning Streak">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-warning" />
            <span className="font-display text-2xl font-semibold text-foreground">
              {planStreak.current}
            </span>
            <span className="text-xs text-muted-foreground">weeks</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Best: {planStreak.best}
          </p>
        </SectionCard>
      </div>

      <SectionCard
        icon={TrendingUp}
        title={`${year} · Weekly Execution`}
        subtitle={currentMonthLabel}
      >
        {weeklyBars.length === 0 ? (
          <EmptyState
            icon={TrendingUp}
            title="No weekly plans yet"
            description="Plan your week in the Planner and your execution rate will appear here."
          />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyBars} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
              <XAxis
                dataKey="week"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--secondary))" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid hsl(var(--border))",
                  fontSize: 12,
                }}
                formatter={(value: number) => [`${value}%`, "Execution"]}
              />
              <Bar dataKey="rate" radius={[6, 6, 0, 0]} maxBarSize={28}>
                {weeklyBars.map((b, i) => (
                  <Cell key={i} fill={b.reviewed ? "hsl(var(--primary))" : "hsl(var(--sage-300))"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
        <p className="mt-2 text-[11px] text-muted-foreground">
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-primary" />
          reviewed week
          <span className="mx-2 inline-block h-2 w-2 rounded-full bg-sage-300" />
          planned, not reviewed
        </p>
      </SectionCard>

      {avgScore !== null && (
        <SectionCard title="Average Week Rating">
          <div className="flex items-center gap-3">
            <Award className="h-6 w-6 text-warning" />
            <span className="font-display text-3xl font-semibold text-foreground">
              {avgScore}
            </span>
            <span className="text-xs text-muted-foreground">/10 across reviews</span>
          </div>
        </SectionCard>
      )}

      {goals.length > 0 && (
        <SectionCard
          title="Goal Progress"
          subtitle={`Your ${year} goals`}
        >
          <div className="space-y-3">
            {goals.map((g) => {
              const cat = LIFE_CATEGORIES.find((c) => c.id === g.id);
              return (
                <div key={g.id}>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-semibold text-foreground">
                      <span className="mr-1.5 text-muted-foreground">{cat?.short}:</span>
                      {g.title}
                    </span>
                    <span className="shrink-0 text-xs font-bold text-primary">
                      {g.progress}%
                    </span>
                  </div>
                  <ProgressBar
                    value={g.progress}
                    tone={
                      g.status === "on-track"
                        ? "success"
                        : g.status === "needs-attention"
                          ? "warning"
                          : "danger"
                    }
                  />
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
