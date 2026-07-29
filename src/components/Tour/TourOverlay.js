import React from "react";

import { useTour } from "../../context/TourContext";
import { useLanguage } from "../../context/LanguageContext";
import useTourTargetRect from "./useTourTargetRect";
import "./TourOverlay.css";

const SPOTLIGHT_PADDING = 8;
const TOOLTIP_WIDTH = 320; // matches .tour-tooltip's max-width: 20rem
const VIEWPORT_MARGIN = 16;

const TourOverlay = () => {
  const { isActive, currentStep, stepIndex, totalSteps, next, back, skip } = useTour();
  const { t } = useLanguage();
  const rect = useTourTargetRect(isActive ? currentStep?.target : null);

  if (!isActive || !currentStep) return null;

  const hasRect = !!rect;
  const spotlightStyle = hasRect
    ? {
        top: rect.top - SPOTLIGHT_PADDING,
        left: rect.left - SPOTLIGHT_PADDING,
        width: rect.width + SPOTLIGHT_PADDING * 2,
        height: rect.height + SPOTLIGHT_PADDING * 2,
      }
    : { opacity: 0 };

  const spaceBelow = hasRect ? window.innerHeight - rect.bottom : 0;
  const placeAbove = hasRect && spaceBelow < 200;
  const clampedLeft = hasRect
    ? Math.min(Math.max(rect.left, VIEWPORT_MARGIN), window.innerWidth - TOOLTIP_WIDTH - VIEWPORT_MARGIN)
    : 0;
  const tooltipStyle = hasRect
    ? placeAbove
      ? { top: rect.top - SPOTLIGHT_PADDING - 8, left: clampedLeft, transform: "translateY(-100%)" }
      : { top: rect.bottom + SPOTLIGHT_PADDING + 8, left: clampedLeft }
    : { opacity: 0 };

  return (
    <div className="tour-backdrop">
      <div className="tour-spotlight" style={spotlightStyle} />
      <div className="tour-tooltip" style={tooltipStyle}>
        <p className="tour-tooltip__counter" dir="ltr">
          {t("tour.stepCounter", { current: stepIndex + 1, total: totalSteps })}
        </p>
        <h3 className="tour-tooltip__title">{t(currentStep.titleKey)}</h3>
        <p className="tour-tooltip__body">{t(currentStep.bodyKey)}</p>
        <div className="tour-tooltip__actions">
          <button type="button" className="tour-tooltip__skip" onClick={skip}>
            {t("tour.skip")}
          </button>
          <div className="tour-tooltip__nav">
            {stepIndex > 0 && (
              <button type="button" className="tour-tooltip__back" onClick={back}>
                {t("tour.back")}
              </button>
            )}
            <button type="button" className="tour-tooltip__next" onClick={next}>
              {stepIndex + 1 === totalSteps ? t("tour.done") : t("tour.next")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourOverlay;
