import { useEffect, useState } from "react";

interface SplashScreenProps {
  onDismiss: () => void;
}

const HEART_COUNT = 18;

function generateHearts() {
  return Array.from({ length: HEART_COUNT }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 4 + Math.random() * 4,
    size: 14 + Math.random() * 20,
    opacity: 0.5 + Math.random() * 0.5,
  }));
}

const hearts = generateHearts();

export default function SplashScreen({ onDismiss }: SplashScreenProps) {
  const [exiting, setExiting] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showSub, setShowSub] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowText(true), 200);
    const t2 = setTimeout(() => setShowSub(true), 900);
    const t3 = setTimeout(() => {
      setExiting(true);
      setTimeout(onDismiss, 600);
    }, 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDismiss]);

  const handleDismiss = () => {
    if (!exiting) {
      setExiting(true);
      setTimeout(onDismiss, 600);
    }
  };

  return (
    <button
      type="button"
      className={`fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer overflow-hidden w-full h-full border-0 p-0 ${
        exiting ? "splash-exit" : "animate-fade-in"
      }`}
      style={{
        background:
          "linear-gradient(135deg, #8B1A1A 0%, #C0392B 25%, #E74C7A 50%, #C97A7C 75%, #F2B6BF 100%)",
      }}
      onClick={handleDismiss}
      data-ocid="splash.modal"
    >
      {/* Floating hearts */}
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute pointer-events-none select-none animate-float-up"
          style={{
            left: `${h.left}%`,
            bottom: "-10%",
            fontSize: `${h.size}px`,
            opacity: h.opacity,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
          }}
        >
          ♥
        </span>
      ))}

      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-8">
        {showText && (
          <div className="animate-fade-in-scale">
            <div className="text-8xl mb-4 animate-heartbeat select-none">❤️</div>
            <h1
              className="font-playfair text-white mb-3 select-none"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 5rem)",
                fontWeight: 700,
                textShadow:
                  "0 2px 30px rgba(0,0,0,0.4), 0 0 60px rgba(255,120,150,0.6)",
                letterSpacing: "0.04em",
              }}
            >
              I Love You Baby
            </h1>
          </div>
        )}
        {showSub && (
          <div className="animate-fade-in-up">
            <p
              className="font-dancing text-white/90 mb-8 select-none"
              style={{
                fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
                textShadow: "0 1px 12px rgba(0,0,0,0.3)",
              }}
            >
              You are my everything ✨
            </p>
            <p className="font-lato text-white/60 text-sm tracking-widest uppercase select-none">
              Click anywhere to continue
            </p>
          </div>
        )}
      </div>

      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(255,160,180,0.25), transparent)",
        }}
      />
    </button>
  );
}
