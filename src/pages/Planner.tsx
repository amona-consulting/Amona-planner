import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Segmented } from "@/components/layout/Segmented";
import { DailyFocus } from "@/components/planner/DailyFocus";
import { WeeklyPlanner } from "@/components/planner/WeeklyPlanner";
import { MonthlyPlanner } from "@/components/planner/MonthlyPlanner";

type Tab = "today" | "week" | "month";

export function PlannerPage() {
  const [tab, setTab] = useState<Tab>("today");

  return (
    <MobileLayout
      title="Planner"
      subtitle="Today → This Week → This Month"
    >
      <Segmented<Tab>
        className="mb-4"
        options={[
          { value: "today", label: "Today" },
          { value: "week", label: "Week" },
          { value: "month", label: "Month" },
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === "today" && <DailyFocus />}
      {tab === "week" && <WeeklyPlanner />}
      {tab === "month" && <MonthlyPlanner />}
    </MobileLayout>
  );
}
