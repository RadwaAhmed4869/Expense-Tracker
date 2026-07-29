import React from "react";

import Card from "../UI/Card";
import { BadgesIcon, BadgeIcon } from "../UI/icons";
import { useGame } from "../../context/GameContext";
import { useLanguage } from "../../context/LanguageContext";
import { badgeCatalog } from "../../utils/badgeDefinitions";
import "./BadgesShelf.css";

const BadgesShelf = () => {
  const { state } = useGame();
  const { t } = useLanguage();

  return (
    <Card className="badges-shelf" data-tour="badges-shelf">
      <h2 className="panel-title">
        <BadgesIcon />
        {t("badgesTitle")}
      </h2>
      <div className="badges-shelf__body">
        <ul className="badges-shelf__grid">
          {badgeCatalog.map((badge) => {
            const unlocked = state.unlockedBadgeIds.includes(badge.id);
            return (
              <li
                key={badge.id}
                className={`badges-shelf__badge ${unlocked ? "is-unlocked" : "is-locked"}`}
                title={t(badge.descriptionKey)}
              >
                <BadgeIcon />
                <span className="badges-shelf__name">{t(badge.nameKey)}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
};

export default BadgesShelf;
