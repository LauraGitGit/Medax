import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import "../styles/Hero.css";
import rectangleLogo from "../images/rectangle-with-background.png";
import heroVideo from "../images/6471440-uhd_4096_2160_25fps.mp4";

const PHASES = [
  {
    tag: "DRUG SAFETY",
    heading: "Know what you're taking\nbefore it's too late.",
  },
  {
    tag: "INTERACTIONS",
    heading: "Every drug. Every interaction.\nChecked in seconds.",
  },
  { tag: "STAY SAFE", heading: "Don't guess.\nCheck with Medax." },
];

function ease(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function Hero() {
  const navigate = useNavigate();
  const sceneRef = useRef(null);
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sceneRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const scrolled = -top;
      const total = height - window.innerHeight;
      setRatio(Math.max(0, Math.min(1, scrolled / total)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const expandRatio = ease(Math.min(ratio / 0.2, 1));

  const topVh = 40 * (1 - expandRatio);
  const hPercent = 10 * (1 - expandRatio);
  const botVh = 18 * (1 - expandRatio);
  const br = 999 * (1 - expandRatio);

  const staticOpacity = Math.max(0, 1 - expandRatio * 1.8);

  const textRatio = ratio > 0.2 ? (ratio - 0.2) / 0.8 : 0;
  const rawPhase = textRatio * 3;
  const phaseIndex = Math.min(Math.floor(rawPhase), 2);
  const phaseLocal = rawPhase - Math.floor(rawPhase);

  function getTextStyle(i) {
    if (expandRatio < 0.95)
      return { opacity: 0, transform: "translateY(60px)" };

    const isLast = i === 2;
    if (phaseIndex > i)
      return isLast
        ? { opacity: 1, transform: "translateY(0px)" }
        : { opacity: 0, transform: "translateY(-30px)" };
    if (phaseIndex < i) return { opacity: 0, transform: "translateY(60px)" };

    const inP = ease(Math.min(phaseLocal / 0.25, 1));
    const outP = !isLast ? ease(Math.max((phaseLocal - 0.75) / 0.25, 0)) : 0;
    return {
      opacity: Math.max(0, Math.min(1, inP - outP)),
      transform: `translateY(${60 * (1 - inP) - 30 * outP}px)`,
    };
  }

  return (
    <div className="hero-scene" ref={sceneRef}>
      <div className="hero-sticky">
        <div className="hero-static" style={{ opacity: staticOpacity }}>
          <div className="hero-logo-wrap">
            <img src={rectangleLogo} alt="Medax Logo" className="hero-logo" />
          </div>

          <div className="hero-heading-wrap">
            <span className="badge badge-orange badge-pos-1">DRUG SAFETY</span>
            <h1 className="hero-heading">
              From solo checks
              <br />
              to smart analysis
            </h1>
            <span className="badge badge-olive badge-pos-2">INTERACTIONS</span>
          </div>
        </div>

        <div className="hero-below-video" style={{ opacity: staticOpacity }}>
          <p className="hero-subtext">
            Intelligent medication interaction analysis. Don't guess. Check.
          </p>
          <div className="hero-buttons">
            <button
              className="hero-btn-primary"
              onClick={() => navigate("/steps")}
            >
              START CHECKING
            </button>
          </div>
        </div>

        <div
          className="hero-video-wrap"
          style={{
            top: `${topVh}vh`,
            left: `${hPercent}%`,
            right: `${hPercent}%`,
            bottom: `${botVh}vh`,
            borderRadius: `${br}px`,
          }}
        >
          <video
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            className="hero-video"
          />

          <div
            className="hero-overlay"
            style={{ opacity: expandRatio * 0.5 }}
          />

          {PHASES.map((phase, i) => {
            const s = getTextStyle(i);
            return (
              <div key={i} className="hero-phase-text" style={s}>
                <span className="hero-phase-tag">{phase.tag}</span>
                <p className="hero-phase-heading">{phase.heading}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
