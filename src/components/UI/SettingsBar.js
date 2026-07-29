import React from "react";

import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import "./SettingsBar.css";

const SettingsBar = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, toggleLanguage } = useLanguage();

  return (
    <div className="settings-bar">
      <button type="button" className="settings-bar__button" onClick={toggleTheme}>
        {theme === "dark" ? t("themeToggleToLight") : t("themeToggleToDark")}
      </button>
      <button type="button" className="settings-bar__button" onClick={toggleLanguage}>
        {t("languageToggle")}
      </button>
    </div>
  );
};

export default SettingsBar;
