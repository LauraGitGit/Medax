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

const CARDS = [
  {
    Icon: Wine,
    title: "Alcohol",
    desc: "Know if your medication is safe with that glass of wine.",
  },
  {
    Icon: Utensils,
    title: "Food",
    desc: "Understand which foods could affect your treatment.",
  },
  {
    Icon: Pill,
    title: "Drug Interactions",
    desc: "Check combinations before mixing medications.",
    highlight: true,
  },
  {
    Icon: Baby,
    title: "Pregnancy",
    desc: "Understand medication safety during pregnancy.",
  },
  {
    Icon: Heart,
    title: "Breastfeeding",
    desc: "Check if your medication passes through breast milk.",
  },
  {
    Icon: Layers,
    title: "All in One Place",
    desc: "Fast, clear answers — no more digging through raw data.",
  },
];

const AI_FEATURES = [
  {
    icon: FileText,
    title: "Plain-English Summaries",
    desc: "No medical jargon. The AI reads the FDA data and rewrites it in simple English.",
  },
  {
    icon: ShieldCheck,
    title: "Severity Assessment",
    desc: "Each result is rated mild, moderate, or severe — so you know instantly what needs attention.",
  },
  {
    icon: Lightbulb,
    title: "Clear Recommendations",
    desc: "Every analysis ends with a clear recommendation to guide you on what to do next.",
  },
];

const DEMO_CARD = {
  medication: "Ibuprofen + Aspirin",
  type: "Drug-Drug Interaction",
  summary:
    "Taking Ibuprofen alongside Aspirin increases the risk of stomach irritation and bleeding. Both medications work in a similar way and combining them reduces the protective lining of your stomach, which can lead to serious discomfort or ulcers over time.",
  recommendation:
    "Talk to your doctor before taking both medications together.",
};

export default function WhatIsMedax() {
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
      {/* ── Header ── */}
      <span className="wim-label">
        <span className="wim-label-dot" aria-hidden="true" />
        About Medax
      </span>

      <div className="wim-header">
        <div className="wim-header-left">
          <h2 className="wim-heading">
            The answers
            <br />
            you need,
            <br />
            <em>when you need them.</em>
          </h2>
          <p className="wim-tagline">Medication safety, simplified.</p>
        </div>
        <div className="wim-header-right">
          <p className="wim-body">
            A lot of people leave with a prescription but still have unanswered
            questions. Medax helps users quickly check medication risks when
            everyday concerns come up — like alcohol, food, or drug
            interactions.
          </p>
          <p className="wim-body">
            Instead of searching through raw medical information, Medax uses{" "}
            <strong style={{ color: "#c8622a" }}>GPT-4o mini</strong> to translate
            complex FDA data into plain-English explanations — so you always
            know exactly what to watch for and what to do next.
          </p>
        </div>
      </div>

      {/* ── Interaction type cards ── */}
      <div className="wim-divider" aria-hidden="true">
        <span className="wim-divider-dot" />
      </div>

      <div className="wim-grid">
        {CARDS.map(({ Icon, title, desc, highlight }) => (
          <div
            key={title}
            className={`wim-card ${highlight ? "wim-card--highlight" : ""}`}
          >
            <div className="wim-card-icon">
              <Icon size={18} strokeWidth={1.5} />
            </div>
            <p className="wim-card-title">{title}</p>
            <p className="wim-card-desc">{desc}</p>
          </div>
        ))}
      </div>

      {/* ── AI sub-section ── */}
      <div className="wim-divider wim-divider--spacious" aria-hidden="true">
        <span className="wim-divider-dot" />
      </div>

      <div className="aip-label" style={{ marginBottom: "1.75rem" }}>
        <Sparkles size={13} aria-hidden="true" />
        AI-Powered Analysis
      </div>

      <div className="aip-features">
        {AI_FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="aip-feature">
            <div className="aip-feature-icon">
              <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
            </div>
            <h3 className="aip-feature-title">{title}</h3>
            <p className="aip-feature-desc">{desc}</p>
          </div>
        ))}
      </div>

      <div className="aip-demo">
        <div className="aip-demo-label">
          <Sparkles size={12} aria-hidden="true" />
          Example AI result
        </div>

        <article className="aip-demo-card">
          <div className="aip-demo-card-top">
            <div className="aip-demo-meta">
              <span className="aip-demo-type">{DEMO_CARD.type}</span>
              <span className="aip-demo-med">{DEMO_CARD.medication}</span>
            </div>
            <span className="aip-demo-badge aip-demo-badge--moderate">
              moderate
            </span>
          </div>
          <p className="aip-demo-summary">{DEMO_CARD.summary}</p>
          <div className="aip-demo-rec">
            <strong>What to do:</strong> {DEMO_CARD.recommendation}
          </div>
        </article>

        <button
          className="aip-cta-btn"
          onClick={() => navigate("/steps")}
          aria-label="Analyze your medications"
        >
          <Sparkles size={15} aria-hidden="true" />
          Analyze My Medications
        </button>
      </div>
    </section>
  );
}
