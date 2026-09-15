import { Compass, Gauge, Quote } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { formatMonth, parseWeekKey } from "@/lib/dates";
import type { WeeklyReflection } from "@/lib/types";

export function ReflectionDetail({
  reflection,
}: {
  reflection: WeeklyReflection;
}) {
  const { year, month, week } = parseWeekKey(reflection.weekKey);
  const monthKey = `${year}-${String(month).padStart(2, "0")}`;

  const groups: { key: keyof WeeklyReflection; label: string; items: string[] }[] = [
    { key: "wins", label: "Wins", items: reflection.wins },
    { key: "fails", label: "Fails", items: reflection.fails },
    { key: "learnings", label: "AHA's / Learnings", items: reflection.learnings },
    { key: "tweaks", label: "Tweaks", items: reflection.tweaks },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-border/70 bg-secondary/30 p-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Week Score
          </p>
          <p className="font-display text-2xl font-semibold text-primary">
            {reflection.weekScore}
            <span className="text-sm text-muted-foreground">/10</span>
          </p>
        </div>
        <div className="rounded-xl border border-border/70 bg-secondary/30 p-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Execution
          </p>
          <p className="font-display text-2xl font-semibold text-foreground">
            {reflection.executionRate}%
          </p>
        </div>
      </div>

      {groups.map(
        (g) =>
          g.items.length > 0 && (
            <SectionCard key={g.key} title={g.label}>
              <ul className="space-y-1.5">
                {g.items.map((item, i) => (
                  <li key={i} className="text-sm leading-snug text-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </SectionCard>
          ),
      )}

      {reflection.strategy && (
        <SectionCard title="Strategy">
          <p className="text-sm leading-relaxed text-foreground">{reflection.strategy}</p>
        </SectionCard>
      )}

      {reflection.connect.length > 0 && (
        <SectionCard title="Who I'm Connecting With">
          <ul className="space-y-1.5">
            {reflection.connect.map((c) => (
              <li key={c.id} className="text-sm text-foreground">
                <span className="font-semibold">{c.name}</span>
                {c.note && <span className="text-muted-foreground"> — {c.note}</span>}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {reflection.inspiration && (
        <SectionCard icon={Quote} title="Your Word">
          <p className="font-display text-lg font-medium italic text-foreground">
            "{reflection.inspiration}"
          </p>
        </SectionCard>
      )}
    </div>
  );
}
