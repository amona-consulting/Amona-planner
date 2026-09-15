import { cn } from "@/lib/utils";

type Tone = "primary" | "success" | "warning" | "danger";

const toneClass: Record<Tone, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export function ProgressBar({
  value,
  tone = "primary",
  className,
}: {
  value: number;
  tone?: Tone;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-secondary",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500",
          toneClass[tone],
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
