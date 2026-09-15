import { MobileLayout } from "@/components/layout/MobileLayout";
import { ProgressScreen } from "@/components/progress/ProgressScreen";

export function ProgressPage() {
  return (
    <MobileLayout title="Progress" subtitle="Consistency you can see">
      <ProgressScreen />
    </MobileLayout>
  );
}
