import { useEffect, useRef, useState } from "react";
import { Wine, Utensils, Pill, Baby, Heart, Layers } from "lucide-react";
import "../styles/WhatIsMedax.css";

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

export default function WhatIsMedax() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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
            Instead of searching through raw medical information or waiting for
            general health support, Medax makes those answers easier to
            understand and faster to access — all in one place.
          </p>
        </div>
      </div>

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
              {/* REVIEW: Decorative icons should use aria-hidden="true" if adjacent text already conveys meaning. */}
              <Icon size={18} strokeWidth={1.5} />
            </div>
            <p className="wim-card-title">{title}</p>
            <p className="wim-card-desc">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
