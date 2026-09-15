import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type {
  AppState,
  DailyFocus,
  Goal,
  Ikigai,
  MonthlyPlan,
  Profile,
  WeeklyPlan,
  WeeklyReflection,
  YearPlan,
} from "./types";
import { STORE_KEY, STORE_VERSION } from "./constants";

// eslint-disable-next-line react-refresh/only-export-components
export const initialState = (): AppState => ({
  version: STORE_VERSION,
  profile: {
    name: "",
    role: "",
    occupation: "",
    aspirations: [],
    onboarded: false,
  },
  year: null,
  goals: {},
  ikigai: { love: [], goodAt: [], paidFor: [], communityNeeds: [] },
  monthly: {},
  weekly: {},
  daily: {},
  reflections: {},
});

export type AppAction =
  | { type: "set-profile"; profile: Profile }
  | { type: "set-year"; year: YearPlan | null }
  | { type: "upsert-goal"; goal: Goal }
  | { type: "set-ikigai"; ikigai: Ikigai }
  | { type: "upsert-monthly"; plan: MonthlyPlan }
  | { type: "upsert-weekly"; plan: WeeklyPlan }
  | { type: "upsert-daily"; entry: DailyFocus }
  | { type: "set-daily-outcome"; dateKey: string; outcome: DailyFocus["outcome"] }
  | { type: "upsert-reflection"; reflection: WeeklyReflection }
  | { type: "reset" };

// eslint-disable-next-line react-refresh/only-export-components
export function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "set-profile":
      return { ...state, profile: action.profile };
    case "set-year":
      return { ...state, year: action.year };
    case "upsert-goal":
      return { ...state, goals: { ...state.goals, [action.goal.id]: action.goal } };
    case "set-ikigai":
      return { ...state, ikigai: action.ikigai };
    case "upsert-monthly":
      return {
        ...state,
        monthly: { ...state.monthly, [action.plan.monthKey]: action.plan },
      };
    case "upsert-weekly":
      return {
        ...state,
        weekly: { ...state.weekly, [action.plan.weekKey]: action.plan },
      };
    case "upsert-daily":
      return {
        ...state,
        daily: { ...state.daily, [action.entry.dateKey]: action.entry },
      };
    case "set-daily-outcome":
      return {
        ...state,
        daily: {
          ...state.daily,
          [action.dateKey]: state.daily[action.dateKey]
            ? { ...state.daily[action.dateKey], outcome: action.outcome }
            : state.daily[action.dateKey],
        },
      };
    case "upsert-reflection":
      return {
        ...state,
        reflections: {
          ...state.reflections,
          [action.reflection.weekKey]: action.reflection,
        },
      };
    case "reset":
      return initialState();
    default:
      return state;
  }
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw) as AppState;
    if (parsed.version !== STORE_VERSION) return initialState();
    return { ...initialState(), ...parsed };
  } catch {
    return initialState();
  }
}

interface AppDataValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
  setProfile: (profile: Profile) => void;
  setYear: (year: YearPlan | null) => void;
  upsertGoal: (goal: Goal) => void;
  setIkigai: (ikigai: Ikigai) => void;
  upsertMonthly: (plan: MonthlyPlan) => void;
  upsertWeekly: (plan: WeeklyPlan) => void;
  upsertDaily: (entry: DailyFocus) => void;
  setDailyOutcome: (dateKey: string, outcome: DailyFocus["outcome"]) => void;
  upsertReflection: (reflection: WeeklyReflection) => void;
  resetAll: () => void;
}

const AppDataContext = createContext<AppDataValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch {
      // Storage full/unavailable — the in-memory copy still works this session.
    }
  }, [state]);

  const value: AppDataValue = {
    state,
    dispatch,
    setProfile: (profile) => dispatch({ type: "set-profile", profile }),
    setYear: (year) => dispatch({ type: "set-year", year }),
    upsertGoal: (goal) => dispatch({ type: "upsert-goal", goal }),
    setIkigai: (ikigai) => dispatch({ type: "set-ikigai", ikigai }),
    upsertMonthly: (plan) => dispatch({ type: "upsert-monthly", plan }),
    upsertWeekly: (plan) => dispatch({ type: "upsert-weekly", plan }),
    upsertDaily: (entry) => dispatch({ type: "upsert-daily", entry }),
    setDailyOutcome: (dateKey, outcome) =>
      dispatch({ type: "set-daily-outcome", dateKey, outcome }),
    upsertReflection: (reflection) =>
      dispatch({ type: "upsert-reflection", reflection }),
    resetAll: () => dispatch({ type: "reset" }),
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppData(): AppDataValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used inside AppDataProvider");
  return ctx;
}
