import { useState } from "react";
import { Check, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "@/components/shared/SectionCard";
import { ListAdd } from "@/components/shared/ListAdd";
import { RatingPicker } from "@/components/shared/RatingPicker";
import { useAppData } from "@/lib/store";
import { CONNECT_ROLE_HINTS, REFLECTION_SECTIONS, uid } from "@/lib/constants";
import { executionRate } from "@/lib/calc";
import { formatMonth, parseWeekKey } from "@/lib/dates";
import type { ConnectPerson } from "@/lib/types";

export function ReflectionForm({
  weekKey,
  onDone,
}: {
  weekKey: string;
  onDone?: () => void;
}) {
  const { state, upsertReflection } = useAppData();
  const existing = state.reflections[weekKey];
  const plan = state.weekly[weekKey];
  const rate = plan ? executionRate(plan) : 0;

  const [wins, setWins] = useState<string[]>(existing?.wins ?? []);
  const [fails, setFails] = useState<string[]>(existing?.fails ?? []);
  const [learnings, setLearnings] = useState<string[]>(existing?.learnings ?? []);
  const [tweaks, setTweaks] = useState<string[]>(existing?.tweaks ?? []);
  const [strategy, setStrategy] = useState(existing?.strategy ?? "");
  const [connect, setConnect] = useState<ConnectPerson[]>(existing?.connect ?? []);
  const [inspiration, setInspiration] = useState(existing?.inspiration ?? "");
  const [weekScore, setWeekScore] = useState(existing?.weekScore ?? 7);

  const [personName, setPersonName] = useState("");
  const [personNote, setPersonNote] = useState("");

  const { year, month, week } = parseWeekKey(weekKey);
  const monthKey = `${year}-${String(month).padStart(2, "0")}`;

  const addPerson = () => {
    const name = personName.trim();
    if (!name) return;
    setConnect((arr) => [...arr, { id: uid(), name, note: personNote.trim() }]);
    setPersonName("");
    setPersonNote("");
  };

  const save = () => {
    upsertReflection({
      weekKey,
      wins,
      fails,
      learnings,
      tweaks,
      strategy: strategy.trim(),
      connect,
      inspiration: inspiration.trim(),
      weekScore,
      executionRate: rate,
      completedAt: new Date().toISOString(),
    });
    onDone?.();
  };

  const completeEnough =
    wins.length > 0 || fails.length > 0 || learnings.length > 0 || strategy.trim() !== "";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-medium text-foreground">
          Week {week} · {formatMonth(monthKey)}
        </h3>
        {plan ? (
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
            Execution: {rate}%
          </span>
        ) : (
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            No weekly plan yet
          </span>
        )}
      </div>

      {REFLECTION_SECTIONS.map((s) => (
        <SectionCard key={s.key} title={s.title} subtitle={s.hint}>
          <ListAdd
            items={
              s.key === "wins"
                ? wins
                : s.key === "fails"
                  ? fails
                  : s.key === "learnings"
                    ? learnings
                    : tweaks
            }
            onChange={(items) =>
              s.key === "wins"
                ? setWins(items)
                : s.key === "fails"
                  ? setFails(items)
                  : s.key === "learnings"
                    ? setLearnings(items)
                    : setTweaks(items)
            }
            addLabel={s.addLabel}
            placeholder={s.addLabel + "…"}
          />
        </SectionCard>
      ))}

      <SectionCard title="Strategy" subtitle="Based on what happened, what will you do differently?">
        <Textarea
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
          rows={3}
          className="resize-none"
          placeholder="Your adjusted game plan for next week…"
        />
      </SectionCard>

      <SectionCard title="Connect" subtitle="Who do you need to reach out to?">
        <div className="mb-2 flex flex-wrap gap-1">
          {CONNECT_ROLE_HINTS.map((h) => (
            <span
              key={h}
              className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
            >
              {h}
            </span>
          ))}
        </div>
        <div className="space-y-2">
          {connect.map((c) => (
            <div key={c.id} className="flex items-center gap-2 rounded-xl border border-border/70 bg-secondary/30 px-3 py-2">
              <span className="flex-1">
                <span className="block text-sm font-semibold text-foreground">{c.name}</span>
                {c.note && <span className="block text-xs text-muted-foreground">{c.note}</span>}
              </span>
              <button
                type="button"
                onClick={() => setConnect((arr) => arr.filter((x) => x.id !== c.id))}
                className="text-muted-foreground hover:text-danger"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-end gap-2">
          <div className="flex-1 space-y-1.5">
            <Input
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="Name…"
              className="h-9"
            />
            <Input
              value={personNote}
              onChange={(e) => setPersonNote(e.target.value)}
              placeholder="Why? (optional)"
              className="h-9"
            />
          </div>
          <Button size="sm" onClick={addPerson} disabled={!personName.trim()}>
            <UserPlus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Inspiration / Word" subtitle="A quote, scripture, affirmation or reminder">
        <Input
          value={inspiration}
          onChange={(e) => setInspiration(e.target.value)}
          placeholder="e.g. Consistency"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Your word carries onto your home screen next week.
        </p>
      </SectionCard>

      <SectionCard title="Overall, how would you rate this week?">
        <RatingPicker value={weekScore} onChange={setWeekScore} />
      </SectionCard>

      <Button onClick={save} disabled={!completeEnough} className="w-full">
        <Check className="h-4 w-4" />
        {existing ? "Update review" : "Complete weekly review"}
      </Button>
    </div>
  );
}
