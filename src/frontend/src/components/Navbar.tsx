import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Quotes", href: "#quotes" },
  { label: "Gallery", href: "#gallery" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ["home", "quotes", "gallery"];
      let current = "#home";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80) current = `#${id}`;
        }
      }
      setActive(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => scrollTo("#home")}
          className="flex flex-col leading-tight group text-left"
          data-ocid="nav.link"
        >
          <span
            className="font-playfair font-bold text-rose-custom"
            style={{ fontSize: "1.25rem", letterSpacing: "0.06em" }}
          >
            Love For My Love
            <span className="animate-heartbeat inline-block ml-1">♥</span>
          </span>
          <span
            className="font-lato text-muted-foreground"
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Our Love Story
          </span>
        </button>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(link.href);
              }}
              className={`font-lato text-sm font-light transition-all duration-200 relative py-1 ${
                active === link.href
                  ? "text-rose-custom"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="nav.link"
            >
              {link.label}
              {active === link.href && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-rose-custom" />
              )}
            </a>
          ))}
          <Link
            to="/admin"
            className="font-lato text-sm font-light text-muted-foreground hover:text-rose-custom transition-colors duration-200 ml-2 border border-border rounded-full px-4 py-1 hover:border-rose-custom"
            data-ocid="nav.link"
          >
            Admin
          </Link>
        </nav>

        {/* Mobile heart */}
        <div className="md:hidden text-rose-custom animate-heartbeat text-xl">
          ♥
        </div>
      </div>
    </header>
  );
}
