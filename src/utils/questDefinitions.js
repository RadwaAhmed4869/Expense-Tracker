export const QUEST_TYPES = {
  LOG_COUNT: "LOG_COUNT",
  CATEGORY_BUDGET: "CATEGORY_BUDGET",
  STREAK: "STREAK",
};

export const EXPENSE_CATEGORIES = ["food", "health", "clothes", "hobby", "electronics"];

export const CATEGORY_COLOR_VARS = {
  food: "--color-category-food",
  health: "--color-category-health",
  clothes: "--color-category-clothes",
  hobby: "--color-category-hobby",
  electronics: "--color-category-electronics",
};

export const questTemplates = [
  {
    type: QUEST_TYPES.LOG_COUNT,
    target: 5,
    rewardXP: 20,
    periodDays: 7,
  },
  {
    type: QUEST_TYPES.CATEGORY_BUDGET,
    rewardXP: 30,
    periodDays: 30,
  },
  {
    type: QUEST_TYPES.STREAK,
    target: 3,
    rewardXP: 25,
    periodDays: 14,
  },
];
