import "../styles/MedicationManager.css";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../i18n/LanguageContext.jsx";

const PILL_LAYOUT = {
  dosageTracker: { left: "18%", top: 10, tilt: 18 },
  medicationSchedule: { left: "30%", top: 22, tilt: -90 },
  healthReportTracker: { left: "44%", top: 8, tilt: 65 },
  interactionCheck: { left: "58%", top: 20, tilt: -65 },
  refillReminder: { left: "71%", top: 12, tilt: 60 },
  skipDoseAlert: { left: "17%", top: 88, tilt: -14 },
  dailyReminder: { left: "29%", top: 80, tilt: 30 },
  scanner: { left: "41%", top: 92, tilt: -12 },
  overdoseWarning: { left: "57%", top: 84, tilt: 90 },
  missedDoseWarning: { left: "70%", top: 78, tilt: -60 },
};

// Swedish version of the pill layout.
const SV_PILL_NUDGE = {
  skipDoseAlert: { left: "12%" },
  dailyReminder: { left: "28%" },
};

const PILL_COLORS = {
  dosageTracker: { color: "#9b8ac4", textColor: "#fff" },
  medicationSchedule: { color: "#d4a82a", textColor: "#fff" },
  healthReportTracker: { color: "#4a9b8e", textColor: "#fff" },
  interactionCheck: { color: "#5b8dee", textColor: "#fff" },
  refillReminder: { color: "#6ec6b8", textColor: "#fff" },
  skipDoseAlert: { color: "#a8b87a", textColor: "#fff" },
  dailyReminder: { color: "#f4a56a", textColor: "#fff" },
  scanner: { color: "#cc7749", textColor: "#fff" },
  overdoseWarning: { color: "#e05c4b", textColor: "#fff" },
  missedDoseWarning: { color: "#e8847a", textColor: "#fff" },
};

const ALL_PILLS = [
  "dosageTracker",
  "medicationSchedule",
  "healthReportTracker",
  "interactionCheck",
  "refillReminder",
  "skipDoseAlert",
  "dailyReminder",
  "scanner",
  "overdoseWarning",
  "missedDoseWarning",
];

const springDrop = { type: "spring", stiffness: 18, damping: 7, mass: 3.8 };
const springRotate = { type: "spring", stiffness: 10, damping: 5, mass: 5.0 };

function getPillPosition(itemKey, locale) {
  const base = PILL_LAYOUT[itemKey];
  if (locale === "sv" && SV_PILL_NUDGE[itemKey]) {
    return { ...base, ...SV_PILL_NUDGE[itemKey] };
  }
  return base;
}

function Pill({ itemKey, index, label, locale }) {
  const colors = PILL_COLORS[itemKey];
  const pos = getPillPosition(itemKey, locale);
  if (!colors || !pos) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -280, rotate: pos.tilt }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{
        opacity: { duration: 0.25, delay: index * 0.18 },
        y: { ...springDrop, delay: index * 0.18 },
        rotate: { ...springRotate, delay: index * 0.18 },
      }}
      whileHover={{
        rotate: [0, -7, 7, -7, 7, 0],
        transition: {
          duration: 0.55,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 0.05,
        },
      }}
      style={{
        position: "absolute",
        left: pos.left,
        top: pos.top,
        height: "52px",
        borderRadius: "999px",
        background: colors.color,
        color: colors.textColor,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "15px",
        fontWeight: 500,
        letterSpacing: "-0.01em",
        padding: "0 22px",
        whiteSpace: "nowrap",
        boxSizing: "border-box",
      }}
    >
      {label}
    </motion.div>
  );
}

export default function MedicationManager() {
  const { t, locale } = useTranslation();
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
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="mm-section" ref={sectionRef}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.5 }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "3.5rem",
        }}
      >
        <span className="mm-label">{t("medicationManager.label")}</span>
        <h2
          className="mm-heading"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "3.5rem",
            fontWeight: 600,
            color: "#1a1a1a",
            lineHeight: 1.15,
            margin: "0 0 1rem",
            textAlign: "center",
            maxWidth: "640px",
          }}
        >
          {t("medicationManager.headingBefore")}
          <em
            style={{
              fontStyle: "italic",
              fontFamily: "'Playfair Display', Georgia, serif",
            }}
          >
            {t("medicationManager.headingEm")}
          </em>
        </h2>
        <p
          style={{
            fontSize: "0.9rem",
            color: "#aaa",
            margin: 0,
            textAlign: "center",
            maxWidth: "420px",
            lineHeight: 1.7,
          }}
        >
          {t("medicationManager.description")}
        </p>
      </motion.div>

      <div className="mm-pills-clip">
        <div className="mm-pills-arena">
          {isVisible &&
            ALL_PILLS.map((itemKey, index) => (
              <Pill
                key={itemKey}
                itemKey={itemKey}
                index={index}
                label={t(`medicationManager.pills.${itemKey}`)}
                locale={locale}
              />
            ))}
        </div>
      </div>
    </section>
  );
}
