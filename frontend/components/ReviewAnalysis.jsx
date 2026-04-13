import "../styles/ReviewAnalysis.css";
import { Activity, AlertTriangle, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchMedicationLabel } from "../openFdaApi";

const TYPE_LABELS = {
  "drug-drug": "Drug-Drug",
  "drug-alcohol": "Drug-Alcohol",
  "drug-food": "Drug-Food",
  "pregnancy-breastfeeding": "Pregnancy & Breastfeeding",
  warnings: "Warnings",
};

export default function ReviewAnalysis({
  addedMedications,
  interactionTypes = [],
}) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // REVIEW: OpenFDA label fields vary by SPL; top-level keys may be missing—validate mapping against real API payloads.
  const FDA_FIELD_MAP = {
    "drug-drug": "ask_doctor_or_pharmacist",
    "drug-alcohol": "warnings",
    "drug-food": "when_using",
    "pregnancy-breastfeeding": "pregnancy_or_breast_feeding",
    warnings: "warnings",
  };

  function extractRelevantText(text, type) {
    if (!text) return null;
    const sentences = text.split(/\.|\n/).filter(Boolean);
    const keywords = {
      "drug-alcohol": ["alcohol", "drinking"],
      warnings: [
        "warning",
        "risk",
        "bleeding",
        "heart",
        "stroke",
        "allergy",
        "allergic",
        "dosage",
      ],
      "drug-food": ["food", "milk", "eat", "stomach"],
      "drug-drug": ["drug", "medication", "medicine", "taking"],
      "pregnancy-breastfeeding": ["pregnant", "pregnancy", "breast", "nursing"],
    };
    const relevant = sentences.filter((s) =>
      (keywords[type] || []).some((kw) => s.toLowerCase().includes(kw)),
    );
    return relevant.length > 0
      ? relevant.slice(0, 2).join(". ").trim() + "."
      : sentences[0];
  }

  function getSeverity(text) {
    if (!text) return "mild";
    const lower = text.toLowerCase();
    if (
      lower.includes("severe") ||
      lower.includes("serious") ||
      lower.includes("life-threatening") ||
      lower.includes("fatal") ||
      lower.includes("death")
    )
      return "severe";
    if (
      lower.includes("risk") ||
      lower.includes("bleeding") ||
      lower.includes("heart") ||
      lower.includes("stroke") ||
      lower.includes("allergy") ||
      lower.includes("allergic") ||
      lower.includes("warning")
    )
      return "moderate";
    return "mild";
  }

  useEffect(() => {
    if (addedMedications.length === 0 || interactionTypes.length === 0) {
      setResults([]);
      return;
    }
    setLoading(true);
    // REVIEW: If any fetchMedicationLabel rejects, loading never clears—wrap in try/finally and show an error state.
    async function fetchInteractions() {
      const allResults = await Promise.all(
        addedMedications.map((med) => fetchMedicationLabel(med)),
      );
      setResults(allResults.filter(Boolean));
      setLoading(false);
    }
    fetchInteractions();
  }, [addedMedications, interactionTypes]);

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

      {loading && (
        <div className="ra-empty-card">
          <div className="ra-empty-icon ra-empty-icon--pulse">
            <Activity size={26} aria-hidden="true" />
          </div>
          <h3 className="ra-empty-title">Analyzing…</h3>
          <p className="ra-empty-text">Fetching data from the FDA database.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="ra-results">
          {interactionTypes.map((type) => (
            <div key={type} className="ra-type-group">
              <h2 className="ra-type-label">{TYPE_LABELS[type]}</h2>
              {results.map((result, index) => {
                const fieldName = FDA_FIELD_MAP[type];
                const interactionText = extractRelevantText(
                  result?.[fieldName]?.[0],
                  type,
                );
                // REVIEW: Index ties result to addedMedications order—fragile if Promise.all result order diverges from filters.
                const medName =
                  result?.openfda?.brand_name?.[0] || addedMedications[index];
                const severity = getSeverity(interactionText);
                const colors = SEVERITY_COLOR[severity];
                const SeverityIcon =
                  severity === "mild" ? ShieldCheck : AlertTriangle;

                return (
                  <>
                    {/* REVIEW: Prefer stable keys (e.g. medName + type) over index when list order can change. */}
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
                        <span className="ra-card-name">{medName}</span>
                        <p className="ra-card-text">
                          {interactionText ||
                            `No ${type} interaction data found.`}
                        </p>
                      </div>

                      <span
                        className="ra-badge"
                        style={{ background: colors.badge }}
                      >
                        {severity}
                      </span>
                    </article>
                  </>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
