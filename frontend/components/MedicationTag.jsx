import "../styles/MedicationTag.css";
import { useTranslation } from "../i18n/LanguageContext.jsx";

export default function MedicationTag({
  name,
  onRemove,
  isSelectionMode = false,
  isSelected = false,
  onSelectToggle,
}) {
  const { t } = useTranslation();

  return (
    <span className={`pill ${isSelected ? "selected" : ""}`}>
      {isSelectionMode && (
        <input
          type="checkbox"
          className="pill-checkbox"
          checked={isSelected}
          onChange={onSelectToggle}
          aria-label={t("searchInput.selectMed", { name })}
        />
      )}
      {name}
      {!isSelectionMode && (
        <button
          onClick={onRemove}
          type="button"
          className="pill-remove"
          aria-label={t("searchInput.removeMed", { name })}
        >
          x
        </button>
      )}
    </span>
  );
}
