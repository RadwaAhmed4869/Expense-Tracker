import React from 'react';

import { useLanguage } from "../../context/LanguageContext";
import "./ExpenseDate.css";

const ExpenseDate = (props) => {
  const { language } = useLanguage();
  const locale = language === "ar" ? "ar-EG" : "en-US";
  const month = props.date.toLocaleString(locale, { month: "long" });
  const year = props.date.getFullYear();
  const day = props.date.toLocaleString("en-US", { day: "2-digit" });

  return (
    <div className="expense-date">
      <div className="expense-date__month">{month}</div>
      <div className="expense-date__year">{year}</div>
      <div className="expense-date__day">{day}</div>
    </div>
  );
}

export default ExpenseDate;