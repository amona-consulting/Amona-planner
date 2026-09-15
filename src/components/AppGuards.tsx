import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppData } from "@/lib/store";

export function RootRedirect() {
  const { state } = useAppData();
  return (
    <Navigate to={state.profile.onboarded ? "/home" : "/onboarding"} replace />
  );
}

export function RequireOnboarded({ children }: { children: ReactNode }) {
  const { state } = useAppData();
  if (!state.profile.onboarded) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}
