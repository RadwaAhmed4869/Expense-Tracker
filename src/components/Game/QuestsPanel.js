import React from "react";

import Card from "../UI/Card";
import { useGame } from "../../context/GameContext";
import { useLanguage } from "../../context/LanguageContext";
import { QUEST_TYPES } from "../../utils/questDefinitions";
import "./QuestsPanel.css";

const describeProgress = (quest) => {
  if (quest.type === QUEST_TYPES.CATEGORY_BUDGET) {
    return `$${quest.progress.toFixed(2)} / $${quest.target.toFixed(2)}`;
  }
  return `${quest.progress} / ${quest.target}`;
};

const QuestsPanel = () => {
  const { state } = useGame();
  const { t } = useLanguage();
  const activeQuests = state.quests.filter((quest) => quest.status === "active");

  return (
    <Card className="quests-panel">
      <h2>{t("activeQuests")}</h2>
      {activeQuests.length === 0 && <p className="quests-panel__empty">{t("noActiveQuests")}</p>}
      <ul className="quests-panel__list">
        {activeQuests.map((quest) => {
          const ratio = Math.min(quest.progress / quest.target, 1);
          const title = t(`quest.${quest.type}.title`);
          const description = t(`quest.${quest.type}.description`, {
            target: quest.target,
            cap: quest.target,
            category: quest.category ? t(`category.${quest.category}`) : "",
          });
          return (
            <li key={quest.id} className="quests-panel__item">
              <div className="quests-panel__item-header">
                <span className="quests-panel__title">{title}</span>
                <span className="quests-panel__reward">{t("toast.xpReward", { xp: quest.rewardXP })}</span>
              </div>
              <p className="quests-panel__description">{description}</p>
              <div className="quests-panel__track">
                <div className="quests-panel__fill" style={{ width: `${ratio * 100}%` }} />
              </div>
              <span className="quests-panel__progress" dir="ltr">
                {describeProgress(quest)}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
};

export default QuestsPanel;
