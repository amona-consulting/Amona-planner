import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  icon?: LucideIcon;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Dark navy hero variant used on the dashboard. */
  variant?: "default" | "navy";
}

export function SectionCard({
  icon: Icon,
  title,
  subtitle,
  action,
  children,
  className,
  variant = "default",
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "animate-fade-up rounded-2xl border p-4 shadow-card",
        variant === "navy"
          ? "border-navy-800 bg-navy-900 text-navy-50"
          : "border-border/70 bg-card text-card-foreground",
        className,
      )}
    >
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {Icon && (
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-md",
                  variant === "navy"
                    ? "bg-white/10 text-green-300"
                    : "bg-primary/10 text-primary",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
            )}
            {title && (
              <h3
                className={cn(
                  "text-sm font-semibold tracking-tight",
                  variant === "navy" && "text-white",
                )}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <span
                className={cn(
                  "text-xs",
                  variant === "navy" ? "text-navy-100/70" : "text-muted-foreground",
                )}
              >
                {subtitle}
              </span>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
