import React, { useState } from "react";

import Card from "../UI/Card";
import { useGame } from "../../context/GameContext";
import { useLanguage } from "../../context/LanguageContext";
import { EXPENSE_CATEGORIES } from "../../utils/questDefinitions";
import "./BudgetSettings.css";

const BudgetSettings = () => {
  const { state, dispatch } = useGame();
  const { t } = useLanguage();
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [cap, setCap] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();
    const monthlyCap = parseFloat(cap);
    if (Number.isNaN(monthlyCap) || monthlyCap <= 0) return;
    dispatch({ type: "SET_BUDGET", payload: { category, monthlyCap } });
    setCap("");
  };

  const removeHandler = (id) => {
    dispatch({ type: "REMOVE_BUDGET", payload: { id } });
  };

  return (
    <Card className="budget-settings">
      <h2>{t("categoryBudgets")}</h2>
      <form className="budget-settings__form" onSubmit={submitHandler}>
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          {EXPENSE_CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {t(`category.${option}`)}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="0.01"
          step="0.01"
          placeholder={t("monthlyCapPlaceholder")}
          value={cap}
          onChange={(event) => setCap(event.target.value)}
        />
        <button type="submit">{t("setBudget")}</button>
      </form>
      <ul className="budget-settings__list">
        {state.budgets.map((budget) => (
          <li key={budget.id} className="budget-settings__item">
            <span>
              {t(`category.${budget.category}`)}: ${budget.monthlyCap.toFixed(2)} {t("perMonth")}
            </span>
            <button type="button" onClick={() => removeHandler(budget.id)}>
              {t("removeBudget")}
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default BudgetSettings;
