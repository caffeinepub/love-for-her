import { useEffect, useState } from "react";

const HERO_HEARTS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  size: 10 + Math.random() * 18,
  delay: Math.random() * 8,
  duration: 6 + Math.random() * 8,
  opacity: 0.3 + Math.random() * 0.4,
}));

export default function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const scrollToShayari = () => {
    const el = document.getElementById("shayari");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-ocid="hero.section"
    >
      {/* Background image + gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-romantic-bokeh.dim_1920x1080.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(139,26,26,0.62) 0%, rgba(192,57,43,0.50) 30%, rgba(201,122,124,0.45) 60%, rgba(242,182,191,0.30) 100%)",
        }}
      />

      {/* Floating hearts */}
      {HERO_HEARTS.map((h) => (
        <span
          key={h.id}
          className="absolute pointer-events-none select-none animate-float-up"
          style={{
            left: `${h.left}%`,
            bottom: "-5%",
            fontSize: `${h.size}px`,
            opacity: h.opacity,
            color: "#fff",
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
          }}
        >
          ♥
        </span>
      ))}

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {visible && (
          <>
            <div
              className="animate-fade-in-scale"
              style={{ animationDelay: "0.1s", animationFillMode: "both" }}
            >
              <div className="text-5xl mb-6 animate-heartbeat select-none">
                ❤️
              </div>
              <h1
                className="font-playfair text-white mb-4"
                style={{
                  fontSize: "clamp(3rem, 8vw, 5.5rem)",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  lineHeight: 1.1,
                  textShadow:
                    "0 3px 30px rgba(0,0,0,0.5), 0 1px 6px rgba(0,0,0,0.3)",
                }}
              >
                I Love You
              </h1>
            </div>

            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "0.5s", animationFillMode: "both" }}
            >
              <p
                className="font-dancing text-white/90 mb-10"
                style={{
                  fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
                  textShadow: "0 2px 12px rgba(0,0,0,0.4)",
                }}
              >
                Every moment with you is a beautiful memory
              </p>

              <button
                type="button"
                onClick={scrollToShayari}
                className="inline-flex items-center gap-2 text-white font-lato font-semibold text-sm tracking-wider px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.58 0.085 10), oklch(0.50 0.115 10))",
                  boxShadow:
                    "0 4px 24px rgba(201,122,124,0.5), 0 1px 6px rgba(0,0,0,0.2)",
                }}
                data-ocid="hero.primary_button"
              >
                Scroll to Begin ♥
              </button>
            </div>
          </>
        )}
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, oklch(0.97 0.008 20), transparent)",
        }}
      />
    </section>
  );
}
