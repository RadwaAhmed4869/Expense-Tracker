import { questTemplates, QUEST_TYPES } from "./questDefinitions";
import { badgeCatalog } from "./badgeDefinitions";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const toISODateString = (date) => {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const getISOWeekStart = (date) => {
  const d = startOfDay(date);
  const day = d.getDay(); // 0 = Sun ... 6 = Sat
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diffToMonday);
  return d;
};

const getMonthStart = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

const getMonthEnd = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 1);
};

// ---- XP & leveling ----

export const xpForLevel = (level) => (50 * level * (level - 1)) / 2;

export const getLevelFromXP = (xp) => {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) {
    level += 1;
  }
  return level;
};

export const getLevelProgress = (xp) => {
  const level = getLevelFromXP(xp);
  const currentFloor = xpForLevel(level);
  const nextCeiling = xpForLevel(level + 1);
  const span = nextCeiling - currentFloor;
  const progress = span === 0 ? 1 : (xp - currentFloor) / span;
  return { level, currentFloor, nextCeiling, progress };
};

// ---- Streaks ----

export const computeStreakFromHistory = (expenses, today = new Date()) => {
  if (!expenses || expenses.length === 0) return 0;

  const daysWithExpense = new Set(expenses.map((expense) => toISODateString(expense.date)));

  let cursor = startOfDay(today);
  if (!daysWithExpense.has(toISODateString(cursor))) {
    cursor = new Date(cursor.getTime() - MS_PER_DAY);
    if (!daysWithExpense.has(toISODateString(cursor))) {
      return 0;
    }
  }

  let streak = 0;
  while (daysWithExpense.has(toISODateString(cursor))) {
    streak += 1;
    cursor = new Date(cursor.getTime() - MS_PER_DAY);
  }
  return streak;
};

// ---- Quest progress ----

const isInPeriod = (expense, periodStart, periodEnd) => {
  const d = new Date(expense.date);
  return d >= periodStart && d < periodEnd;
};

export const computeQuestProgress = (quest, expenses, today = new Date()) => {
  const periodStart = new Date(quest.periodStart);
  const periodEnd = new Date(quest.periodEnd);

  switch (quest.type) {
    case QUEST_TYPES.LOG_COUNT: {
      const count = expenses.filter((expense) => isInPeriod(expense, periodStart, periodEnd)).length;
      return Math.min(count, quest.target);
    }
    case QUEST_TYPES.CATEGORY_BUDGET: {
      return expenses
        .filter((expense) => expense.category === quest.category && isInPeriod(expense, periodStart, periodEnd))
        .reduce((total, expense) => total + (Number(expense.amount) || 0), 0);
    }
    case QUEST_TYPES.STREAK: {
      return Math.min(computeStreakFromHistory(expenses, today), quest.target);
    }
    default:
      return 0;
  }
};

// ---- Quest generation ----

const generateQuestInstance = (template, today, budgets, existingQuests) => {
  const id = crypto.randomUUID();

  if (template.type === QUEST_TYPES.LOG_COUNT) {
    const periodStart = getISOWeekStart(today);
    const periodEnd = new Date(periodStart.getTime() + template.periodDays * MS_PER_DAY);
    return {
      id,
      type: template.type,
      target: template.target,
      rewardXP: template.rewardXP,
      periodStart: periodStart.toISOString(),
      periodEnd: periodEnd.toISOString(),
      progress: 0,
      status: "active",
    };
  }

  if (template.type === QUEST_TYPES.STREAK) {
    const periodStart = startOfDay(today);
    const periodEnd = new Date(periodStart.getTime() + template.periodDays * MS_PER_DAY);
    return {
      id,
      type: template.type,
      target: template.target,
      rewardXP: template.rewardXP,
      periodStart: periodStart.toISOString(),
      periodEnd: periodEnd.toISOString(),
      progress: 0,
      status: "active",
    };
  }

  if (template.type === QUEST_TYPES.CATEGORY_BUDGET) {
    const categoriesWithActiveQuest = existingQuests
      .filter((quest) => quest.type === QUEST_TYPES.CATEGORY_BUDGET && quest.status === "active")
      .map((quest) => quest.category);
    const availableBudget = (budgets || []).find(
      (budget) => !categoriesWithActiveQuest.includes(budget.category)
    );
    if (!availableBudget) return null;

    const periodStart = getMonthStart(today);
    const periodEnd = getMonthEnd(today);
    return {
      id,
      type: template.type,
      target: availableBudget.monthlyCap,
      category: availableBudget.category,
      rewardXP: template.rewardXP,
      periodStart: periodStart.toISOString(),
      periodEnd: periodEnd.toISOString(),
      progress: 0,
      status: "active",
    };
  }

  return null;
};

// ---- Quest refresh (expire/complete active quests, top up new ones) ----

export const refreshQuests = (state, expenses, today = new Date()) => {
  let quests = state.quests.map((quest) => ({ ...quest }));
  const newlyCompletedQuestIds = [];

  quests = quests.map((quest) => {
    if (quest.status !== "active") return quest;

    const periodEnded = today >= new Date(quest.periodEnd);
    const progress = computeQuestProgress(quest, expenses, today);

    if (quest.type === QUEST_TYPES.CATEGORY_BUDGET) {
      if (progress > quest.target) {
        return { ...quest, progress, status: "expired" };
      }
      if (periodEnded) {
        newlyCompletedQuestIds.push(quest.id);
        return { ...quest, progress, status: "completed", completedAt: today.toISOString() };
      }
      return { ...quest, progress };
    }

    if (progress >= quest.target) {
      newlyCompletedQuestIds.push(quest.id);
      return { ...quest, progress, status: "completed", completedAt: today.toISOString() };
    }
    if (periodEnded) {
      return { ...quest, progress, status: "expired" };
    }
    return { ...quest, progress };
  });

  questTemplates.forEach((template) => {
    const hasActiveOfType = quests.some((quest) => quest.status === "active" && quest.type === template.type);
    if (hasActiveOfType) return;
    const instance = generateQuestInstance(template, today, state.budgets, quests);
    if (instance) quests.push(instance);
  });

  return { quests, newlyCompletedQuestIds };
};

// ---- Badges ----

export const evaluateBadges = (state, expenses) => {
  return badgeCatalog
    .filter((badge) => !state.unlockedBadgeIds.includes(badge.id))
    .filter((badge) => badge.condition(state, expenses))
    .map((badge) => badge.id);
};
