import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const start = window.scrollY;
    const duration = 500; // ms
    let startTime = null;

    const easeInOutQuart = (t) =>
      t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutQuart(progress);

      window.scrollTo(0, start * (1 - ease));

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [pathname]);
}
