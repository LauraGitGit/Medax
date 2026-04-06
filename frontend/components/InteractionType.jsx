import "../styles/InteractionType.css";
import { AlertTriangle, Apple, Baby, Check, Info, Link, Wine } from "lucide-react";

const INTERACTION_TYPES = [
  {
    id: "drug-drug",
    label: "Drug-Drug",
    description: "Check interactions between medications",
    icon: Link,
  },
  {
    id: "drug-alcohol",
    label: "Drug-Alcohol",
    description: "Alcohol safety with your meds",
    icon: Wine,
  },
  {
    id: "drug-food",
    label: "Drug-Food",
    description: "Food & dietary interactions",
    icon: Apple,
  },
  {
    id: "pregnancy-breastfeeding",
    label: "Pregnancy & Breastfeeding",
    description: "Pregnancy & breastfeeding safety",
    icon: Baby,
  },
  {
    id: "warnings",
    label: "Warnings",
    description: "General warnings & side effects",
    icon: AlertTriangle,
  },
];

export default function InteractionType({
  interactionTypes = [],
  setInteractionTypes,
  addedMedications = [],
}) {
  const hasAddedMeds = Array.isArray(addedMedications) && addedMedications.length > 0;

  function toggleType(id) {
    setInteractionTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  return (
    <section className="it-section">
      <span className="step-badge">✦ Step 2 of 3</span>

      <h1 className="it-heading">
        What are you<br />
        <span className="it-heading-highlight">concerned</span> about?
      </h1>
      <p className="it-subtitle">
        Choose one or more interaction types you'd like us to analyze.
      </p>

      <div className="it-list" role="group" aria-label="Interaction types">
        {INTERACTION_TYPES.map((option) => {
          const Icon = option.icon;
          const isActive = interactionTypes.includes(option.id);

          return (
            <button
              key={option.id}
              type="button"
              className={`it-row ${isActive ? "it-row--active" : ""}`}
              onClick={() => toggleType(option.id)}
              aria-pressed={isActive}
            >
              <div className="it-icon-box">
                <Icon size={20} aria-hidden="true" />
              </div>

              <div className="it-text">
                <span className="it-label">{option.label}</span>
                <span className="it-desc">{option.description}</span>
              </div>

              <div className={`it-checkbox ${isActive ? "it-checkbox--checked" : ""}`}>
                {isActive && <Check size={12} strokeWidth={3} aria-hidden="true" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="it-hint" role="note" aria-live="polite">
        <Info size={15} aria-hidden="true" />
        <span>
          {interactionTypes.length > 0
            ? `${interactionTypes.length} concern${interactionTypes.length > 1 ? "s" : ""} selected`
            : hasAddedMeds
            ? "Select at least one concern to continue"
            : "Add at least 1 medication first, then select a concern"}
        </span>
      </div>
    </section>
  );
}
