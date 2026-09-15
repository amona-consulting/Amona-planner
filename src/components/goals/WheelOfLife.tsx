import { useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { ChevronRight, Target } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAppData } from "@/lib/store";
import { CATEGORY_COLORS, LIFE_CATEGORIES } from "@/lib/constants";
import type { CategoryId } from "@/lib/types";
import { CategoryGoalEditor } from "./CategoryGoalEditor";

export function WheelOfLife() {
  const { state, upsertGoal } = useAppData();
  const [editing, setEditing] = useState<CategoryId | null>(null);

  const chartData = LIFE_CATEGORIES.filter(
    (c) => (state.goals[c.id]?.score ?? 0) > 0,
  ).map((c) => ({
    area: c.short,
    score: state.goals[c.id]?.score ?? 0,
  }));

  const scoredCount = chartData.length;

  const cycleScore = (id: CategoryId) => {
    const goal = state.goals[id];
    const next = goal ? ((goal.score % 10) + 1) : 1;
    upsertGoal({
      id,
      score: next,
      title: goal?.title ?? "",
      currentSituation: goal?.currentSituation ?? "",
      desiredOutcome: goal?.desiredOutcome ?? "",
      whyItMatters: goal?.whyItMatters ?? "",
      targetDate: goal?.targetDate ?? "",
      measurement: goal?.measurement ?? "",
      progress: goal?.progress ?? 0,
      status: goal?.status ?? "on-track",
    });
  };

  return (
    <>
      <SectionCard
        title="Life Balance Wheel"
        subtitle={scoredCount > 0 ? `${scoredCount}/8 areas rated` : undefined}
      >
        {scoredCount > 0 ? (
          <div className="bg-dots relative rounded-xl p-2">
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={chartData} outerRadius="72%">
                <PolarGrid stroke="hsl(var(--sage-300))" />
                <PolarAngleAxis
                  dataKey="area"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                />
                <PolarRadiusAxis domain={[0, 10]} tickCount={6} tick={false} axisLine={false} />
                <Radar
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.35}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState
            icon={Target}
            title="Shape your year"
            description="Rate each area of your life from 1–10 to build your balance wheel, then set a goal for the ones that matter."
          />
        )}
      </SectionCard>

      <SectionCard title="Your Eight Areas">
        <div className="divide-y divide-border/60">
          {LIFE_CATEGORIES.map((c) => {
            const goal = state.goals[c.id];
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setEditing(c.id)}
                className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-secondary/40"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[c.id] }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {c.label}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {goal?.title || c.hint}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${
                      goal?.score
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {goal?.score ?? "–"}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      cycleScore(c.id);
                    }}
                    aria-label="Next rating"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
                  >
                    <ChevronRight className="h-4 w-4 rotate-90" />
                  </button>
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Tip: reassess your balance every quarter to watch the wheel shift.
        </p>
      </SectionCard>

      <CategoryGoalEditor
        categoryId={editing}
        onClose={() => setEditing(null)}
      />
    </>
  );
}
