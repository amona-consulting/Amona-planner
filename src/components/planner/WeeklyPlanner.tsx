import { useState } from "react";
import { Check, ListChecks, Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionCard } from "@/components/shared/SectionCard";
import { useAppData } from "@/lib/store";
import { LIFE_CATEGORIES, uid } from "@/lib/constants";
import {
  currentWeekIndex,
  formatMonth,
  monthKeyOf,
  recentMonthKeys,
  weekKeyOf,
} from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { CategoryId, WeeklyPriority } from "@/lib/types";

export function WeeklyPlanner() {
  const { state, upsertWeekly } = useAppData();
  const year = new Date().getFullYear();
  const monthKeys = recentMonthKeys(year, 12);

  const [monthKey, setMonthKey] = useState(monthKeyOf(new Date()));
  const [weekIndex, setWeekIndex] = useState(currentWeekIndex());

  const weekKey = weekKeyOf(monthKey, weekIndex);
  const existing = state.weekly[weekKey];

  const [outcome, setOutcome] = useState(existing?.outcome ?? "");
  const [priorities, setPriorities] = useState<WeeklyPriority[]>(
    existing?.priorities ?? [],
  );
  const [personalCommitment, setPersonalCommitment] = useState(
    existing?.personalCommitment ?? "",
  );
  const [actionDraft, setActionDraft] = useState<Record<string, string>>({});

  const isCurrentWeek =
    monthKey === monthKeyOf(new Date()) &&
    weekIndex === currentWeekIndex();
  const reviewed = !!state.reflections[weekKey];

  const save = () => {
    upsertWeekly({
      weekKey,
      outcome: outcome.trim(),
      priorities,
      personalCommitment: personalCommitment.trim(),
      plannedAt: new Date().toISOString(),
    });
  };

  const patchPriority = (
    id: string,
    patch: Partial<WeeklyPriority>,
  ) =>
    setPriorities((arr) =>
      arr.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    );

  const addPriority = () =>
    setPriorities((arr) => [
      ...arr,
      { id: uid(), title: "", actions: [], done: false },
    ]);

  const addAction = (priorityId: string) => {
    const text = actionDraft[priorityId]?.trim();
    if (!text) return;
    patchPriority(priorityId, {
      actions: [
        ...(priorities.find((p) => p.id === priorityId)?.actions ?? []),
        { id: uid(), text, done: false },
      ],
    });
    setActionDraft((d) => ({ ...d, [priorityId]: "" }));
  };

  const goalsWithTitle = Object.values(state.goals).filter((g) => g?.title);
  const weekLabel = `Week ${weekIndex} · ${formatMonth(monthKey)}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select value={monthKey} onValueChange={setMonthKey}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {monthKeys.map((k) => (
              <SelectItem key={k} value={k}>
                {formatMonth(k)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWeekIndex(w)}
              className={cn(
                "h-9 w-9 rounded-full text-xs font-bold transition-colors",
                w === weekIndex
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground",
              )}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground">{weekLabel}</p>
        <div className="flex gap-1.5">
          {isCurrentWeek && (
            <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase text-primary">
              Current
            </span>
          )}
          {reviewed && (
            <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-[10px] font-bold uppercase text-success">
              <Check className="h-3 w-3" /> Reviewed
            </span>
          )}
        </div>
      </div>

      <SectionCard
        title="The Most Important Outcome This Week"
        subtitle="One primary outcome"
        action={
          <Button size="sm" onClick={save}>
            <Save className="h-4 w-4" />
            Save
          </Button>
        }
      >
        <Input
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          placeholder="e.g. Secure the ABC Ltd proposal"
        />
      </SectionCard>

      <SectionCard
        icon={ListChecks}
        title="My Top Priorities"
        subtitle="Preferably no more than 3–5"
        action={
          priorities.length < 5 ? (
            <Button size="sm" variant="outline" onClick={addPriority}>
              <Plus className="h-4 w-4" />
              Priority
            </Button>
          ) : undefined
        }
      >
        <div className="space-y-2.5">
          {priorities.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-border/70 bg-secondary/30 p-2.5"
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => patchPriority(p.id, { done: !p.done })}
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                    p.done
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-transparent",
                  )}
                  aria-label="Toggle done"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <Input
                  value={p.title}
                  onChange={(e) => patchPriority(p.id, { title: e.target.value })}
                  placeholder="Priority…"
                  className={cn(
                    "h-9 flex-1",
                    p.done && "line-through opacity-60",
                  )}
                />
                <Select
                  value={p.goalId ?? ""}
                  onValueChange={(v) =>
                    patchPriority(p.id, {
                      goalId: (v || undefined) as CategoryId | undefined,
                    })
                  }
                >
                  <SelectTrigger className="h-9 w-[92px] text-xs">
                    <SelectValue placeholder="Goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {goalsWithTitle.map((g) => (
                      <SelectItem key={g.id} value={g.id} className="text-xs">
                        {LIFE_CATEGORIES.find((c) => c.id === g.id)?.short}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  type="button"
                  onClick={() =>
                    setPriorities((arr) => arr.filter((x) => x.id !== p.id))
                  }
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-danger"
                  aria-label="Remove priority"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mt-2 space-y-1.5 pl-8">
                {p.actions.map((a) => (
                  <div key={a.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        patchPriority(p.id, {
                          actions: p.actions.map((x) =>
                            x.id === a.id ? { ...x, done: !x.done } : x,
                          ),
                        })
                      }
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                        a.done
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-transparent",
                      )}
                      aria-label="Toggle action"
                    >
                      <Check className="h-2.5 w-2.5" />
                    </button>
                    <span
                      className={cn(
                        "flex-1 text-xs",
                        a.done
                          ? "line-through opacity-50"
                          : "text-foreground",
                      )}
                    >
                      {a.text}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        patchPriority(p.id, {
                          actions: p.actions.filter((x) => x.id !== a.id),
                        })
                      }
                      className="text-muted-foreground hover:text-danger"
                      aria-label="Remove action"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    value={actionDraft[p.id] ?? ""}
                    onChange={(e) =>
                      setActionDraft((d) => ({ ...d, [p.id]: e.target.value }))
                    }
                    onKeyDown={(e) => e.key === "Enter" && addAction(p.id)}
                    placeholder="Add an action…"
                    className="h-7 flex-1 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => addAction(p.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:text-primary"
                    aria-label="Add action"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {priorities.length === 0 && (
            <button
              type="button"
              onClick={addPriority}
              className="w-full rounded-xl border border-dashed border-border/80 px-3 py-3 text-xs text-muted-foreground hover:border-primary/40"
            >
              + Add your first priority for this week
            </button>
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Personal Commitment"
        subtitle="One thing I will do for myself this week"
      >
        <Input
          value={personalCommitment}
          onChange={(e) => setPersonalCommitment(e.target.value)}
          placeholder="e.g. Gym twice, one evening off"
        />
      </SectionCard>

      {priorities.length > 0 && (
        <Button onClick={save} className="w-full">
          <Save className="h-4 w-4" />
          Save Week {weekIndex}
        </Button>
      )}
    </div>
  );
}
