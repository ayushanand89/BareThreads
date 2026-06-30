import { useEffect } from "react";
import { useLocation } from "react-router";

// Scrolls the window to the top whenever the route (pathname) changes,
// so navigating to a new page always starts at the top instead of
// retaining the previous scroll position.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
