import React from "react";

import { useLanguage } from "../../context/LanguageContext";
import "./ExpensesFilter.css";

const ExpensesFilter = (props) => {
  const { t } = useLanguage();
  const dropdownChangeHandler = (event) => {
    props.onChangeFilter(event.target.value);
  };
  return (
    <div className="expenses-filter">
      <div className="expenses-filter__control">
        <label>{t("filterByYear")}</label>
        <select value={props.selected} onChange={dropdownChangeHandler}>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </select>
      </div>
    </div>
  );
};

export default ExpensesFilter;
