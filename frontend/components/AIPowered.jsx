import { useEffect, useRef, useState } from "react";
import { Sparkles, FileText, ShieldCheck, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router";
import "../styles/AIPowered.css";

const FEATURES = [
  {
    icon: FileText,
    title: "Plain-English Summaries",
    desc: "No medical jargon. The AI reads the FDA data and rewrites it in language anyone can understand.",
  },
  {
    icon: ShieldCheck,
    title: "Severity Assessment",
    desc: "Each result is rated mild, moderate, or severe — so you know instantly what needs attention.",
  },
  {
    icon: Lightbulb,
    title: "Clear Recommendations",
    desc: "Every analysis ends with one actionable step — exactly what you should do next.",
  },
];

const DEMO_CARD = {
  medication: "Ibuprofen + Aspirin",
  type: "Drug-Drug Interaction",
  summary:
    "Taking Ibuprofen alongside Aspirin increases the risk of stomach irritation and bleeding. Both medications work in a similar way and combining them reduces the protective lining of your stomach, which can lead to serious discomfort or ulcers over time.",
  recommendation:
    "Talk to your doctor before taking both medications together.",
  severity: "moderate",
};

export default function AIPowered() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
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
      className={`aip-section ${visible ? "aip-visible" : ""}`}
      ref={sectionRef}
    >
      <div className="aip-label">
        <Sparkles size={13} aria-hidden="true" />
        AI-Powered Analysis
      </div>

      <div className="aip-header">
        <h2 className="aip-heading">
          Powered by AI,
          <br />
          <em>easy to understand.</em>
        </h2>
        <p className="aip-subheading">
          Medax uses <strong>GPT-4o mini</strong> to turn dense FDA pharmaceutical
          data into clear, plain-English explanations — so you never have to
          decode a drug label again.
        </p>
      </div>

      <div className="aip-features">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
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
