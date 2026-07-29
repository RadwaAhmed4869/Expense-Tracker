import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";
import { GameProvider } from "./context/GameContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { TourProvider } from "./context/TourContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <LanguageProvider>
      <GameProvider>
        <TourProvider>
          <App />
        </TourProvider>
      </GameProvider>
    </LanguageProvider>
  </ThemeProvider>
);

// https://reactjs.org/link/switch-to-createroot
