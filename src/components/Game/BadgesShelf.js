import React from "react";

import Card from "../UI/Card";
import { useGame } from "../../context/GameContext";
import { useLanguage } from "../../context/LanguageContext";
import { badgeCatalog } from "../../utils/badgeDefinitions";
import "./BadgesShelf.css";

const BadgesShelf = () => {
  const { state } = useGame();
  const { t } = useLanguage();

  return (
    <Card className="badges-shelf">
      <h2>{t("badgesTitle")}</h2>
      <ul className="badges-shelf__grid">
        {badgeCatalog.map((badge) => {
          const unlocked = state.unlockedBadgeIds.includes(badge.id);
          return (
            <li
              key={badge.id}
              className={`badges-shelf__badge ${unlocked ? "is-unlocked" : "is-locked"}`}
              title={t(badge.descriptionKey)}
            >
              <span className="badges-shelf__name">{t(badge.nameKey)}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
};

export default BadgesShelf;
