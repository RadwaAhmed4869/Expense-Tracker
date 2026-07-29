import React from "react";

import Card from "../UI/Card";
import { LevelIcon, StreakIcon } from "../UI/icons";
import { useGame } from "../../context/GameContext";
import { useLanguage } from "../../context/LanguageContext";
import { getLevelProgress } from "../../utils/gameLogic";
import "./GameBar.css";

const GameBar = () => {
  const { state } = useGame();
  const { t } = useLanguage();
  const { level, progress } = getLevelProgress(state.xp);
  const progressPercent = Math.round(Math.min(Math.max(progress, 0), 1) * 100);

  return (
    <Card className="game-bar" data-tour="game-bar">
      <div className="game-bar__stat">
        <span className="game-bar__label">
          <LevelIcon />
          {t("level")}
        </span>
        <span className="game-bar__value">{level}</span>
      </div>
      <div className="game-bar__xp">
        <div className="game-bar__xp-track">
          <div className="game-bar__xp-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <span className="game-bar__xp-label">{t("xpLabel", { xp: state.xp })}</span>
      </div>
      <div className="game-bar__stat">
        <span className="game-bar__label">
          <StreakIcon />
          {t("streak")}
        </span>
        <span className="game-bar__value">{t("streakDays", { count: state.streakCount })}</span>
      </div>
    </Card>
  );
};

export default GameBar;
