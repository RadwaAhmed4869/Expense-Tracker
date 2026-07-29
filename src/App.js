import React, { useEffect, useState } from "react";

import NewExpense from "./components/NewExpense/NewExpense";
import Expenses from "./components/Expenses/Expenses";
import GameBar from "./components/Game/GameBar";
import QuestsPanel from "./components/Game/QuestsPanel";
import BadgesShelf from "./components/Game/BadgesShelf";
import BudgetSettings from "./components/Game/BudgetSettings";
import RewardToast from "./components/Game/RewardToast";
import SettingsBar from "./components/UI/SettingsBar";
import TourOverlay from "./components/Tour/TourOverlay";
import { useGame } from "./context/GameContext";
import { useTour } from "./context/TourContext";
import { loadTourSeen } from "./utils/tourStorage";
import "./App.css";

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

// Clamps to the 1st of the current month so "this month" mock data never
// spills into the previous month, regardless of what day it is when this runs.
const thisMonthAgo = (n) => daysAgo(Math.min(n, new Date().getDate() - 1));

const dummyExpenses = [
  {
    id: "e1",
    title: "Car Maintenance",
    amount: 450,
    date: new Date(2021, 4, 15),
  },
  {
    id: "e2",
    title: "Healthy Spread",
    amount: 310,
    date: new Date(2024, 4, 8),
  },
  {
    id: "e3",
    title: "Peanut Butter",
    amount: 280,
    date: new Date(2024, 3, 10),
  },
  {
    id: "e4",
    title: "Mobile",
    amount: 14000,
    date: new Date(2023, 11, 10),
  },
  {
    id: "e5",
    title: "Groceries",
    amount: 120,
    date: new Date(2024, 2, 18),
  },
  {
    id: "e6",
    title: "Shoes",
    amount: 600,
    date: new Date(2024, 1, 22),
  },
  {
    id: "e7",
    title: "Shampoo",
    amount: 80,
    date: new Date(2024, 0, 4),
  },
  {
    id: "e8",
    title: "Swimming Gears",
    amount: 240,
    date: new Date(2024, 0, 15),
  },
  {
    id: "e9",
    title: "Coffee",
    amount: 4.5,
    date: thisMonthAgo(0),
    category: "food",
  },
  {
    id: "e10",
    title: "Lunch",
    amount: 12,
    date: thisMonthAgo(1),
    category: "food",
  },
  {
    id: "e11",
    title: "Snacks",
    amount: 6,
    date: thisMonthAgo(3),
    category: "food",
  },
  {
    id: "e12",
    title: "Vitamins",
    amount: 15,
    date: thisMonthAgo(4),
    category: "health",
  },
  {
    id: "e13",
    title: "Gym Membership",
    amount: 40,
    date: thisMonthAgo(6),
    category: "health",
  },
  {
    id: "e14",
    title: "T-Shirt",
    amount: 35,
    date: thisMonthAgo(2),
    category: "clothes",
  },
  {
    id: "e15",
    title: "Socks",
    amount: 12,
    date: thisMonthAgo(5),
    category: "clothes",
  },
  {
    id: "e16",
    title: "Board Game",
    amount: 25,
    date: thisMonthAgo(7),
    category: "hobby",
  },
  {
    id: "e17",
    title: "Phone Case",
    amount: 18,
    date: thisMonthAgo(8),
    category: "electronics",
  },
  {
    id: "e18",
    title: "USB Cable",
    amount: 9,
    date: thisMonthAgo(9),
    category: "electronics",
  },
];

const App = () => {
  const [expenses, setExpenses] = useState(dummyExpenses);
  const { dispatch } = useGame();
  const tour = useTour();

  useEffect(() => {
    // Freshly-generated quests start at progress 0 and only pick up real
    // progress on the next refresh cycle, so refresh twice on mount.
    dispatch({ type: "REFRESH_QUESTS", payload: { allExpenses: expenses } });
    dispatch({ type: "REFRESH_QUESTS", payload: { allExpenses: expenses } });
    if (!loadTourSeen()) {
      tour.start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addNewExpenseHandeler = (newExpense) => {
    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);
    dispatch({ type: "EXPENSE_LOGGED", payload: { allExpenses: updatedExpenses } });
  };

  const renewExpenseHandler = (id) => {
    const renewedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(renewedExpenses);
  }

  return (
    <div className="app-shell">
      <RewardToast />
      <SettingsBar />
      <TourOverlay />
      <div className="hud">
        <GameBar />
        <div className="hud__panels">
          <QuestsPanel />
          <BudgetSettings expenses={expenses} />
          <BadgesShelf />
        </div>
      </div>
      <div className="page-content">
        <NewExpense onAddNewExpense={addNewExpenseHandeler} />
        <Expenses items={expenses} onRenewExpenses={renewExpenseHandler} />
      </div>
    </div>
  );
};

export default App;
