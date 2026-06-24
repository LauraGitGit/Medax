import { useState, useEffect } from "react";
import TopBar from "../components/TopBar.jsx";
import Hero from "../components/Hero.jsx";
import WhatIsMedax from "../components/WhatIsMedax.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import MedicationManager from "../components/MedicationManager.jsx";
import DownloadApp from "../components/DownloadApp.jsx";
import CallToAction from "../components/CallToAction.jsx";
import Footer from "../components/Footer.jsx";
import { useTranslation } from "../i18n/LanguageContext.jsx";
import "../styles/App.css";

export default function HomePage() {
  const { t } = useTranslation();
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
      el.scrollIntoView({ behavior: "instant" });
    }
  }, []);

  return (
    <div className="app-container">
      <TopBar />
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
        aria-label={t("common.backToTop")}
      >
        ↑
      </button>
    </div>
  );
}
