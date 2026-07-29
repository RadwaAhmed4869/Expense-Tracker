import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";
import { GameProvider } from "./context/GameContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <LanguageProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </LanguageProvider>
  </ThemeProvider>
);

// https://reactjs.org/link/switch-to-createroot
