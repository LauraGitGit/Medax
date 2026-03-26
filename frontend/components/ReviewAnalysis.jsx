import "../styles/ReviewAnalysis.css";
import { AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchMedicationLabel } from "../openFdaApi";

export default function ReviewAnalysis({ addedMedications, interactionType }) {
  const [results, setResults] = useState([]);

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
      ],
      "drug-food": ["food", "milk", "eat", "stomach"],
      "drug-drug": ["drug", "medication", "medicine", "taking"],
      "pregnancy-breastfeeding": ["pregnant", "pregnancy", "breast", "nursing"],
    };

    const relevantKeywords = keywords[type] || [];

    const relevant = sentences.filter((sentence) =>
      relevantKeywords.some((keyword) =>
        sentence.toLowerCase().includes(keyword),
      ),
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
    if (addedMedications.length === 0) {
      setResults([]);
      return;
    }

    async function fetchInteractions() {
      const allResults = await Promise.all(
        addedMedications.map(async (medication) => {
          return fetchMedicationLabel(medication);
        }),
      );
      setResults(allResults.filter(Boolean));
    }

    fetchInteractions();
  }, [addedMedications, interactionType]);

  return (
    <div className="step-three-section">
      <span className="step-badge">Step 3</span>
      <h2 className="step-title">Review Analysis</h2>

      {addedMedications.length === 0 ? (
        <section className="ready-state-card" aria-live="polite">
          <div className="ready-state-icon">
            <ShieldCheck size={30} aria-hidden="true" />
          </div>
          <h3 className="ready-state-title">Ready to Analyze</h3>
          <p className="ready-state-text">
            Add at least 1 medication to check for medication interactions
          </p>
        </section>
      ) : !interactionType ? (
        <section className="ready-state-card" aria-live="polite">
          <div className="ready-state-icon">
            <ShieldCheck size={30} aria-hidden="true" />
          </div>
          <h3 className="ready-state-title">Choose an Interaction</h3>
          <p className="ready-state-text">
            Select one of the interaction tabs to see the analysis
          </p>
        </section>
      ) : results.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="results-list">
          {results.map((result, index) => {
            const fieldName = FDA_FIELD_MAP[interactionType];
            const interactionText = extractRelevantText(
              result?.[fieldName]?.[0],
              interactionType,
            );
            const medName =
              result?.openfda?.brand_name?.[0] || addedMedications[index];
            const severity = getSeverity(interactionText);
            const SeverityIcon =
              severity === "mild" ? ShieldCheck : AlertTriangle;

            if (!interactionText) {
              return (
                <article key={index} className="interaction-item">
                  <div className="interaction-info">
                    <div className="interaction-meds">{medName}</div>
                    <div className="interaction-summary-text">
                      No {interactionType} interaction data found.
                    </div>
                  </div>
                </article>
              );
            }

            return (
              <article key={index} className={`interaction-item ${severity}`}>
                <div className="interaction-summary">
                  <div className="interaction-icon">
                    <SeverityIcon size={28} aria-hidden="true" />
                  </div>
                  <div className="interaction-info">
                    <div className="interaction-meds">{medName}</div>
                    <div className="interaction-summary-text">
                      {interactionText}
                    </div>

                    {/* TODO: Add FASS link when FASS URL is ready */}
                    {/*
                    <a
                      href={`https://www.fass.se/LIF/substance?userType=0&query=${medName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fass-link"
                    >
                      View on FASS <ArrowRight size={16} aria-hidden="true" />
                    </a>
                    */}
                  </div>
                  <span className={`risk-badge ${severity}`}>{severity}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
