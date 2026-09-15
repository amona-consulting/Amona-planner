import type { ReactNode } from "react";
import { Info, RotateCcw, UserRound } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/lib/store";

export function SettingsSheet({ trigger }: { trigger: ReactNode }) {
  const { state, resetAll } = useAppData();
  const { profile, year } = state;

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader className="text-left">
          <SheetTitle className="font-display text-lg">Settings</SheetTitle>
          <SheetDescription className="text-left">
            Your Solo2CEO Accountability Journal
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-secondary/40 p-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserRound className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {profile.name || "Unnamed"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {profile.role || "No role set"} · {year?.year ?? "No year"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-warning/25 bg-warning/10 p-3.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Demo mode.</span>{" "}
              Your journal is stored only in this browser and is not synced
              across devices. Clearing browser data will erase everything. A
              future release will connect to a secure cloud account so your
              reflections are private by default and backed up.
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full text-destructive hover:text-destructive"
            onClick={() => {
              if (confirm("Erase all journal data on this device?")) resetAll();
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Reset demo data
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
