import React, { useEffect } from "react";

import { useGame } from "../../context/GameContext";
import { useLanguage } from "../../context/LanguageContext";
import { badgeCatalog } from "../../utils/badgeDefinitions";
import "./RewardToast.css";

const TOAST_LIFETIME_MS = 4000;

const describeToast = (toast, t) => {
  if (toast.type === "levelup") {
    return { title: t("toast.levelUp.title"), body: t("toast.levelUp.body", { level: toast.payload.level }) };
  }
  if (toast.type === "badge") {
    const badge = badgeCatalog.find((b) => b.id === toast.payload.badgeId);
    const name = badge ? t(badge.nameKey) : "";
    return {
      title: t("toast.badgeUnlocked.title", { name }),
      body: badge ? t(badge.descriptionKey) : "",
    };
  }
  if (toast.type === "quest") {
    const title = t(`quest.${toast.payload.questType}.title`);
    return {
      title: t("toast.questComplete.title", { title }),
      body: t("toast.xpReward", { xp: toast.payload.rewardXP }),
    };
  }
  return { title: "", body: "" };
};

const Toast = ({ toast, onDismiss }) => {
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), TOAST_LIFETIME_MS);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const { title, body } = describeToast(toast, t);

  return (
    <div className={`reward-toast reward-toast--${toast.type}`}>
      <strong>{title}</strong>
      <p>{body}</p>
    </div>
  );
};

const RewardToast = () => {
  const { state, dispatch } = useGame();

  const dismiss = (id) => dispatch({ type: "DISMISS_TOAST", payload: { id } });

  if (state.pendingToasts.length === 0) return null;

  return (
    <div className="reward-toast__stack">
      {state.pendingToasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
};

export default RewardToast;
