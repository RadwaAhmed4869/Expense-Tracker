import React, { createContext, useContext, useEffect, useReducer } from "react";

import { loadGameState, saveGameState } from "../utils/storage";
import { computeStreakFromHistory, evaluateBadges, getLevelFromXP, refreshQuests } from "../utils/gameLogic";

const GameContext = createContext(null);

const initialGameState = {
  xp: 0,
  level: 1,
  streakCount: 0,
  unlockedBadgeIds: [],
  budgets: [],
  quests: [],
  pendingToasts: [],
};

const applyExpenseLogged = (state, allExpenses, today) => {
  let xp = state.xp + 5;
  const streakCount = computeStreakFromHistory(allExpenses, today);
  const toasts = [];

  const { quests, newlyCompletedQuestIds } = refreshQuests(state, allExpenses, today);
  newlyCompletedQuestIds.forEach((questId) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;
    xp += quest.rewardXP;
    toasts.push({
      id: crypto.randomUUID(),
      type: "quest",
      payload: { questType: quest.type, target: quest.target, category: quest.category, rewardXP: quest.rewardXP },
    });
  });

  const interimState = { ...state, xp, streakCount, quests };
  const newlyUnlockedBadgeIds = evaluateBadges(interimState, allExpenses);
  newlyUnlockedBadgeIds.forEach((badgeId) => {
    xp += 10;
    toasts.push({
      id: crypto.randomUUID(),
      type: "badge",
      payload: { badgeId },
    });
  });
  const unlockedBadgeIds = [...state.unlockedBadgeIds, ...newlyUnlockedBadgeIds];

  const previousLevel = getLevelFromXP(state.xp);
  const level = getLevelFromXP(xp);
  if (level > previousLevel) {
    toasts.push({ id: crypto.randomUUID(), type: "levelup", payload: { level } });
  }

  return {
    ...state,
    xp,
    level,
    streakCount,
    quests,
    unlockedBadgeIds,
    pendingToasts: [...state.pendingToasts, ...toasts],
  };
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case "EXPENSE_LOGGED":
      return applyExpenseLogged(state, action.payload.allExpenses, new Date());

    case "REFRESH_QUESTS": {
      const { quests } = refreshQuests(state, action.payload.allExpenses, new Date());
      return { ...state, quests };
    }

    case "SET_BUDGET": {
      const { category, monthlyCap } = action.payload;
      const existing = state.budgets.find((budget) => budget.category === category);
      const budgets = existing
        ? state.budgets.map((budget) =>
            budget.category === category ? { ...budget, monthlyCap } : budget
          )
        : [...state.budgets, { id: crypto.randomUUID(), category, monthlyCap }];
      return { ...state, budgets };
    }

    case "REMOVE_BUDGET":
      return { ...state, budgets: state.budgets.filter((budget) => budget.id !== action.payload.id) };

    case "DISMISS_TOAST":
      return { ...state, pendingToasts: state.pendingToasts.filter((toast) => toast.id !== action.payload.id) };

    default:
      return state;
  }
};

export const GameProvider = (props) => {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => {
    const saved = loadGameState();
    return saved ?? initialGameState;
  });

  useEffect(() => {
    saveGameState(state);
  }, [state]);

  return <GameContext.Provider value={{ state, dispatch }}>{props.children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
