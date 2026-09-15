// Entity types for the Solo2CEO Accountability Journal.
// These deliberately mirror the database relationship chain from the brief (§51):
// User → Year → Goal → Monthly Objective → Weekly Priority → Daily Action → Completion → Reflection
// so the store can later be lifted onto Enter Cloud (auth + database + RLS) mechanically.

export type CategoryId =
  | "business"
  | "wealth"
  | "family"
  | "health"
  | "social"
  | "environment"
  | "spiritual"
  | "fun";

export interface Profile {
  name: string;
  role: string; // Business owner / Employee / Professional / Student / Other
  occupation: string;
  aspirations: string[];
  onboarded: boolean;
}

export interface YearPlan {
  year: number;
  theme: string;
  vision: string;
  differentIfGreat: string;
  top3: string[];
}

export interface Goal {
  id: CategoryId;
  score: number; // 1-10 satisfaction
  currentSituation: string;
  desiredOutcome: string;
  title: string;
  whyItMatters: string;
  targetDate: string; // yyyy-MM-dd
  measurement: string;
  progress: number; // 0-100
  status: "on-track" | "needs-attention" | "behind";
}

export interface Ikigai {
  love: string[];
  goodAt: string[];
  paidFor: string[];
  communityNeeds: string[];
}

export interface MonthlyObjective {
  id: string;
  title: string;
  goalId?: CategoryId;
  done: boolean;
}

export interface SelfCareCommitment {
  id: string;
  text: string;
  category: string;
}

export interface MonthlyPlan {
  monthKey: string; // yyyy-MM
  objectives: MonthlyObjective[];
  top3: string[];
  mustHappen: string;
  sayNoTo: string;
  selfCare: SelfCareCommitment[];
}

export interface WeeklyAction {
  id: string;
  text: string;
  done: boolean;
}

export interface WeeklyPriority {
  id: string;
  title: string;
  goalId?: CategoryId;
  actions: WeeklyAction[];
  done: boolean;
}

export interface WeeklyPlan {
  weekKey: string; // yyyy-MM-N (N = 1..4)
  outcome: string;
  priorities: WeeklyPriority[];
  personalCommitment: string;
  plannedAt: string;
}

export interface DailyTask {
  id: string;
  text: string;
  done: boolean;
}

export interface DailyFocus {
  dateKey: string; // yyyy-MM-dd
  mit: DailyTask;
  otherTasks: DailyTask[];
  outcome: "done" | "moved" | "removed" | null;
}

export interface ConnectPerson {
  id: string;
  name: string;
  note: string;
}

export interface WeeklyReflection {
  weekKey: string; // yyyy-MM-N
  wins: string[];
  fails: string[];
  learnings: string[];
  tweaks: string[];
  strategy: string;
  connect: ConnectPerson[];
  inspiration: string;
  weekScore: number; // 1-10
  executionRate: number; // 0-100
  completedAt: string;
}

export interface AppState {
  version: number;
  profile: Profile;
  year: YearPlan | null;
  goals: Partial<Record<CategoryId, Goal>>;
  ikigai: Ikigai;
  monthly: Record<string, MonthlyPlan>; // keyed by monthKey
  weekly: Record<string, WeeklyPlan>; // keyed by weekKey
  daily: Record<string, DailyFocus>; // keyed by dateKey
  reflections: Record<string, WeeklyReflection>; // keyed by weekKey
}
