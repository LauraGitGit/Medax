import "../styles/ReviewAnalysis.css";
import { Activity, AlertTriangle, ShieldCheck, Sparkles } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { fetchMedicationLabel, analyzeWithAI } from "../openFdaApi";
import { useTranslation } from "../i18n/LanguageContext.jsx";
import { translations } from "../i18n/translations.js";

const SEVERITY_COLOR = {
  severe: {
    bg: "#fff0f0",
    border: "#f5c0c0",
    badge: "#c0392b",
    icon: "#c0392b",
  },
  moderate: {
    bg: "#fff7f0",
    border: "#f5d9c0",
    badge: "#c8622a",
    icon: "#c8622a",
  },
  mild: {
    bg: "#f7fbf5",
    border: "#c8dfc5",
    badge: "#4a9b5f",
    icon: "#4a9b5f",
  },
};

export default function ReviewAnalysis({
  addedMedications,
  interactionTypes = [],
}) {
  const { t, locale } = useTranslation();
  const tips = useMemo(
    () => translations[locale].reviewAnalysis.tips,
    [locale],
  );

  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [slowLoading, setSlowLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (!loading) return;
    setTipIndex(Math.floor(Math.random() * tips.length));
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % tips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [loading, tips.length]);

  useEffect(() => {
    if (addedMedications.length === 0 || interactionTypes.length === 0) {
      setAnalyses([]);
      setError(null);
      return;
    }

    async function runAnalysis() {
      setLoading(true);
      setError(null);
      setAnalyses([]);
      setSlowLoading(false);

      let slowTimer = null;

      try {
        setLoadingStep(t("reviewAnalysis.loadingFda"));
        const fdaResults = await Promise.all(
          addedMedications.map((med) => fetchMedicationLabel(med)),
        );

        setLoadingStep(t("reviewAnalysis.loadingAi"));
        slowTimer = setTimeout(() => setSlowLoading(true), 8000);
        const aiAnalyses = await analyzeWithAI(
          addedMedications,
          interactionTypes,
          fdaResults,
          locale,
        );

        setAnalyses(aiAnalyses);
      } catch (err) {
        setError(err.message || t("reviewAnalysis.genericError"));
      } finally {
        clearTimeout(slowTimer);
        setLoading(false);
        setLoadingStep("");
        setSlowLoading(false);
      }
    }

    runAnalysis();
  }, [addedMedications, interactionTypes, locale]);

  return (
    <section className="ra-section">
      <span className="step-badge">{t("reviewAnalysis.badge")}</span>

      <h1 className="ra-heading">
        {t("reviewAnalysis.title")}
        <br />
        <span className="ra-heading-highlight">
          {t("reviewAnalysis.titleHighlight")}
        </span>
      </h1>
      <p className="ra-subtitle">{t("reviewAnalysis.subtitle")}</p>

      {addedMedications.length === 0 && (
        <div className="ra-empty-card" aria-live="polite">
          <div className="ra-empty-icon">
            <Activity size={26} aria-hidden="true" />
          </div>
          <h3 className="ra-empty-title">{t("reviewAnalysis.noMedsTitle")}</h3>
          <p className="ra-empty-text">{t("reviewAnalysis.noMedsText")}</p>
        </div>
      )}

      {addedMedications.length > 0 && interactionTypes.length === 0 && (
        <div className="ra-empty-card" aria-live="polite">
          <div className="ra-empty-icon">
            <Activity size={26} aria-hidden="true" />
          </div>
          <h3 className="ra-empty-title">
            {t("reviewAnalysis.noConcernTitle")}
          </h3>
          <p className="ra-empty-text">{t("reviewAnalysis.noConcernText")}</p>
        </div>
      )}

      {loading && (
        <div className="ra-empty-card">
          <div className="ra-empty-icon ra-empty-icon--pulse">
            <Sparkles size={26} aria-hidden="true" />
          </div>
          <h3 className="ra-empty-title">{loadingStep}</h3>
          {slowLoading ? (
            <p className="ra-empty-text">{t("reviewAnalysis.slowLoading")}</p>
          ) : (
            <p className="ra-empty-text">
              {t("reviewAnalysis.loadingDefault")}
            </p>
          )}
          <div className="ra-tip">
            <span className="ra-tip-label">{t("reviewAnalysis.tipLabel")}</span>
            <p className="ra-tip-text">{tips[tipIndex]}</p>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="ra-empty-card ra-error-card" aria-live="polite">
          <div className="ra-empty-icon ra-empty-icon--error">
            <AlertTriangle size={26} aria-hidden="true" />
          </div>
          <h3 className="ra-empty-title">{t("reviewAnalysis.errorTitle")}</h3>
          <p className="ra-empty-text">{error}</p>
          <p className="ra-empty-text ra-error-hint">
            {t("reviewAnalysis.errorHint")}
          </p>
        </div>
      )}

      {!loading && !error && analyses.length > 0 && (
        <>
          <div className="ra-ai-indicator">
            <Sparkles size={13} aria-hidden="true" />
            {t("reviewAnalysis.aiIndicator")}
          </div>

          <div className="ra-results">
            {interactionTypes.map((type) => {
              const typeAnalyses = analyses.filter((a) => a.type === type);
              if (typeAnalyses.length === 0) return null;

              return (
                <div key={type} className="ra-type-group">
                  <h2 className="ra-type-label">
                    {t(`reviewAnalysis.typeLabels.${type}`)}
                  </h2>

                  {typeAnalyses.map((analysis, index) => {
                    const severity = ["mild", "moderate", "severe"].includes(
                      analysis.severity,
                    )
                      ? analysis.severity
                      : "mild";
                    const colors = SEVERITY_COLOR[severity];
                    const SeverityIcon =
                      severity === "mild" ? ShieldCheck : AlertTriangle;

                    return (
                      <article
                        key={index}
                        className="ra-card"
                        style={{
                          background: colors.bg,
                          borderColor: colors.border,
                        }}
                      >
                        <div
                          className="ra-card-icon"
                          style={{ color: colors.icon }}
                        >
                          <SeverityIcon size={22} aria-hidden="true" />
                        </div>

                        <div className="ra-card-body">
                          <span className="ra-card-name">
                            {analysis.medication}
                          </span>
                          <p className="ra-card-text">{analysis.summary}</p>
                          {analysis.recommendation && (
                            <p className="ra-card-recommendation">
                              <strong>{t("reviewAnalysis.whatToDo")}</strong>{" "}
                              {analysis.recommendation}
                            </p>
                          )}
                        </div>

                        <span
                          className="ra-badge"
                          style={{ background: colors.badge }}
                        >
                          {t(`reviewAnalysis.severity.${severity}`)}
                        </span>
                      </article>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
