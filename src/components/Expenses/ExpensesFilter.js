import React from "react";

import { useLanguage } from "../../context/LanguageContext";
import "./ExpensesFilter.css";

export const ALL_YEARS = "all";

const CURRENT_YEAR = new Date().getFullYear();
const SELECTABLE_YEARS = [0, 1, 2, 3, 4].map((offset) => CURRENT_YEAR - offset);

const ExpensesFilter = (props) => {
  const { t } = useLanguage();
  const dropdownChangeHandler = (event) => {
    props.onChangeFilter(event.target.value);
  };
  return (
    <div className="expenses-filter">
      <select value={props.selected} onChange={dropdownChangeHandler} aria-label={t("filterByYear")}>
        <option value={ALL_YEARS}>{t("allYears")}</option>
        {SELECTABLE_YEARS.map((year) => (
          <option key={year} value={year.toString()}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ExpensesFilter;
