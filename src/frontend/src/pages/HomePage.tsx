import { useState } from "react";
import Footer from "../components/Footer";
import GallerySection from "../components/GallerySection";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import QuotesSection from "../components/QuotesSection";
import ShayariSection from "../components/ShayariSection";
import SplashScreen from "../components/SplashScreen";

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onDismiss={() => setShowSplash(false)} />}

      <div
        className="min-h-screen"
        style={{
          opacity: showSplash ? 0 : 1,
          transition: "opacity 0.4s ease",
        }}
      >
        <Navbar />
        <main>
          <HeroSection />
          <ShayariSection />
          <QuotesSection />
          <GallerySection />
        </main>
        <Footer />
      </div>
    </>
  );
}
