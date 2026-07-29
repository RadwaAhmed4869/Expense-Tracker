import React, { useState } from "react";

import ExpensesFilter, { ALL_YEARS } from "./ExpensesFilter";
import ExpensesList from "./ExpensesList";
import Card from "../UI/Card";
import { RecentExpensesIcon } from "../UI/icons";
import { useLanguage } from "../../context/LanguageContext";
import "./Expenses.css";

const Expenses = (props) => {
  const [filterYear, SetFilterYear] = useState(new Date().getFullYear().toString());
  const { t } = useLanguage();

  const filterChangeHandler = (selectedYear) => {
    SetFilterYear(selectedYear);
  };

  const viewAllHandler = () => {
    SetFilterYear(ALL_YEARS);
  };

  const filteredExpenses = props.items.filter((expense) => {
    return filterYear === ALL_YEARS || expense.date.getFullYear().toString() === filterYear;
  });

  return (
    <Card className="expenses" data-tour="recent-expenses">
      <div className="expenses__header">
        <h2 className="panel-title">
          <RecentExpensesIcon />
          {t("recentExpenses")}
        </h2>
        <ExpensesFilter selected={filterYear} onChangeFilter={filterChangeHandler} />
      </div>
      <div className="expenses__body">
        <ExpensesList list={filteredExpenses} onDeleteExpense={props.onRenewExpenses} />
      </div>
      <button className="expenses__view-all" onClick={viewAllHandler}>
        {t("viewAllExpenses")}
      </button>
    </Card>
  );
};

export default Expenses;
