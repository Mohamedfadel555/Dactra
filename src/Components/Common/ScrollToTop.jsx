import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // غير "main-content" بالـ id أو class بتاع الـ container عندك
    const el = document.getElementById("main-content");
    if (el) {
      el.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  return null;
}
