import React from "react";

import ExpenseItem from "./ExpenseItem";
import { useLanguage } from "../../context/LanguageContext";
import "./ExpensesList.css";

const ExpensesList = (props) => {
  const { t } = useLanguage();
  if (props.list.length === 0) {
    return <h2 className="expenses-list__fallback">{t("foundNoExpenses")}</h2>;
  }

  return (
    <ul className="expenses-list">
      {props.list.map((expense) => (
        <ExpenseItem
          key={expense.id}
          id={expense.id}
          title={expense.title}
          amount={expense.amount}
          date={expense.date}
          category={expense.category}
          onDelete={props.onDeleteExpense}
        />
      ))}
    </ul>
  );
};

export default ExpensesList;
