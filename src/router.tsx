import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { OnboardingPage } from "./pages/Onboarding";
import { HomePage } from "./pages/Home";
import { GoalsPage } from "./pages/Goals";
import { PlannerPage } from "./pages/Planner";
import { JournalPage } from "./pages/Journal";
import { ProgressPage } from "./pages/Progress";
import { RequireOnboarded, RootRedirect } from "@/components/AppGuards";

export const routers = [
  {
    path: "/",
    name: "root",
    element: <RootRedirect />,
  },
  {
    path: "/onboarding",
    name: "onboarding",
    element: <OnboardingPage />,
  },
  {
    path: "/home",
    name: "home",
    element: (
      <RequireOnboarded>
        <HomePage />
      </RequireOnboarded>
    ),
  },
  {
    path: "/goals",
    name: "goals",
    element: (
      <RequireOnboarded>
        <GoalsPage />
      </RequireOnboarded>
    ),
  },
  {
    path: "/planner",
    name: "planner",
    element: (
      <RequireOnboarded>
        <PlannerPage />
      </RequireOnboarded>
    ),
  },
  {
    path: "/journal",
    name: "journal",
    element: (
      <RequireOnboarded>
        <JournalPage />
      </RequireOnboarded>
    ),
  },
  {
    path: "/progress",
    name: "progress",
    element: (
      <RequireOnboarded>
        <ProgressPage />
      </RequireOnboarded>
    ),
  },
  /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
  {
    path: "*",
    name: "404",
    element: <NotFound />,
  },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;
