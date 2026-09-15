import type { ReactNode } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BottomNav } from "./BottomNav";
import { SettingsSheet } from "./SettingsSheet";

interface MobileLayoutProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function MobileLayout({
  title,
  subtitle,
  children,
  actions,
}: MobileLayoutProps) {
  return (
    <div className="bg-app dark:bg-app-dark h-full w-full">
      <div className="relative mx-auto flex h-full w-full max-w-[430px] flex-col overflow-hidden bg-background shadow-lift dark:bg-background max-sm:shadow-none sm:border-x sm:border-border/70">
        <header className="z-10 flex items-center justify-between gap-3 border-b border-border/60 bg-card/80 px-5 py-4 backdrop-blur">
          <div className="min-w-0">
            {title && (
              <h1 className="font-display truncate text-xl font-semibold tracking-tight text-foreground">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="truncate text-xs font-medium text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {actions}
            <SettingsSheet
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Settings"
                  className="text-muted-foreground"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              }
            />
          </div>
        </header>

        <main className={cn("flex-1 overflow-y-auto px-5 pb-28 pt-5")}>
          {children}
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
