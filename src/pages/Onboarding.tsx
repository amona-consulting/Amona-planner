import { Navigate } from "react-router-dom";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { useAppData } from "@/lib/store";

export function OnboardingPage() {
  const { state } = useAppData();
  if (state.profile.onboarded) return <Navigate to="/home" replace />;
  return <OnboardingFlow />;
}
