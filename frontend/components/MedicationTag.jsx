import "../styles/MedicationTag.css";

export default function MedicationTag({ name, onRemove }) {
  return (
    <span className="pill">
      {name}
      <button
        onClick={onRemove}
        type="button"
        className="pill-remove"
        aria-label={`Remove ${name}`}
      >
        x
      </button>
    </span>
  );
}
