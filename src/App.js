import React, { useEffect, useState } from "react";

import NewExpense from "./components/NewExpense/NewExpense";
import Expenses from "./components/Expenses/Expenses";
import GameBar from "./components/Game/GameBar";
import QuestsPanel from "./components/Game/QuestsPanel";
import BadgesShelf from "./components/Game/BadgesShelf";
import BudgetSettings from "./components/Game/BudgetSettings";
import RewardToast from "./components/Game/RewardToast";
import SettingsBar from "./components/UI/SettingsBar";
import { useGame } from "./context/GameContext";

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
];

const App = () => {
  const [expenses, setExpenses] = useState(dummyExpenses);
  const { dispatch } = useGame();

  useEffect(() => {
    dispatch({ type: "REFRESH_QUESTS", payload: { allExpenses: expenses } });
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
    <div>
      <RewardToast />
      <SettingsBar />
      <GameBar />
      <NewExpense onAddNewExpense={addNewExpenseHandeler} />
      <QuestsPanel />
      <BudgetSettings />
      <BadgesShelf />
      <Expenses items={expenses} onRenewExpenses={renewExpenseHandler}/>
    </div>
  );
};

export default App;
