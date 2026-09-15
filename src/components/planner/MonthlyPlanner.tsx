import { useState } from "react";
import { ArrowDown, Check, Heart, Plus, Save, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionCard } from "@/components/shared/SectionCard";
import { ListAdd } from "@/components/shared/ListAdd";
import { useAppData } from "@/lib/store";
import { LIFE_CATEGORIES, SELF_CARE_CATEGORIES, uid } from "@/lib/constants";
import { formatMonth, monthKeyOf, recentMonthKeys } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { CategoryId } from "@/lib/types";

export function MonthlyPlanner() {
  const { state, upsertMonthly } = useAppData();
  const year = new Date().getFullYear();
  const monthKeys = recentMonthKeys(year, 12);
  const [monthKey, setMonthKey] = useState(monthKeyOf(new Date()));

  const plan = state.monthly[monthKey] ?? {
    monthKey,
    objectives: [],
    top3: [],
    mustHappen: "",
    sayNoTo: "",
    selfCare: [],
  };

  const [objectives, setObjectives] = useState(plan.objectives);
  const [top3, setTop3] = useState(plan.top3);
  const [mustHappen, setMustHappen] = useState(plan.mustHappen);
  const [sayNoTo, setSayNoTo] = useState(plan.sayNoTo);
  const [selfCare, setSelfCare] = useState(plan.selfCare);
  const [selfCareText, setSelfCareText] = useState("");
  const [selfCareCat, setSelfCareCat] = useState(SELF_CARE_CATEGORIES[0]);

  const isCurrent = monthKey === monthKeyOf(new Date());
  const goalsWithTitle = Object.values(state.goals).filter((g) => g?.title);

  const save = () => {
    upsertMonthly({
      monthKey,
      objectives,
      top3,
      mustHappen,
      sayNoTo,
      selfCare,
    });
  };

  const patchObjective = (id: string, patch: Partial<(typeof objectives)[number]>) =>
    setObjectives((arr) => arr.map((o) => (o.id === id ? { ...o, ...patch } : o)));

  const addSelfCare = () => {
    const text = selfCareText.trim();
    if (!text) return;
    setSelfCare((arr) => [...arr, { id: uid(), text, category: selfCareCat }]);
    setSelfCareText("");
  };

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
        {isCurrent && (
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
            Current
          </span>
        )}
      </div>

      <SectionCard
        title={isCurrent ? "It's a new month. Let's decide what matters most." : formatMonth(monthKey)}
        subtitle="3–5 objectives, each able to link back to an annual goal"
        action={
          <Button size="sm" onClick={save}>
            <Save className="h-4 w-4" />
            Save
          </Button>
        }
      >
        <div className="space-y-2">
          {objectives.map((obj) => (
            <div
              key={obj.id}
              className="flex items-center gap-2 rounded-xl border border-border/70 bg-secondary/30 p-2"
            >
              <button
                type="button"
                onClick={() => patchObjective(obj.id, { done: !obj.done })}
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                  obj.done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-transparent",
                )}
                aria-label="Toggle done"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <Input
                value={obj.title}
                onChange={(e) => patchObjective(obj.id, { title: e.target.value })}
                placeholder="Monthly objective…"
                className={cn("h-9 flex-1", obj.done && "line-through opacity-60")}
              />
              <Select
                value={obj.goalId ?? ""}
                onValueChange={(v) =>
                  patchObjective(obj.id, { goalId: (v || undefined) as CategoryId | undefined })
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
                onClick={() => setObjectives((arr) => arr.filter((o) => o.id !== obj.id))}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-danger"
                aria-label="Remove objective"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {objectives.length < 5 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() =>
                setObjectives((arr) => [
                  ...arr,
                  { id: uid(), title: "", done: false },
                ])
              }
            >
              <Plus className="h-4 w-4" />
              Add objective
            </Button>
          )}
        </div>
      </SectionCard>

      <SectionCard title="My Top 3 Priorities" subtitle="What must happen this month?">
        <ListAdd
          items={top3}
          onChange={setTop3}
          max={3}
          placeholder="e.g. Generate ₦5m revenue"
        />
      </SectionCard>

      <SectionCard title="What Must Happen This Month?">
        <Textarea
          value={mustHappen}
          onChange={(e) => setMustHappen(e.target.value)}
          rows={2}
          className="resize-none"
          placeholder="The single most important outcome for this month…"
        />
      </SectionCard>

      <SectionCard title="What Will I Say No To?">
        <p className="mb-2 text-xs text-muted-foreground">
          Naming the distractions keeps your month from overflowing.
        </p>
        <Textarea
          value={sayNoTo}
          onChange={(e) => setSayNoTo(e.target.value)}
          rows={2}
          className="resize-none"
          placeholder="e.g. New projects before Q3 targets…"
        />
      </SectionCard>

      <SectionCard icon={Heart} title="Self-Care" subtitle="What will you do for yourself this month?">
        <div className="mb-3 flex items-center gap-2">
          <Input
            value={selfCareText}
            onChange={(e) => setSelfCareText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSelfCare()}
            placeholder="e.g. Walk 3 times weekly"
            className="h-9 flex-1"
          />
          <Select value={selfCareCat} onValueChange={setSelfCareCat}>
            <SelectTrigger className="h-9 w-[110px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SELF_CARE_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c} className="text-xs">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          {selfCare.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 rounded-xl border border-border/70 bg-secondary/30 px-3 py-2.5"
            >
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                {item.category}
              </span>
              <span className="flex-1 text-sm">{item.text}</span>
              <button
                type="button"
                onClick={() => setSelfCare((arr) => arr.filter((s) => s.id !== item.id))}
                className="text-muted-foreground hover:text-danger"
                aria-label="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {selfCare.length === 0 && selfCareText.trim() === "" && (
            <button
              type="button"
              onClick={addSelfCare}
              className="w-full rounded-xl border border-dashed border-border/80 px-3 py-2.5 text-xs text-muted-foreground hover:border-primary/40"
            >
              Add a commitment to yourself
            </button>
          )}
        </div>
      </SectionCard>

      <div className="flex flex-col items-center gap-1 rounded-2xl border border-dashed border-border/70 bg-secondary/20 p-3 text-center">
        <ArrowDown className="h-4 w-4 text-primary" />
        <p className="text-xs text-muted-foreground">
          Save the month, then break it into weekly commitments in the Week tab.
        </p>
      </div>
    </div>
  );
}
