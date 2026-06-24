import "../styles/InteractionType.css";
import {
  AlertTriangle,
  Apple,
  Baby,
  Check,
  Info,
  Link,
  Wine,
} from "lucide-react";
import { useTranslation } from "../i18n/LanguageContext.jsx";

const INTERACTION_TYPE_IDS = [
  "drug-drug",
  "drug-alcohol",
  "drug-food",
  "pregnancy-breastfeeding",
  "warnings",
];

const INTERACTION_ICONS = {
  "drug-drug": Link,
  "drug-alcohol": Wine,
  "drug-food": Apple,
  "pregnancy-breastfeeding": Baby,
  warnings: AlertTriangle,
};

export default function InteractionType({
  interactionTypes = [],
  setInteractionTypes,
  addedMedications = [],
}) {
  const { t, tp } = useTranslation();
  const hasAddedMeds =
    Array.isArray(addedMedications) && addedMedications.length > 0;

  const allSelected = INTERACTION_TYPE_IDS.every((id) =>
    interactionTypes.includes(id),
  );

  function toggleType(id) {
    setInteractionTypes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  function toggleAll() {
    setInteractionTypes(allSelected ? [] : [...INTERACTION_TYPE_IDS]);
  }

  return (
    <section className="it-section">
      <span className="step-badge">{t("interactionType.badge")}</span>

      <h1 className="it-heading">
        {t("interactionType.title")}
        <br />
        <span className="it-heading-highlight">
          {t("interactionType.titleHighlight")}
        </span>{" "}
        {t("interactionType.titleEnd")}
      </h1>

      <div className="it-subtitle-row">
        <p className="it-subtitle">{t("interactionType.subtitle")}</p>
        <button
          type="button"
          className={`it-select-all ${allSelected ? "it-select-all--active" : ""}`}
          onClick={toggleAll}
        >
          {allSelected
            ? t("interactionType.deselectAll")
            : t("interactionType.selectAll")}
        </button>
      </div>

      <div
        className="it-list"
        role="group"
        aria-label={t("interactionType.typesAria")}
      >
        {INTERACTION_TYPE_IDS.map((id) => {
          const Icon = INTERACTION_ICONS[id];
          const isActive = interactionTypes.includes(id);

          return (
            <button
              key={id}
              type="button"
              className={`it-row ${isActive ? "it-row--active" : ""}`}
              onClick={() => toggleType(id)}
              aria-pressed={isActive}
            >
              <div className="it-icon-box">
                <Icon size={20} aria-hidden="true" />
              </div>

              <div className="it-text">
                <span className="it-label">
                  {t(`interactionType.types.${id}.label`)}
                </span>
                <span className="it-desc">
                  {t(`interactionType.types.${id}.description`)}
                </span>
              </div>

              <div
                className={`it-checkbox ${isActive ? "it-checkbox--checked" : ""}`}
              >
                {isActive && (
                  <Check size={12} strokeWidth={3} aria-hidden="true" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="it-hint" role="note" aria-live="polite">
        <Info size={15} aria-hidden="true" />
        <span>
          {interactionTypes.length > 0
            ? tp("interactionType.concernsSelected", interactionTypes.length)
            : hasAddedMeds
              ? t("interactionType.selectOne")
              : t("interactionType.addMedFirst")}
        </span>
      </div>
    </section>
  );
}
