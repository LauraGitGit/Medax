import "../styles/MedicationTag.css";

export default function MedicationTag({
  name,
  onRemove,
  isSelectionMode = false,
  isSelected = false,
  onSelectToggle,
}) {
  return (
    <span className={`pill ${isSelected ? "selected" : ""}`}>
      {isSelectionMode && (
        <input
          type="checkbox"
          className="pill-checkbox"
          checked={isSelected}
          onChange={onSelectToggle}
          aria-label={`Select ${name}`}
        />
      )}
      {name}
      {!isSelectionMode && (
        <button
          onClick={onRemove}
          type="button"
          className="pill-remove"
          aria-label={`Remove ${name}`}
        >
          x
        </button>
      )}
    </span>
  );
}
