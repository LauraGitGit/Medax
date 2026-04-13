import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import WhatIsMedax from "../components/WhatIsMedax.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import MedicationManager from "../components/MedicationManager.jsx";
import DownloadApp from "../components/DownloadApp.jsx";
import CallToAction from "../components/CallToAction.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/App.css";

// REVIEW: App.css is also imported in App.jsx—duplicate global import; keep a single entry to avoid confusion.
export default function HomePage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) {
      // REVIEW: behavior "instant" is non-standard; TypeScript DOM typings expect "auto" | "smooth"—verify Safari support.
      el.scrollIntoView({ behavior: "instant" });
    }
  }, []);

  return (
    <div className="app-container">
      {/* No <main>: add one landmark wrapping primary content (e.g. Hero through CallToAction) and keep Header/Footer or utilities outside for skip-link / screen-reader flow. */}
      <Header />
      <Hero />
      <WhatIsMedax />
      <HowItWorks />
      <MedicationManager />
      <DownloadApp />
      <CallToAction />
      <Footer />

      <button
        className={`back-to-top ${visible ? "back-to-top--visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  );
}
