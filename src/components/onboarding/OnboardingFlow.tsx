import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppData } from "@/lib/store";
import { ASPIRATIONS, ROLES, THEME_SUGGESTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STEPS = ["You", "Purpose", "Year", "Begin"];

export function OnboardingFlow() {
  const { state, setProfile, setYear } = useAppData();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [occupation, setOccupation] = useState("");
  const [aspirations, setAspirations] = useState<string[]>([]);
  const [theme, setTheme] = useState("");
  const [vision, setVision] = useState("");

  const toggleAspiration = (a: string) =>
    setAspirations((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );

  const canContinue =
    step === 0
      ? true
      : step === 1
        ? name.trim().length > 0 && role.length > 0
        : step === 2
          ? theme.trim().length > 0 || vision.trim().length > 0
          : true;

  const finish = () => {
    const year = new Date().getFullYear();
    setProfile({
      name: name.trim(),
      role,
      occupation: occupation.trim(),
      aspirations,
      onboarded: true,
    });
    setYear({
      year,
      theme: theme.trim(),
      vision: vision.trim(),
      differentIfGreat: "",
      top3: [],
    });
    navigate("/home", { replace: true });
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-navy-950">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-green-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-green-400/10 blur-3xl" />

      <div className="flex items-center justify-between px-6 pt-6">
        <span className="font-display text-lg font-semibold tracking-tight text-white">
          Solo2CEO
        </span>
        <div className="flex items-center gap-1.5">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide transition-colors",
                i <= step ? "bg-green-400/20 text-green-300" : "text-white/35",
              )}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative flex flex-1 flex-col justify-center px-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="space-y-5"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1 text-xs font-semibold text-green-300">
                <Sparkles className="h-3.5 w-3.5" />
                Your Accountability Journey
              </span>
              <h1 className="font-display text-4xl font-medium leading-tight tracking-tight text-white">
                Plan it. Do it.
                <br />
                Review it.
                <br />
                <span className="text-green-300">Become accountable.</span>
              </h1>
              <p className="text-sm leading-relaxed text-white/70">
                This isn't another planner to fill in. It's the system that
                turns the goals you set into the actions you actually take —
                week after week.
              </p>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="you"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              <div>
                <h2 className="font-display text-2xl font-medium text-white">
                  Tell us about you
                </h2>
                <p className="mt-1 text-sm text-white/60">
                  So the journal can speak your language.
                </p>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-white/70">
                  Name
                </span>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Lola"
                  className="border-white/15 bg-white/5 text-white placeholder:text-white/35"
                />
              </label>
              <div>
                <span className="mb-1.5 block text-xs font-semibold text-white/70">
                  Current role
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                        role === r
                          ? "border-green-400 bg-green-400/20 text-green-200"
                          : "border-white/15 text-white/70 hover:border-white/30",
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-white/70">
                  Occupation / business
                </span>
                <Input
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Founder, consultant, engineer…"
                  className="border-white/15 bg-white/5 text-white placeholder:text-white/35"
                />
              </label>
              <div>
                <span className="mb-1.5 block text-xs font-semibold text-white/70">
                  What are you hoping to achieve?
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ASPIRATIONS.map((a) => {
                    const active = aspirations.includes(a);
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => toggleAspiration(a)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                          active
                            ? "border-green-400 bg-green-400/20 text-green-200"
                            : "border-white/15 text-white/70 hover:border-white/30",
                        )}
                      >
                        {active && <Check className="h-3 w-3" />}
                        {a}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="year"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              <div>
                <h2 className="font-display text-2xl font-medium text-white">
                  Define your year
                </h2>
                <p className="mt-1 text-sm text-white/60">
                  A word and a direction. Details can be refined in My Year.
                </p>
              </div>
              <div>
                <span className="mb-1.5 block text-xs font-semibold text-white/70">
                  My theme for the year
                </span>
                <Input
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="e.g. Execution"
                  className="border-white/15 bg-white/5 text-white placeholder:text-white/35"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {THEME_SUGGESTIONS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTheme(t)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                        theme === t
                          ? "border-green-400 bg-green-400/20 text-green-200"
                          : "border-white/15 text-white/60 hover:border-white/30",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-white/70">
                  My vision for this year
                </span>
                <Textarea
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  placeholder="If this year goes really well, what will be different?"
                  rows={4}
                  className="resize-none border-white/15 bg-white/5 text-white placeholder:text-white/35"
                />
              </label>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="begin"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1 text-xs font-semibold text-green-300">
                <Sparkles className="h-3.5 w-3.5" />
                You're ready
              </span>
              <h2 className="font-display text-3xl font-medium leading-tight text-white">
                Welcome{name ? `, ${name}` : ""}.
              </h2>
              <p className="text-sm leading-relaxed text-white/70">
                Your year will carry the theme{" "}
                <span className="font-semibold text-green-300">
                  {theme || "—"}
                </span>
                . Next, we'll set your goals across the areas of life that
                matter, discover your Ikigai, and build your first monthly,
                weekly and daily plans.
              </p>
              <p className="text-xs text-white/45">
                One principle to carry with you: the app is not here to help
                you write down more goals — it's here to help you keep the
                commitments you make to yourself.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-3 px-6 pb-8 pt-2">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-white/70 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {step < 3 ? (
          <Button
            onClick={() => canContinue && setStep((s) => s + 1)}
            disabled={!canContinue}
            className="bg-green-500 text-navy-950 hover:bg-green-400"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={finish}
            className="bg-green-500 text-navy-950 hover:bg-green-400"
          >
            Begin my year
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
