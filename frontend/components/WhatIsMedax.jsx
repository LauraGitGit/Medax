import { useEffect, useRef, useState } from "react";
import {
  Wine,
  Utensils,
  Pill,
  Baby,
  Heart,
  Layers,
  Sparkles,
  FileText,
  ShieldCheck,
  Lightbulb,
} from "lucide-react";
import { useNavigate } from "react-router";
import "../styles/WhatIsMedax.css";
import "../styles/AIPowered.css";
import { useTranslation } from "../i18n/LanguageContext.jsx";

const CARD_KEYS = [
  { key: "alcohol", Icon: Wine },
  { key: "food", Icon: Utensils },
  { key: "drugInteractions", Icon: Pill, highlight: true },
  { key: "pregnancy", Icon: Baby },
  { key: "breastfeeding", Icon: Heart },
  { key: "allInOne", Icon: Layers },
];

const AI_FEATURE_KEYS = [
  { key: "summaries", icon: FileText },
  { key: "severity", icon: ShieldCheck },
  { key: "recommendations", icon: Lightbulb },
];

export default function WhatIsMedax() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about-medax"
      className={`wim-section ${isVisible ? "wim-visible" : ""}`}
      ref={sectionRef}
    >
      <span className="wim-label">
        <span className="wim-label-dot" aria-hidden="true" />
        {t("whatIsMedax.label")}
      </span>

      <div className="wim-header">
        <div className="wim-header-left">
          <h2 className="wim-heading">
            {t("whatIsMedax.headingLine1")}
            <br />
            {t("whatIsMedax.headingLine2")}
            <br />
            <em>{t("whatIsMedax.headingLine3")}</em>
          </h2>
          <p className="wim-tagline">{t("whatIsMedax.tagline")}</p>
        </div>
        <div className="wim-header-right">
          <p className="wim-body">{t("whatIsMedax.body1")}</p>
          <p className="wim-body">
            {t("whatIsMedax.body2").includes("GPT-4o mini") ? (
              <>
                {t("whatIsMedax.body2").split("GPT-4o mini")[0]}
                <strong style={{ color: "#c8622a" }}>GPT-4o mini</strong>
                {t("whatIsMedax.body2").split("GPT-4o mini")[1]}
              </>
            ) : (
              t("whatIsMedax.body2")
            )}
          </p>
        </div>
      </div>

      <div className="wim-divider" aria-hidden="true">
        <span className="wim-divider-dot" />
      </div>

      <div className="wim-grid">
        {CARD_KEYS.map(({ key, Icon, highlight }) => (
          <div
            key={key}
            className={`wim-card ${highlight ? "wim-card--highlight" : ""}`}
          >
            <div className="wim-card-icon">
              <Icon size={18} strokeWidth={1.5} />
            </div>
            <p className="wim-card-title">
              {t(`whatIsMedax.cards.${key}.title`)}
            </p>
            <p className="wim-card-desc">
              {t(`whatIsMedax.cards.${key}.desc`)}
            </p>
          </div>
        ))}
      </div>

      <div className="wim-divider wim-divider--spacious" aria-hidden="true">
        <span className="wim-divider-dot" />
      </div>

      <div className="aip-label" style={{ marginBottom: "1.75rem" }}>
        <Sparkles size={13} aria-hidden="true" />
        {t("whatIsMedax.aiLabel")}
      </div>

      <div className="aip-features">
        {AI_FEATURE_KEYS.map(({ key, icon: Icon }) => (
          <div key={key} className="aip-feature">
            <div className="aip-feature-icon">
              <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
            </div>
            <h3 className="aip-feature-title">
              {t(`whatIsMedax.aiFeatures.${key}.title`)}
            </h3>
            <p className="aip-feature-desc">
              {t(`whatIsMedax.aiFeatures.${key}.desc`)}
            </p>
          </div>
        ))}
      </div>

      <div className="aip-demo">
        <div className="aip-demo-label">
          <Sparkles size={12} aria-hidden="true" />
          {t("whatIsMedax.demoLabel")}
        </div>

        <article className="aip-demo-card">
          <div className="aip-demo-card-top">
            <div className="aip-demo-meta">
              <span className="aip-demo-type">{t("whatIsMedax.demoType")}</span>
              <span className="aip-demo-med">
                {t("whatIsMedax.demoMedication")}
              </span>
            </div>
            <span className="aip-demo-badge aip-demo-badge--moderate">
              {t("whatIsMedax.severityModerate")}
            </span>
          </div>
          <p className="aip-demo-summary">{t("whatIsMedax.demoSummary")}</p>
          <div className="aip-demo-rec">
            <strong>{t("whatIsMedax.whatToDo")}</strong>{" "}
            {t("whatIsMedax.demoRecommendation")}
          </div>
        </article>

        <button
          className="aip-cta-btn"
          onClick={() => navigate("/steps")}
          aria-label={t("whatIsMedax.analyzeAria")}
        >
          <Sparkles size={15} aria-hidden="true" />
          {t("whatIsMedax.analyzeBtn")}
        </button>
      </div>
    </section>
  );
}
