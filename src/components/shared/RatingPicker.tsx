import { cn } from "@/lib/utils";

/** 1-10 rating picker used for satisfaction scores and the weekly rating. */
export function RatingPicker({
  value,
  onChange,
  size = "md",
}: {
  value: number;
  onChange: (v: number) => void;
  size?: "sm" | "md";
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={cn(
            "flex items-center justify-center rounded-full border font-semibold transition-all",
            size === "sm" ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm",
            n === value
              ? "border-primary bg-primary text-primary-foreground shadow-card"
              : n < value
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/40",
          )}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
