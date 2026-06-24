import "../styles/ReviewAnalysis.css";
import { Activity, AlertTriangle, ShieldCheck, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchMedicationLabel, analyzeWithAI } from "../openFdaApi";

const TIPS = [
  "Always take medications exactly as prescribed — never adjust the dose on your own.",
  "Tell your doctor and pharmacist about every supplement and vitamin you take, not just prescriptions.",
  "Never stop a prescribed medication suddenly without consulting your healthcare provider first.",
  "Keep an up-to-date list of all your medications and carry it with you to every appointment.",
  "Some medications need to be taken with food to avoid stomach irritation — check your label.",
  "Store medications at the temperature listed on the packaging — heat and moisture can reduce their effectiveness.",
  "If you miss a dose, do not double up — check the leaflet or ask your pharmacist what to do.",
  "Alcohol can interact with many common medications, even over-the-counter ones.",
];

const TYPE_LABELS = {
  "drug-drug": "Drug-Drug Interactions",
  "drug-alcohol": "Drug-Alcohol Interactions",
  "drug-food": "Drug-Food Interactions",
  "pregnancy-breastfeeding": "Pregnancy & Breastfeeding",
  warnings: "Warnings",
};

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
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [slowLoading, setSlowLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (!loading) return;
    setTipIndex(Math.floor(Math.random() * TIPS.length));
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [loading]);

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
        setLoadingStep("Fetching FDA data…");
        const fdaResults = await Promise.all(
          addedMedications.map((med) => fetchMedicationLabel(med)),
        );

        setLoadingStep("AI is analyzing your medications…");
        slowTimer = setTimeout(() => setSlowLoading(true), 8000);
        const aiAnalyses = await analyzeWithAI(
          addedMedications,
          interactionTypes,
          fdaResults,
        );

        setAnalyses(aiAnalyses);
      } catch (err) {
        setError(err.message || "Something went wrong. Please try again.");
      } finally {
        clearTimeout(slowTimer);
        setLoading(false);
        setLoadingStep("");
        setSlowLoading(false);
      }
    }

    runAnalysis();
  }, [addedMedications, interactionTypes]);

  return (
    <section className="ra-section">
      <span className="step-badge">✦ Step 3 of 3</span>

      <h1 className="ra-heading">
        Review your
        <br />
        <span className="ra-heading-highlight">analysis</span>
      </h1>
      <p className="ra-subtitle">
        Here's a summary of your selections and results.
      </p>

      {/* No medications added */}
      {addedMedications.length === 0 && (
        <div className="ra-empty-card" aria-live="polite">
          <div className="ra-empty-icon">
            <Activity size={26} aria-hidden="true" />
          </div>
          <h3 className="ra-empty-title">No medications added</h3>
          <p className="ra-empty-text">
            Go back to Step 1 to add your medications first.
          </p>
        </div>
      )}

      {/* Medications added but no interaction type chosen */}
      {addedMedications.length > 0 && interactionTypes.length === 0 && (
        <div className="ra-empty-card" aria-live="polite">
          <div className="ra-empty-icon">
            <Activity size={26} aria-hidden="true" />
          </div>
          <h3 className="ra-empty-title">No concern selected</h3>
          <p className="ra-empty-text">
            Go back to Step 2 to choose an interaction type.
          </p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="ra-empty-card">
          <div className="ra-empty-icon ra-empty-icon--pulse">
            <Sparkles size={26} aria-hidden="true" />
          </div>
          <h3 className="ra-empty-title">{loadingStep}</h3>
          {slowLoading ? (
            <p className="ra-empty-text">
              <p className="ra-empty-text">
                Your analysis is on its way. If the service hasn't been used
                recently, it may take up to 30 seconds to start. Thanks for your
                patience.
              </p>
            </p>
          ) : (
            <p className="ra-empty-text">
              Our AI is reading FDA data and preparing a plain language summary
              for you.
            </p>
          )}
          <div className="ra-tip">
            <span className="ra-tip-label">💡 Did you know?</span>
            <p className="ra-tip-text">{TIPS[tipIndex]}</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="ra-empty-card ra-error-card" aria-live="polite">
          <div className="ra-empty-icon ra-empty-icon--error">
            <AlertTriangle size={26} aria-hidden="true" />
          </div>
          <h3 className="ra-empty-title">Analysis failed</h3>
          <p className="ra-empty-text">{error}</p>
          <p className="ra-empty-text ra-error-hint">
            This feature requires a live connection to our analysis server.
            Please try again shortly or contact support.
          </p>
        </div>
      )}

      {/* AI Results */}
      {!loading && !error && analyses.length > 0 && (
        <>
          <div className="ra-ai-indicator">
            <Sparkles size={13} aria-hidden="true" />
            AI-powered analysis
          </div>

          <div className="ra-results">
            {interactionTypes.map((type) => {
              const typeAnalyses = analyses.filter((a) => a.type === type);
              if (typeAnalyses.length === 0) return null;

              return (
                <div key={type} className="ra-type-group">
                  <h2 className="ra-type-label">{TYPE_LABELS[type]}</h2>

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
                              <strong>What to do:</strong>{" "}
                              {analysis.recommendation}
                            </p>
                          )}
                        </div>

                        <span
                          className="ra-badge"
                          style={{ background: colors.badge }}
                        >
                          {severity}
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
