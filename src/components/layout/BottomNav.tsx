import { NavLink } from "react-router-dom";
import { Home, Target, CalendarRange, BookOpen, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/planner", label: "Planner", icon: CalendarRange },
  { to: "/journal", label: "Journal", icon: BookOpen },
  { to: "/progress", label: "Progress", icon: TrendingUp },
];

export function BottomNav() {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-20 border-t border-border/70 bg-card/95 backdrop-blur">
      <div className="grid grid-cols-5">
        {ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold tracking-wide transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                    isActive && "bg-primary/10",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 2} />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
