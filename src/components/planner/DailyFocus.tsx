import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Save, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/shared/SectionCard";
import { useAppData } from "@/lib/store";
import { dateKeyOf, formatDate, todayKey, tomorrowKey } from "@/lib/dates";
import { uid } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { DailyFocus, DailyTask } from "@/lib/types";

const emptyEntry = (dateKey: string): DailyFocus => ({
  dateKey,
  mit: { id: "mit", text: "", done: false },
  otherTasks: [],
  outcome: null,
});

export function DailyFocus() {
  const { state, upsertDaily, setDailyOutcome } = useAppData();
  const [dateKey, setDateKey] = useState(todayKey());

  const existing = state.daily[dateKey];
  const [mit, setMit] = useState<DailyTask>(existing?.mit ?? emptyEntry(dateKey).mit);
  const [otherTasks, setOtherTasks] = useState<DailyTask[]>(
    existing?.otherTasks ?? [],
  );
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);

  const isToday = dateKey === todayKey();
  const isPast = dateKey < todayKey();

  const save = () => {
    upsertDaily({ dateKey, mit, otherTasks, outcome: existing?.outcome ?? null });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const addTask = () => {
    const text = draft.trim();
    if (!text || otherTasks.length >= 3) return;
    setOtherTasks((arr) => [...arr, { id: uid(), text, done: false }]);
    setDraft("");
  };

  const moveToTomorrow = () => {
    const tomKey = tomorrowKey();
    const tomorrow = state.daily[tomKey] ?? emptyEntry(tomKey);
    const pendingTasks = otherTasks.filter((t) => !t.done);
    upsertDaily({
      ...tomorrow,
      mit: {
        id: tomorrow.mit.id,
        text: tomorrow.mit.text || mit.text,
        done: false,
      },
      otherTasks: [
        ...tomorrow.otherTasks,
        ...pendingTasks.filter(
          (t) => !tomorrow.otherTasks.some((x) => x.text === t.text),
        ),
      ],
    });
    setDailyOutcome(dateKey, "moved");
  };

  const outcomeButton = (label: string, tone: "success" | "default" | "danger", action: () => void) => (
    <Button
      variant={tone === "default" ? "outline" : tone === "success" ? "default" : "ghost"}
      size="sm"
      className={cn(
        tone === "success" && "bg-success text-success-foreground hover:bg-success/90",
        tone === "danger" && "text-destructive hover:text-destructive",
      )}
      onClick={action}
    >
      {tone === "success" && <Check className="h-4 w-4" />}
      {label}
    </Button>
  );

  return (
    <div className="space-y-4">
      <SectionCard
        icon={Sun}
        title="What's the ONE thing that must happen today?"
        subtitle="Keep it deliberately simple"
        action={
          <Button size="sm" onClick={save} variant={saved ? "secondary" : "default"}>
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "Saved" : "Save"}
          </Button>
        }
      >
        <div className="mb-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const d = new Date(dateKey + "T00:00:00");
              d.setDate(d.getDate() - 1);
              setDateKey(dateKeyOf(d));
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
            aria-label="Previous day"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="flex-1 text-center text-sm font-semibold text-foreground">
            {formatDate(dateKey)}
            {isToday && (
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                Today
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={() => {
              const d = new Date(dateKey + "T00:00:00");
              d.setDate(d.getDate() + 1);
              if (dateKeyOf(d) <= todayKey()) setDateKey(dateKeyOf(d));
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground disabled:opacity-30"
            disabled={isToday}
            aria-label="Next day"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMit({ ...mit, done: !mit.done })}
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors",
              mit.done
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-transparent",
            )}
            aria-label="Toggle done"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <Input
            value={mit.text}
            onChange={(e) => setMit({ ...mit, text: e.target.value, done: false })}
            placeholder="Today's most important task…"
            className={cn(mit.done && "line-through opacity-60")}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Other Important Tasks"
        subtitle="Maximum 3"
        action={
          otherTasks.length < 3 ? (
            <button
              type="button"
              onClick={addTask}
              className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground"
            >
              + Add task
            </button>
          ) : undefined
        }
      >
        <div className="space-y-2">
          {otherTasks.map((t) => (
            <div key={t.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setOtherTasks((arr) =>
                    arr.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)),
                  )
                }
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                  t.done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-transparent",
                )}
                aria-label="Toggle done"
              >
                <Check className="h-3 w-3" />
              </button>
              <span
                className={cn(
                  "flex-1 text-sm",
                  t.done ? "line-through opacity-50" : "text-foreground",
                )}
              >
                {t.text}
              </span>
              <button
                type="button"
                onClick={() =>
                  setOtherTasks((arr) => arr.filter((x) => x.id !== t.id))
                }
                className="text-muted-foreground hover:text-danger"
                aria-label="Remove task"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {otherTasks.length < 3 && (
            <div className="flex items-center gap-2">
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder="Add another task…"
                className="h-9 text-xs"
              />
              <Button size="sm" onClick={addTask} disabled={!draft.trim()}>
                Add
              </Button>
            </div>
          )}
        </div>
      </SectionCard>

      {(isToday || isPast) && (mit.text.trim() || otherTasks.length > 0) && (
        <SectionCard title="End of Day" subtitle="Did you complete your most important task?">
          {existing?.outcome === "done" && (
            <p className="mb-3 rounded-xl bg-success/10 px-3 py-2 text-xs font-semibold text-success">
              Marked complete — great follow-through today.
            </p>
          )}
          {existing?.outcome === "moved" && (
            <p className="mb-3 rounded-xl bg-warning/10 px-3 py-2 text-xs font-semibold text-warning">
              Moved to tomorrow. Stay accountable to it.
            </p>
          )}
          {existing?.outcome === "removed" && (
            <p className="mb-3 rounded-xl bg-secondary px-3 py-2 text-xs font-semibold text-muted-foreground">
              Removed. It's okay to let go of what doesn't matter.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {outcomeButton(
              "Complete",
              "success",
              () => setDailyOutcome(dateKey, "done"),
            )}
            {outcomeButton(
              "Move to tomorrow",
              "default",
              moveToTomorrow,
            )}
            {outcomeButton(
              "Remove",
              "danger",
              () => setDailyOutcome(dateKey, "removed"),
            )}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
