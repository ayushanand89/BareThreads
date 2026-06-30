import { useEffect, useState } from "react";
import Topbar from "../Layout/Topbar";
import Navbar from "./Navbar";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-cream/95 backdrop-blur-xl shadow-[0_4px_24px_-12px_rgba(22,20,19,0.25)] border-b border-ink/10"
          : "bg-cream/80 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <Topbar />
      <Navbar scrolled={scrolled} />
    </header>
  );
};

export default Header;
