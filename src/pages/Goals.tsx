import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Segmented } from "@/components/layout/Segmented";
import { YearSetup } from "@/components/goals/YearSetup";
import { WheelOfLife } from "@/components/goals/WheelOfLife";
import { IkigaiExercise } from "@/components/goals/IkigaiExercise";
import { useAppData } from "@/lib/store";

type Tab = "year" | "life" | "ikigai";

export function GoalsPage() {
  const { state } = useAppData();
  const [tab, setTab] = useState<Tab>("life");

  return (
    <MobileLayout
      title="Goals"
      subtitle={
        state.year?.theme
          ? `My Year · ${state.year.theme}`
          : "My Year, my life, my purpose"
      }
    >
      <Segmented<Tab>
        className="mb-4"
        options={[
          { value: "year", label: "My Year" },
          { value: "life", label: "Life Goals" },
          { value: "ikigai", label: "Ikigai" },
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === "year" && <YearSetup />}
      {tab === "life" && <WheelOfLife />}
      {tab === "ikigai" && <IkigaiExercise />}
    </MobileLayout>
  );
}
