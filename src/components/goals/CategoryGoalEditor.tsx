import { useEffect, useState } from "react";
import { Check, Target } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { RatingPicker } from "@/components/shared/RatingPicker";
import { useAppData } from "@/lib/store";
import { CATEGORY_COLORS, LIFE_CATEGORIES } from "@/lib/constants";
import type { CategoryId, Goal } from "@/lib/types";

interface Props {
  categoryId: CategoryId | null;
  onClose: () => void;
}

export function CategoryGoalEditor({ categoryId, onClose }: Props) {
  const { state, upsertGoal } = useAppData();
  const existing = categoryId ? state.goals[categoryId] : undefined;

  const [score, setScore] = useState(existing?.score ?? 5);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [currentSituation, setCurrentSituation] = useState(
    existing?.currentSituation ?? "",
  );
  const [desiredOutcome, setDesiredOutcome] = useState(
    existing?.desiredOutcome ?? "",
  );
  const [whyItMatters, setWhyItMatters] = useState(existing?.whyItMatters ?? "");
  const [targetDate, setTargetDate] = useState(existing?.targetDate ?? "");
  const [measurement, setMeasurement] = useState(existing?.measurement ?? "");
  const [progress, setProgress] = useState(existing?.progress ?? 0);
  const [status, setStatus] = useState<Goal["status"]>(
    existing?.status ?? "on-track",
  );

  useEffect(() => {
    setScore(existing?.score ?? 5);
    setTitle(existing?.title ?? "");
    setCurrentSituation(existing?.currentSituation ?? "");
    setDesiredOutcome(existing?.desiredOutcome ?? "");
    setWhyItMatters(existing?.whyItMatters ?? "");
    setTargetDate(existing?.targetDate ?? "");
    setMeasurement(existing?.measurement ?? "");
    setProgress(existing?.progress ?? 0);
    setStatus(existing?.status ?? "on-track");
  }, [categoryId, existing]);

  if (!categoryId) return null;
  const category = LIFE_CATEGORIES.find((c) => c.id === categoryId)!;
  const color = CATEGORY_COLORS[categoryId];

  const save = () => {
    upsertGoal({
      id: categoryId,
      score,
      title: title.trim(),
      currentSituation: currentSituation.trim(),
      desiredOutcome: desiredOutcome.trim(),
      whyItMatters: whyItMatters.trim(),
      targetDate,
      measurement: measurement.trim(),
      progress,
      status,
    });
    onClose();
  };

  return (
    <Sheet open={!!categoryId} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="max-h-[88vh] overflow-y-auto rounded-t-2xl">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center gap-2 font-display text-lg">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-md"
              style={{ backgroundColor: color, color: "#fff" }}
            >
              <Target className="h-3.5 w-3.5" />
            </span>
            {category.label}
          </SheetTitle>
          <SheetDescription className="text-left">
            Where are you today, and where do you want to be?
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4 pb-6">
          <div>
            <span className="mb-2 block text-xs font-semibold text-muted-foreground">
              How satisfied are you with this area today? (1–10)
            </span>
            <RatingPicker value={score} onChange={setScore} size="sm" />
          </div>

          <div className="grid gap-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Goal — what do I want to achieve?
              </span>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Grow revenue to ₦50m"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Current situation — where am I today?
              </span>
              <Textarea
                value={currentSituation}
                onChange={(e) => setCurrentSituation(e.target.value)}
                rows={2}
                className="resize-none"
                placeholder="Honest snapshot of today…"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Desired outcome — where do I want to be?
              </span>
              <Textarea
                value={desiredOutcome}
                onChange={(e) => setDesiredOutcome(e.target.value)}
                rows={2}
                className="resize-none"
                placeholder="The picture of success…"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Why it matters
              </span>
              <Input
                value={whyItMatters}
                onChange={(e) => setWhyItMatters(e.target.value)}
                placeholder="Why is this important?"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  Target date
                </span>
                <Input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  Status
                </span>
                <Select value={status} onValueChange={(v) => setStatus(v as Goal["status"])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on-track">On Track</SelectItem>
                    <SelectItem value="needs-attention">Needs Attention</SelectItem>
                    <SelectItem value="behind">Behind</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Measurement — how will I know I achieved it?
              </span>
              <Input
                value={measurement}
                onChange={(e) => setMeasurement(e.target.value)}
                placeholder="e.g. Monthly revenue report"
              />
            </label>

            <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  Progress
                </span>
                <span className="text-sm font-bold text-primary">{progress}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-[hsl(var(--primary))]"
              />
            </div>
          </div>

          <Button onClick={save} className="w-full" disabled={!title.trim()}>
            <Check className="h-4 w-4" />
            {existing?.title ? "Save changes" : "Set goal"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
