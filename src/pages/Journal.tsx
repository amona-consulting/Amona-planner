import { useMemo, useState } from "react";
import { BookOpen, ChevronRight, PenLine } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { EmptyState } from "@/components/shared/EmptyState";
import { ReflectionForm } from "@/components/journal/ReflectionForm";
import { ReflectionDetail } from "@/components/journal/ReflectionDetail";
import { useAppData } from "@/lib/store";
import { currentWeekIndex, formatMonthShort, monthKeyOf, weekKeyOf } from "@/lib/dates";
import type { WeeklyReflection } from "@/lib/types";

export function JournalPage() {
  const { state } = useAppData();
  const [openNew, setOpenNew] = useState(false);
  const [selected, setSelected] = useState<WeeklyReflection | null>(null);

  const reflections = useMemo(
    () => Object.values(state.reflections).sort((a, b) => (a.weekKey < b.weekKey ? 1 : -1)),
    [state.reflections],
  );

  const grouped = useMemo(() => {
    const groups: { monthKey: string; items: WeeklyReflection[] }[] = [];
    for (const r of reflections) {
      const monthKey = r.weekKey.slice(0, 7);
      const last = groups[groups.length - 1];
      if (last && last.monthKey === monthKey) last.items.push(r);
      else groups.push({ monthKey, items: [r] });
    }
    return groups;
  }, [reflections]);

  const now = new Date();
  const currentWeekKey = weekKeyOf(monthKeyOf(now), currentWeekIndex());

  return (
    <MobileLayout title="Journal" subtitle="Your reflections, reviewed">
      <div className="space-y-5">
        <Button className="w-full" onClick={() => setOpenNew(true)}>
          <PenLine className="h-4 w-4" />
          New weekly review
        </Button>

        {reflections.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Your journal is waiting"
            description="At the end of each week, take five minutes to capture your wins, misses, learnings and tweaks. They become your personal playbook."
            actionLabel="Write this week's review"
            onAction={() => setOpenNew(true)}
          />
        ) : (
          grouped.map((g) => (
            <div key={g.monthKey}>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {formatMonthShort(g.monthKey)}
              </h3>
              <div className="space-y-2">
                {g.items.map((r) => (
                  <button
                    key={r.weekKey}
                    type="button"
                    onClick={() => setSelected(r)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-border/70 bg-card p-3.5 text-left shadow-card transition-colors hover:border-primary/30"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-display text-sm font-semibold text-primary">
                      W{r.weekKey.slice(-1)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {r.wins[0] ?? "This week's review"}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {r.wins.length} win{r.wins.length === 1 ? "" : "s"} ·{" "}
                        {r.learnings.length} learning
                        {r.learnings.length === 1 ? "" : "s"}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                        {r.weekScore}/10
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <Sheet open={openNew} onOpenChange={setOpenNew}>
        <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-2xl">
          <SheetHeader className="text-left">
            <SheetTitle className="font-display text-lg">Weekly Review</SheetTitle>
            <SheetDescription className="text-left">
              How did your week go?
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 pb-6">
            <ReflectionForm weekKey={currentWeekKey} onDone={() => setOpenNew(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-2xl">
          <SheetHeader className="text-left">
            <SheetTitle className="font-display text-lg">Review</SheetTitle>
            <SheetDescription className="text-left">
              {selected ? formatMonthShort(selected.weekKey.slice(0, 7)) : ""}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 pb-6">
            {selected && <ReflectionDetail reflection={selected} />}
          </div>
        </SheetContent>
      </Sheet>
    </MobileLayout>
  );
}
