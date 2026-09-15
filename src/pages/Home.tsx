import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  PenLine,
  Quote,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { SectionCard } from "@/components/shared/SectionCard";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { ReflectionForm } from "@/components/journal/ReflectionForm";
import { useAppData } from "@/lib/store";
import { accountabilityScore, executionRate } from "@/lib/calc";
import {
  currentWeekIndex,
  formatDate,
  monthKeyOf,
  todayKey,
  weekKeyOf,
} from "@/lib/dates";

export function HomePage() {
  const { state } = useAppData();
  const [openReview, setOpenReview] = useState(false);

  const now = new Date();
  const today = todayKey();
  const todayEntry = state.daily[today];
  const weekKey = weekKeyOf(monthKeyOf(now), currentWeekIndex());
  const weekPlan = state.weekly[weekKey];
  const reflection = state.reflections[weekKey];

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const priorities = weekPlan?.priorities ?? [];
  const doneCount = priorities.filter((p) => p.done).length;
  const weekPercent =
    priorities.length > 0
      ? Math.round((doneCount / priorities.length) * 100)
      : weekPlan
        ? executionRate(weekPlan)
        : 0;

  const mainGoal = useMemo(() => {
    const goals = Object.values(state.goals).filter((g) => g?.title);
    if (goals.length === 0) return null;
    return [...goals].sort((a, b) => a.progress - b.progress)[0];
  }, [state.goals]);

  const score = accountabilityScore(state).score;

  const word = useMemo(() => {
    const latest = Object.values(state.reflections)
      .sort((a, b) => (a.weekKey < b.weekKey ? 1 : -1))
      .find((r) => r.inspiration);
    return latest?.inspiration;
  }, [state.reflections]);

  const overduePriorities = priorities.filter((p) => !p.done).slice(0, 2);
  const attentionItems: { text: string; to: string }[] = [];
  if (overduePriorities.length > 0) {
    attentionItems.push({
      text: `${overduePriorities.length} priorit${
        overduePriorities.length === 1 ? "y" : "ies"
      } not yet complete`,
      to: "/planner",
    });
  }
  if (weekPlan && !reflection) {
    attentionItems.push({
      text: "Weekly review due — take five minutes",
      to: "/journal",
    });
  }

  const startLabel = state.year?.theme
    ? state.year.theme.toUpperCase()
    : "BEGIN";

  return (
    <MobileLayout>
      {/* Hero */}
      <div className="relative mb-4 overflow-hidden rounded-2xl bg-navy-900 p-5 text-white shadow-card">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-green-500/25 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-8 h-32 w-32 rounded-full bg-green-300/10 blur-2xl" />
        <p className="text-xs font-semibold text-green-300">
          {greeting}
          {state.profile.name ? `, ${state.profile.name}` : ""} ·{" "}
          {formatDate(today)}
        </p>
        <h1 className="font-display mt-1 text-2xl font-medium leading-snug tracking-tight">
          {todayEntry?.mit.text ||
            "What's the one thing that must happen today?"}
        </h1>
        {todayEntry?.mit.text && (
          <div className="mt-3">
            <Link
              to="/planner"
              className="inline-flex items-center gap-1.5 rounded-full bg-green-500 px-3.5 py-1.5 text-xs font-bold text-navy-950 hover:bg-green-400"
            >
              {todayEntry.mit.done ? "Completed today" : "Mark complete"}
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
            Theme · {startLabel}
          </span>
          {word && (
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-green-300">
              <Quote className="h-3 w-3" />
              {word}
            </span>
          )}
        </div>
      </div>

      {/* This Week */}
      <Link to="/planner">
        <SectionCard
          title="This Week"
          subtitle={
            priorities.length > 0
              ? `${doneCount} of ${priorities.length} priorities completed`
              : weekPlan
                ? "Week planned — add priorities to track"
                : "No plan for this week yet"
          }
        >
          {priorities.length > 0 ? (
            <>
              <ProgressBar value={weekPercent} tone={weekPercent >= 70 ? "success" : weekPercent >= 40 ? "warning" : "danger"} />
              <p className="mt-1.5 text-right text-xs font-bold text-primary">
                {weekPercent}%
              </p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">
              Break your month into this week's commitments in the Planner.
            </p>
          )}
        </SectionCard>
      </Link>

      {/* Main Goal */}
      {mainGoal ? (
        <Link to="/goals">
          <SectionCard title="Your Main Goal" subtitle={mainGoal.status.replace("-", " ")}>
            <p className="mb-2 text-sm font-semibold text-foreground">{mainGoal.title}</p>
            <ProgressBar
              value={mainGoal.progress}
              tone={
                mainGoal.status === "on-track"
                  ? "success"
                  : mainGoal.status === "needs-attention"
                    ? "warning"
                    : "danger"
              }
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              {mainGoal.progress}% complete
            </p>
          </SectionCard>
        </Link>
      ) : (
        <SectionCard title="Your Main Goal">
          <EmptyState
            icon={Target}
            title="Set your year's goals"
            description="Choose the areas of life that matter and give each one a target."
            className="border-0 bg-transparent py-4"
          />
          <Link
            to="/goals"
            className="mt-1 block w-full rounded-xl bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground"
          >
            Set my goals
          </Link>
        </SectionCard>
      )}

      {/* Score + Word */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/progress">
          <SectionCard title="Accountability" className="h-full">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl font-semibold text-primary">
                {score}
              </span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              rewards consistency
            </p>
          </SectionCard>
        </Link>
        <Link to="/progress">
          <SectionCard title="Progress" className="h-full">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-warning" />
              <span className="text-xs text-muted-foreground">
                Streaks & execution
              </span>
            </div>
            <p className="mt-2 text-[11px] font-semibold text-primary">
              View my progress →
            </p>
          </SectionCard>
        </Link>
      </div>

      {/* Needs your attention */}
      {attentionItems.length > 0 && (
        <SectionCard title="Needs Your Attention" className="border-warning/30">
          <div className="space-y-2">
            {attentionItems.map((item) => (
              <Link
                key={item.text}
                to={item.to}
                className="flex items-center gap-2 rounded-xl bg-warning/10 px-3 py-2 text-xs font-semibold text-warning"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {item.text}
              </Link>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-2">
        <QuickAction to="/planner" icon={PenLine} label="Plan Today" />
        <QuickAction onClick={() => setOpenReview(true)} icon={Sparkles} label="Add Win" />
        <QuickAction to="/journal" icon={BookOpen} label="Journal" />
        <QuickAction onClick={() => setOpenReview(true)} icon={CheckCircle2} label="Review Week" />
      </div>

      <Sheet open={openReview} onOpenChange={setOpenReview}>
        <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-2xl">
          <SheetHeader className="text-left">
            <SheetTitle className="font-display text-lg">Weekly Review</SheetTitle>
            <SheetDescription className="text-left">
              How did your week go?
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 pb-6">
            <ReflectionForm weekKey={weekKey} onDone={() => setOpenReview(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </MobileLayout>
  );
}

function QuickAction({
  to,
  onClick,
  icon: Icon,
  label,
}: {
  to?: string;
  onClick?: () => void;
  icon: typeof PenLine;
  label: string;
}) {
  const cls =
    "flex flex-col items-center gap-1.5 rounded-2xl border border-border/70 bg-card p-3 shadow-card transition-colors hover:border-primary/30";
  const inner = (
    <>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-center text-[10px] font-semibold leading-tight text-foreground">
        {label}
      </span>
    </>
  );
  if (to) {
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
