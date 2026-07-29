import React from "react";

import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTour } from "../../context/TourContext";
import "./SettingsBar.css";

const SunIcon = () => (
  <svg viewBox="0 0 24 24" width="1rem" height="1rem" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="12" r="4.5" />
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="1.5" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22.5" />
      <line x1="1.5" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22.5" y2="12" />
      <line x1="4.2" y1="4.2" x2="6" y2="6" />
      <line x1="18" y1="18" x2="19.8" y2="19.8" />
      <line x1="4.2" y1="19.8" x2="6" y2="18" />
      <line x1="18" y1="6" x2="19.8" y2="4.2" />
    </g>
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" width="1rem" height="1rem" fill="currentColor" aria-hidden="true">
    <path d="M20.5 14.7A8.5 8.5 0 1 1 9.3 3.5a7 7 0 0 0 11.2 11.2z" />
  </svg>
);

const ReplayIcon = () => (
  <svg viewBox="0 0 24 24" width="1rem" height="1rem" fill="currentColor" aria-hidden="true">
    <path d="M12 5V1L7 6l5 5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" />
  </svg>
);

const SettingsBar = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, t, toggleLanguage } = useLanguage();
  const { start: startTour } = useTour();

  return (
    <div className="settings-bar" data-tour="settings-bar">
      <button
        type="button"
        className="settings-bar__button settings-bar__button--icon"
        onClick={toggleTheme}
        aria-label={theme === "dark" ? t("themeToggleToLight") : t("themeToggleToDark")}
      >
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>
      <button type="button" className="settings-bar__button" onClick={toggleLanguage}>
        {language === "en" ? "En" : "Ar"}
      </button>
      <button
        type="button"
        className="settings-bar__button settings-bar__button--icon"
        onClick={startTour}
        aria-label={t("tour.replay")}
      >
        <ReplayIcon />
      </button>
    </div>
  );
};

export default SettingsBar;
