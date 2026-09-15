import type { CategoryId } from "./types";

export const STORE_KEY = "solo2ceo.accountability.v1";
export const STORE_VERSION = 2;

export const LIFE_CATEGORIES: {
  id: CategoryId;
  label: string;
  short: string;
  hint: string;
}[] = [
  {
    id: "business",
    label: "Business",
    short: "Biz",
    hint: "Your work, craft and enterprise.",
  },
  {
    id: "wealth",
    label: "Wealth & Finances",
    short: "Fin",
    hint: "Money, savings, investing, freedom.",
  },
  {
    id: "family",
    label: "Family",
    short: "Fam",
    hint: "The people closest to you.",
  },
  {
    id: "health",
    label: "Health & Fitness",
    short: "Fit",
    hint: "Body, energy, movement, rest.",
  },
  {
    id: "social",
    label: "Social Life",
    short: "Soc",
    hint: "Friendships and community.",
  },
  {
    id: "environment",
    label: "Physical Environment",
    short: "Env",
    hint: "Your home, office and surroundings.",
  },
  {
    id: "spiritual",
    label: "Spiritual",
    short: "Soul",
    hint: "Faith, meaning, inner life.",
  },
  {
    id: "fun",
    label: "Fun & Passion",
    short: "Play",
    hint: "Joy, hobbies, play, adventure.",
  },
];

export const CATEGORY_COLORS: Record<CategoryId, string> = {
  business: "#2f8f6b",
  wealth: "#8a6a3a",
  family: "#b3684f",
  health: "#4a7fae",
  social: "#9b6ab0",
  environment: "#5d8f7a",
  spiritual: "#6b7ba8",
  fun: "#c08a3e",
};

export const THEME_SUGGESTIONS = [
  "Execution",
  "Growth",
  "Consistency",
  "Focus",
  "Expansion",
  "Balance",
  "Discipline",
];

export const ROLES = [
  "Business owner",
  "Employee",
  "Professional",
  "Student",
  "Other",
];

export const ASPIRATIONS = [
  "Grow my business",
  "Become more organised",
  "Improve my finances",
  "Improve my health",
  "Create better work-life balance",
  "Become more disciplined",
  "Achieve personal goals",
  "Improve my productivity",
  "Build better habits",
];

export const SELF_CARE_CATEGORIES = [
  "Rest",
  "Exercise",
  "Spiritual",
  "Family",
  "Social",
  "Fun",
  "Personal Development",
];

// Ikigai prompts (brief §9)
export const IKIGAI_STEPS: {
  key: "love" | "goodAt" | "paidFor" | "communityNeeds";
  title: string;
  eyebrow: string;
  hints: string[];
  placeholder: string;
}[] = [
  {
    key: "love",
    title: "What Do You Love?",
    eyebrow: "Passion",
    hints: [
      "What activities energise you?",
      "What could you talk about for hours?",
      "What would you still enjoy even if nobody paid you?",
    ],
    placeholder: "e.g. Writing, coaching people, building things…",
  },
  {
    key: "goodAt",
    title: "What Are You Good At?",
    eyebrow: "Vocation",
    hints: [
      "What comes naturally?",
      "What do people ask you for help with?",
      "Which skills have you developed?",
    ],
    placeholder: "e.g. Strategy, public speaking, systems…",
  },
  {
    key: "paidFor",
    title: "What Could You Be Paid For?",
    eyebrow: "Profession",
    hints: [
      "Which skills solve valuable problems?",
      "What products or services could those skills create?",
    ],
    placeholder: "e.g. Consulting, digital products, services…",
  },
  {
    key: "communityNeeds",
    title: "What Does Your Community Need?",
    eyebrow: "Mission",
    hints: [
      "Which problems do you repeatedly see?",
      "Where could your knowledge make a difference?",
    ],
    placeholder: "e.g. Mentorship for young founders…",
  },
];

// Weekly reflection prompts (brief §15)
export const REFLECTION_SECTIONS: {
  key: "wins" | "fails" | "learnings" | "tweaks";
  title: string;
  hint: string;
  addLabel: string;
}[] = [
  {
    key: "wins",
    title: "Wins",
    hint: "What went well this week? Celebrate progress — not just completed tasks.",
    addLabel: "Add a win",
  },
  {
    key: "fails",
    title: "Fails",
    hint: "What didn't go according to plan? No judgment — it reveals what blocked execution.",
    addLabel: "Add a miss",
  },
  {
    key: "learnings",
    title: "AHA's / Learnings",
    hint: "What did you learn this week? Capture the lesson while it's fresh.",
    addLabel: "Add a learning",
  },
  {
    key: "tweaks",
    title: "Tweaks",
    hint: "What needs to change next week? Reflection becomes action here.",
    addLabel: "Add a tweak",
  },
];

export const CONNECT_ROLE_HINTS = [
  "Potential customer",
  "Mentor",
  "Employee",
  "Family member",
  "Partner",
  "Investor",
];

// Goal status mapping (brief §10)
export const GOAL_STATUS: Record<
  string,
  { label: string; tone: "success" | "warning" | "danger" }
> = {
  "on-track": { label: "On Track", tone: "success" },
  "needs-attention": { label: "Needs Attention", tone: "warning" },
  behind: { label: "Behind", tone: "danger" },
};

export const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
