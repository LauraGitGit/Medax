import { useEffect, useRef } from "react";
import "../styles/HowItWorks.css";
import pillIcon from "../images/pill-logo.png";

const STEPS = [
  {
    icon: <img src={pillIcon} alt="Pill icon" className="hiw-pill-icon" />,
    title: "Add Your Medications",
    description:
      "Search and add every medication you're currently taking — prescriptions, supplements, and over-the-counter drugs.",
  },
  {
    icon: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="16" fill="currentColor" />
        <line
          x1="6"
          y1="22"
          x2="38"
          y2="22"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <circle cx="78" cy="78" r="16" fill="currentColor" />
        <line
          x1="62"
          y1="78"
          x2="94"
          y2="78"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <path
          d="M 38 22 L 65 22 L 65 56"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M 57 48 L 65 57 L 73 48"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        <path
          d="M 62 78 L 35 78 L 35 44"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M 27 52 L 35 43 L 43 52"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
    title: "Check Interactions",
    description:
      "Check every combination in seconds — flagging risks, alcohol, food, pregnancy, breastfeeding interactions, and more.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="4"
          y="3"
          width="16"
          height="18"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M8 8h8M8 12h8M8 16h5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M16 15l2 2 3-3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Review & Stay Safe",
    description:
      "Get a clear, readable report. Understand what to watch for and share results with your doctor or pharmacist.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    const section = sectionRef.current;
    if (!path || !section) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    let timeoutId = null;

    const playAnimation = () => {
      path.style.transition = "none";
      path.style.strokeDashoffset = `${length}`;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          path.style.transition =
            "stroke-dashoffset 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
          path.style.strokeDashoffset = "0";
        });
      });
    };

    const onTransitionEnd = () => {
      timeoutId = setTimeout(playAnimation, 600);
    };

    path.addEventListener("transitionend", onTransitionEnd);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          playAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      path.removeEventListener("transitionend", onTransitionEnd);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section id="how-it-works" className="hiw-section" ref={sectionRef}>
      <div className="hiw-header">
        <span className="hiw-label">How it works</span>
        <h2 className="hiw-heading">
          Simple steps to <em>safer</em> medication checks
        </h2>
      </div>

      <div className="hiw-steps">
        <svg
          className="hiw-connector"
          viewBox="0 0 100 12"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            ref={pathRef}
            d="M 17 6 C 28 10, 39 10, 50 6 C 61 2, 72 2, 83 6"
            fill="none"
            stroke="#c8bfb0"
            strokeWidth="0.7"
            strokeLinecap="round"
            className="hiw-path"
          />
        </svg>

        {/* REVIEW: key={i} is stable here but fragile if STEPS reorder—prefer key={step.title}. */}
        {STEPS.map((step, i) => (
          <div key={i} className="hiw-step">
            <div className="hiw-icon-wrap">{step.icon}</div>
            <h3 className="hiw-step-title">{step.title}</h3>
            <p className="hiw-step-desc">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
