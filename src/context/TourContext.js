import React, { createContext, useContext, useState } from "react";

import { saveTourSeen } from "../utils/tourStorage";

const TourContext = createContext(null);

export const TOUR_STEPS = [
  { target: '[data-tour="game-bar"]', titleKey: "tour.gameBar.title", bodyKey: "tour.gameBar.body" },
  { target: '[data-tour="quests-panel"]', titleKey: "tour.quests.title", bodyKey: "tour.quests.body" },
  { target: '[data-tour="budget-settings"]', titleKey: "tour.budget.title", bodyKey: "tour.budget.body" },
  { target: '[data-tour="badges-shelf"]', titleKey: "tour.badges.title", bodyKey: "tour.badges.body" },
  { target: '[data-tour="add-expense-button"]', titleKey: "tour.addExpense.title", bodyKey: "tour.addExpense.body" },
  { target: '[data-tour="recent-expenses"]', titleKey: "tour.recentExpenses.title", bodyKey: "tour.recentExpenses.body" },
  { target: '[data-tour="settings-bar"]', titleKey: "tour.settingsBar.title", bodyKey: "tour.settingsBar.body" },
];

export const TourProvider = (props) => {
  const [isActive, setIsActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const start = () => {
    setStepIndex(0);
    setIsActive(true);
  };

  const next = () => {
    setStepIndex((prev) => {
      if (prev + 1 >= TOUR_STEPS.length) {
        setIsActive(false);
        saveTourSeen();
        return prev;
      }
      return prev + 1;
    });
  };

  const back = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const skip = () => {
    setIsActive(false);
    saveTourSeen();
  };

  const finish = () => {
    setIsActive(false);
    saveTourSeen();
  };

  const value = {
    isActive,
    stepIndex,
    currentStep: TOUR_STEPS[stepIndex],
    totalSteps: TOUR_STEPS.length,
    start,
    next,
    back,
    skip,
    finish,
  };

  return <TourContext.Provider value={value}>{props.children}</TourContext.Provider>;
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
};
