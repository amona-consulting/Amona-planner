import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Compass, Pencil, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/shared/SectionCard";
import { ListAdd } from "@/components/shared/ListAdd";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAppData } from "@/lib/store";
import { IKIGAI_STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Ikigai } from "@/lib/types";

export function IkigaiExercise() {
  const { state, setIkigai } = useAppData();
  const [step, setStep] = useState(0);
  const [viewing, setViewing] = useState(false);

  const ikigai = state.ikigai;
  const total = Object.values(ikigai).reduce((n, arr) => n + arr.length, 0);
  const current = IKIGAI_STEPS[step];

  const update = (key: keyof Ikigai, items: string[]) => {
    setIkigai({ ...ikigai, [key]: items });
  };

  if (viewing) {
    return (
      <div className="space-y-4">
        <SectionCard
          icon={Compass}
          title="Your Ikigai"
          subtitle="Where passion, vocation, profession and mission meet"
        >
          <div className="grid grid-cols-2 gap-2">
            {IKIGAI_STEPS.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => {
                  setViewing(false);
                  setStep(IKIGAI_STEPS.findIndex((x) => x.key === s.key));
                }}
                className="rounded-xl border border-border/70 bg-secondary/30 p-3 text-left transition-colors hover:border-primary/40"
              >
                <span className="block text-[10px] font-bold uppercase tracking-wider text-primary">
                  {s.eyebrow}
                </span>
                <span className="mt-0.5 block text-xs font-semibold text-foreground">
                  {s.title}
                </span>
              </button>
            ))}
          </div>
        </SectionCard>

        <AnimatePresence mode="wait">
          {IKIGAI_STEPS.map(
            (s) =>
              ikigai[s.key].length > 0 && (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <SectionCard
                    title={s.title}
                    subtitle={s.eyebrow}
                    action={
                      <button
                        type="button"
                        onClick={() => {
                          setViewing(false);
                          setStep(IKIGAI_STEPS.findIndex((x) => x.key === s.key));
                        }}
                        className="flex items-center gap-1 text-xs font-semibold text-primary"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    }
                  >
                    <ul className="space-y-1.5">
                      {ikigai[s.key].map((item, i) => (
                        <li
                          key={i}
                          className="text-sm leading-snug text-foreground"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </SectionCard>
                </motion.div>
              ),
          )}
        </AnimatePresence>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setViewing(false)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to the exercise
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SectionCard
        icon={Compass}
        title="Discover Your Ikigai"
        subtitle="Four questions that point to purpose"
      >
        <div className="mb-4 flex items-center gap-1.5">
          {IKIGAI_STEPS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setStep(i)}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i === step
                  ? "bg-primary"
                  : i < step
                    ? "bg-primary/40"
                    : "bg-secondary",
              )}
              aria-label={s.title}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              {current.eyebrow}
            </span>
            <h3 className="font-display mt-0.5 text-xl font-medium text-foreground">
              {current.title}
            </h3>
            <p className="mb-3 mt-1 text-xs leading-relaxed text-muted-foreground">
              {current.hints.join(" · ")}
            </p>
            <ListAdd
              items={ikigai[current.key]}
              onChange={(items) => update(current.key, items)}
              placeholder={current.placeholder}
              addLabel="Add"
              variant="chips"
            />
          </motion.div>
        </AnimatePresence>
      </SectionCard>

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {step < IKIGAI_STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)}>
            Next question
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={() => setViewing(true)} disabled={total === 0}>
            <Sparkles className="h-4 w-4" />
            View my Ikigai
          </Button>
        )}
      </div>

      {total === 0 && (
        <EmptyState
          icon={Compass}
          title="Start with one answer"
          description="Add anything that comes to mind — you can edit it later. Four honest lists point to where your life and work intersect."
        />
      )}
    </div>
  );
}
