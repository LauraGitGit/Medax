import "../styles/InteractionType.css";
import "../styles/SearchInput.css";
import { AlertTriangle, Apple, Baby, Info, PillIcon, Wine } from "lucide-react";

const INTERACTION_TYPES = [
  { id: "drug-drug", label: "Drug-Drug", icon: PillIcon },
  { id: "drug-alcohol", label: "Drug-Alcohol", icon: Wine },
  { id: "drug-food", label: "Drug-Food", icon: Apple },
  {
    id: "pregnancy-breastfeeding",
    label: "Pregnancy & Breastfeeding",
    icon: Baby,
  },
  { id: "warnings", label: "Warnings", icon: AlertTriangle },
];

export default function InteractionType({
  interactionType,
  setInteractionType,
  addedMedications = [],
}) {
  const hasAddedMeds =
    Array.isArray(addedMedications) && addedMedications.length > 0;

  return (
    <section className="tabs-step-section">
      <span className="step-badge">Step 2</span>
      <h2 className="step-title">What are you concerned about?</h2>

      <div
        className="tabs-container"
        role="tablist"
        aria-label="Interaction type"
      >
        {INTERACTION_TYPES.map((interactionOption) => {
          const Icon = interactionOption.icon;
          const isActive = interactionType === interactionOption.id;

          return (
            <button
              key={interactionOption.id}
              type="button"
              className={`tab-button ${isActive ? "active" : ""}`}
              onClick={() => setInteractionType(interactionOption.id)}
              role="tab"
              aria-selected={isActive}
            >
              <Icon size={20} aria-hidden="true" />
              <span>{interactionOption.label}</span>
            </button>
          );
        })}
      </div>

      {!hasAddedMeds && (
        <div className="hint-box" role="note" aria-live="polite">
          <Info size={18} aria-hidden="true" />
          <p>Add at least 1 medication to check for medication interactions</p>
        </div>
      )}
    </section>
  );
}
