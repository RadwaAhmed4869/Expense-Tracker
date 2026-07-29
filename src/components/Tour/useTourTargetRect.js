import { useEffect, useState } from "react";

const MAX_STABILIZE_FRAMES = 30;
const STABLE_THRESHOLD_PX = 1;

const readRect = (target) => {
  const element = document.querySelector(target);
  return element ? element.getBoundingClientRect() : null;
};

const rectsAreClose = (a, b) =>
  a &&
  b &&
  Math.abs(a.top - b.top) < STABLE_THRESHOLD_PX &&
  Math.abs(a.left - b.left) < STABLE_THRESHOLD_PX &&
  Math.abs(a.width - b.width) < STABLE_THRESHOLD_PX &&
  Math.abs(a.height - b.height) < STABLE_THRESHOLD_PX;

const useTourTargetRect = (target) => {
  const [rect, setRect] = useState(null);

  useEffect(() => {
    if (!target) {
      setRect(null);
      return undefined;
    }

    let cancelled = false;
    let frame = 0;

    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    const stabilize = (previousRect, framesLeft) => {
      if (cancelled) return;
      const nextRect = readRect(target);
      if (!nextRect) return;

      if (rectsAreClose(previousRect, nextRect) || framesLeft <= 0) {
        setRect(nextRect);
        return;
      }

      frame = requestAnimationFrame(() => stabilize(nextRect, framesLeft - 1));
    };

    stabilize(readRect(target), MAX_STABILIZE_FRAMES);

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const nextRect = readRect(target);
        if (nextRect) setRect(nextRect);
      }, 100);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [target]);

  return rect;
};

export default useTourTargetRect;
