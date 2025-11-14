// Application constants

export const APP_NAME = "WhyAi";
export const APP_DESCRIPTION =
  "Master AI, ML, and Deep Learning";

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  COURSES: "/courses",
  COURSE_DETAIL: "/courses/:id",
  LEARNING_PATH: "/learning-path",
  PRACTICE: "/practice",
  PROBLEM_SOLVE: "/practice/:id",
  CONTESTS: "/contests",
  CONTEST_DETAIL: "/contests/:id",
  PROFILE: "/profile",
  NEWS: "/news",
  NEWS_DETAIL: "/news/:id",
};

export const DIFFICULTY_LEVELS = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
} as const;

export const COURSE_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

export const AI_CATEGORIES = [
  "Machine Learning",
  "Deep Learning",
  "Natural Language Processing",
  "Computer Vision",
  "Generative AI",
  "Agentic AI",
  "Reinforcement Learning",
  "Neural Networks",
];