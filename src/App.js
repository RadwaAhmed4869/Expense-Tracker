import React, { useState } from "react";

import NewExpense from "./components/NewExpense/NewExpense";
import Expenses from "./components/Expenses/Expenses";

const dummyExpenses = [
  {
    id: "e1",
    title: "Car Insurance",
    amount: 450,
    date: new Date(2021, 2, 15),
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
    date: new Date(2024, 4, 8),
  },
  {
    id: "e4",
    title: "Mobile",
    amount: 14000,
    date: new Date(2023, 11, 10),
  },
];

const App = () => {
  const [expenses, setExpenses] = useState(dummyExpenses);
  const [filteredexpenses, setFilteredExpenses] = useState(expenses);

  const addNewExpenseHandeler = (newExpense) => {
    // console.log(newExpense);
    setExpenses((prevState) => {
      return [newExpense, ...expenses];
    });
  };

  const filterYearHandler = (filterYear) => {
    setFilteredExpenses((prevState) => {
      return expenses.filter(
        (expense) =>
          expense.date.getFullYear().toString() === filterYear.toString()
      );
    });
  };

  return (
    <div>
      <NewExpense onAddNewExpense={addNewExpenseHandeler} />
      <Expenses items={filteredexpenses} onYearChange={filterYearHandler} />
    </div>
  );
};

export default App;
