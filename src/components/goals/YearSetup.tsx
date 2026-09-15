import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "@/components/shared/SectionCard";
import { ListAdd } from "@/components/shared/ListAdd";
import { useAppData } from "@/lib/store";
import { THEME_SUGGESTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function YearSetup() {
  const { state, setYear } = useAppData();
  const year = state.year;
  const currentYear = new Date().getFullYear();

  const [theme, setTheme] = useState(year?.theme ?? "");
  const [vision, setVision] = useState(year?.vision ?? "");
  const [differentIfGreat, setDifferentIfGreat] = useState(
    year?.differentIfGreat ?? "",
  );
  const [top3, setTop3] = useState<string[]>(year?.top3 ?? []);

  const save = () => {
    setYear({
      year: currentYear,
      theme: theme.trim(),
      vision: vision.trim(),
      differentIfGreat: differentIfGreat.trim(),
      top3,
    });
  };

  return (
    <div className="space-y-4">
      <SectionCard
        title={`${currentYear} — My Theme for the Year`}
        subtitle="One word to carry through everything"
      >
        <Input
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="e.g. Execution"
          className="mb-3"
        />
        <div className="flex flex-wrap gap-1.5">
          {THEME_SUGGESTIONS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                theme === t
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="My Vision for This Year">
        <Textarea
          value={vision}
          onChange={(e) => setVision(e.target.value)}
          placeholder="Describe the year you intend to create…"
          rows={3}
          className="resize-none"
        />
      </SectionCard>

      <SectionCard title="If This Year Goes Really Well…">
        <p className="mb-2 text-xs text-muted-foreground">
          What will be different in your life and business?
        </p>
        <Textarea
          value={differentIfGreat}
          onChange={(e) => setDifferentIfGreat(e.target.value)}
          placeholder="e.g. Revenue past ₦50m, fit and energised, two family holidays…"
          rows={3}
          className="resize-none"
        />
      </SectionCard>

      <SectionCard
        title="The 3 Most Important Things"
        subtitle="This reference point follows you through the year"
      >
        <ListAdd
          items={top3}
          onChange={setTop3}
          max={3}
          placeholder="e.g. Hit ₦50m revenue"
          addLabel="Add"
        />
      </SectionCard>

      <Button onClick={save} className="w-full">
        <Save className="h-4 w-4" />
        Save My Year
      </Button>
    </div>
  );
}
