import React, { useState } from "react";

import { useLanguage } from "../../context/LanguageContext";
import { EXPENSE_CATEGORIES } from "../../utils/questDefinitions";
import "./ExpenseForm.css";

const ExpenseForm = (props) => {
  const { t } = useLanguage();
  const [enteredTitle, setTitle] = useState("");
  const [enteredAmount, setAmount] = useState("");
  const [enteredDate, setDate] = useState("");
  const [enteredCategory, setCategory] = useState("");

  // const [userInput, setUserInput] = useState({
  //   title: "",
  //   amount: "",
  //   date: "",
  // });

  const titleChangeHandler = (event) => {
    setTitle(event.target.value);

    // setUserInput({
    //   ...userInput,
    //   title: event.target.value,
    // });

    // setUserInput((prevState) => {
    //   return { ...prevState, title: event.target.value };
    // });
  };
  const amountChangeHandler = (event) => {
    setAmount(event.target.value);

    // setUserInput({
    //   ...userInput,
    //   amount: event.target.value,
    // });
  };
  const dateChangeHandler = (event) => {
    // console.log(event.target.value);

    setDate(event.target.value);

    // setUserInput({
    //   ...userInput,
    //   date: event.target.value,
    // });
  };

  const categoryChangeHandler = (event) => {
    setCategory(event.target.value);
  };

  const sumbitHandeler = (event) => {
    event.preventDefault();

    const expenseData = {
      title: enteredTitle,
      amount: parseFloat(enteredAmount),
      date: new Date(enteredDate),
      category: enteredCategory,
    };

    // console.log(expenseData);
    props.onSaveExpenseData(expenseData);

    setTitle("");
    setAmount("");
    setDate("");
  };

  return (
    <form onSubmit={sumbitHandeler}>
      <div className="new-expense__controls">
        <div className="new-expense__control">
          <label>{t("titleLabel")}</label>
          <input
            type="text"
            value={enteredTitle}
            onChange={titleChangeHandler}
          />
        </div>
        <div className="new-expense__control">
          <label>{t("amountLabel")}</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={enteredAmount}
            onChange={amountChangeHandler}
          />
        </div>
        <div className="new-expense__control">
          <label>{t("dateLabel")}</label>
          <input
            type="date"
            min="2019-01-01"
            max={new Date().toISOString().slice(0, 10)}
            value={enteredDate}
            onChange={dateChangeHandler}
          />
        </div>
        <div className="new-expense__control">
          <label>{t("categoryLabel")}</label>
          <select value={props.selected} onChange={categoryChangeHandler}>
            {EXPENSE_CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {t(`category.${option}`)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="new-expense__actions">
        <button type="button" onClick={props.onCancel}>
          {t("cancel")}
        </button>
        <button type="submit">{t("addExpense")}</button>
      </div>
    </form>
  );
};

export default ExpenseForm;
