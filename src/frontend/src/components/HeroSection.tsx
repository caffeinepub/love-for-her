import { Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { HeroPhoto } from "../hooks/useQueries";
import { useGetHeroPhoto } from "../hooks/useQueries";

export type { HeroPhoto };

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
  const { data: heroPhoto } = useGetHeroPhoto();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const scrollToQuotes = () => {
    const el = document.getElementById("quotes");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleShare = async () => {
    const shareData = {
      title: "Love For Her ♥",
      text: "Someone loves you ❤️ — check this out!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as DOMException)?.name !== "AbortError") {
          console.error(err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied! Share it with your love ♥");
      } catch {
        toast.error("Could not copy link. Please copy the URL manually.");
      }
    }
  };

  const bgImage = heroPhoto?.dataUrl
    ? heroPhoto.dataUrl
    : "/assets/generated/hero-romantic-bokeh.dim_1920x1080.jpg";

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-ocid="hero.section"
    >
      {/* Background image + gradient overlay */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(80,14,14,0.72) 0%, rgba(139,26,26,0.58) 30%, rgba(192,57,43,0.42) 60%, rgba(242,182,191,0.25) 100%)",
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
                className="font-dancing text-white/90 mb-8"
                style={{
                  fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
                  textShadow: "0 2px 12px rgba(0,0,0,0.4)",
                }}
              >
                Every moment with you is a beautiful memory
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={scrollToQuotes}
                  className="inline-flex items-center gap-2 text-white font-lato font-semibold text-sm tracking-wider px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.52 0.105 10), oklch(0.44 0.125 10))",
                    boxShadow:
                      "0 4px 24px rgba(139,26,26,0.45), 0 1px 6px rgba(0,0,0,0.2)",
                  }}
                  data-ocid="hero.primary_button"
                >
                  Our Love Story ♥
                </button>

                {/* Share Love button */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 text-white font-lato font-semibold text-sm tracking-wider px-7 py-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)",
                    border: "1.5px solid rgba(255,255,255,0.35)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  }}
                  data-ocid="hero.secondary_button"
                >
                  <Share2 className="h-4 w-4" />
                  Share Love ♥
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, oklch(0.95 0.012 22), transparent)",
        }}
      />
    </section>
  );
}
