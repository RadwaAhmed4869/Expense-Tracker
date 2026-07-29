import React from "react";

import ExpenseForm from "./ExpenseForm";
import Card from "../UI/Card";
import { AddExpenseIcon } from "../UI/icons";
import { useLanguage } from "../../context/LanguageContext";
import "./NewExpense.css";

const NewExpense = (props) => {
  const { t } = useLanguage();

  const saveExpenseDataHandler = (enteredExpenseData) => {
    const expenseData = {
      ...enteredExpenseData,
      id: crypto.randomUUID(),
    };

    props.onAddNewExpense(expenseData);
  };

  return (
    <Card className="new-expense" data-tour="add-expense-button">
      <h2 className="panel-title">
        <AddExpenseIcon />
        {t("addExpense")}
      </h2>
      <div className="new-expense__body">
        <ExpenseForm onSaveExpenseData={saveExpenseDataHandler} />
      </div>
    </Card>
  );
};

export default NewExpense;
