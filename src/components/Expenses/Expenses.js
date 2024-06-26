import React, { useState } from "react";

import ExpensesFilter from "./ExpensesFilter";
import ExpensesChart from "./ExpensesChart";
import ExpensesList from "./ExpensesList";
import Card from "../UI/Card";
import ExportButton from "../Buttons/ExportButton"
import "./Expenses.css";

const Expenses = (props) => {
  const [filterYear, SetFilterYear] = useState("2024");

  const filterChangeHandler = (selectedYear) => {
    SetFilterYear(selectedYear);
  };

  const filteredExpenses = props.items.filter((expense) => {
    return expense.date.getFullYear().toString() === filterYear;
  });

  return (
    <Card className="expenses">
      <ExpensesFilter
        selected={filterYear}
        onChangeFilter={filterChangeHandler}
      />
      <ExpensesChart expenses={filteredExpenses}/>
      <ExpensesList list={filteredExpenses} onDeleteExpense={props.onRenewExpenses}/>
      <ExportButton data={filteredExpenses}/>
    </Card>
  );
};

export default Expenses;
