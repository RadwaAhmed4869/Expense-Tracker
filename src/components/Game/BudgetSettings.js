import React, { useState } from "react";

import Card from "../UI/Card";
import { BudgetIcon, DeleteIcon } from "../UI/icons";
import { useGame } from "../../context/GameContext";
import { useLanguage } from "../../context/LanguageContext";
import { EXPENSE_CATEGORIES, CATEGORY_COLOR_VARS } from "../../utils/questDefinitions";
import { computeCategorySpend, getMonthStart, getMonthEnd } from "../../utils/gameLogic";
import "./BudgetSettings.css";

const BudgetSettings = (props) => {
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

  const today = new Date();
  const monthStart = getMonthStart(today);
  const monthEnd = getMonthEnd(today);
  const expenses = props.expenses || [];

  return (
    <Card className="budget-settings" data-tour="budget-settings">
      <h2 className="panel-title">
        <BudgetIcon />
        {t("categoryBudgets")}
      </h2>
      <div className="budget-settings__body">
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
          {state.budgets.map((budget) => {
            const spent = computeCategorySpend(expenses, budget.category, monthStart, monthEnd);
            const ratio = Math.min(spent / budget.monthlyCap, 1);
            const accentColor = `var(${CATEGORY_COLOR_VARS[budget.category]})`;
            return (
              <li key={budget.id} className="budget-settings__item">
                <div className="budget-settings__item-header">
                  <span className="budget-settings__label">
                    <span className="budget-settings__dot" style={{ backgroundColor: accentColor }} />
                    {t(`category.${budget.category}`)}
                  </span>
                  <button
                    type="button"
                    className="budget-settings__remove"
                    onClick={() => removeHandler(budget.id)}
                    aria-label={t("removeBudget")}
                  >
                    <DeleteIcon />
                  </button>
                </div>
                <div className="budget-settings__track">
                  <div
                    className="budget-settings__fill"
                    style={{ width: `${ratio * 100}%`, backgroundColor: accentColor }}
                  />
                </div>
                <span className="budget-settings__progress">
                  <span dir="ltr">
                    ${spent.toFixed(2)} / ${budget.monthlyCap.toFixed(2)}
                  </span>{" "}
                  {t("perMonth")}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
};

export default BudgetSettings;
