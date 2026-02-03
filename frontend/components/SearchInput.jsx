import "../styles/SearchInput.css";
import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import icons8Plus from "../images/icons8-plus.svg";
import MedicationTag from "./MedicationTag";

export default function SearchInput({
  addedMedications,
  setAddedMedications,
}) {
  const [searchMedication, setSearchMedication] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!searchMedication.trim()) {
      setSuggestions([]);
      return;
    }
    async function fetchMedications() {
      try {
        const response = await fetch(
          `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${searchMedication}*&limit=8`,
        );
        const data = await response.json();

        const names = data.results
          .map((result) =>
            result.openfda?.brand_name?.[0]?.split(",")[0].trim(),
          )
          .filter(Boolean);

        setSuggestions(names);
      } catch (e) {
        setSuggestions([]);
      }
    }

    fetchMedications();
  }, [searchMedication]);

  // Search medication
  function handleSearchMedication(event) {
    setSearchMedication(event.target.value);
  }

  // Add medication
  function handleAddMedication(medication) {
    if (addedMedications.includes(medication)) return;

    setAddedMedications((prevAddedMedications) => [
      ...prevAddedMedications,
      medication,
    ]);
    setSearchMedication("");
    setSuggestions([]);
  }

  // Remove medication
  function handleRemoveMedication(medication) {
    setAddedMedications((prevMed) =>
      prevMed.filter((med) => med !== medication),
    );
  }

  // Render suggestions
  function renderSuggestions() {
    if (suggestions.length === 0) return null;

    return (
      <ul className="dropdown-list">
        {suggestions.map((medication) => (
          <li
            key={medication}
            onClick={() => handleAddMedication(medication)}
            className="dropdown-item"
          >
            <img
              src={icons8Plus}
              alt=""
              aria-hidden="true"
              className="dropdown-plus-icon"
            />
            {medication}
          </li>
        ))}
      </ul>
    );
  }

  function renderAddedMedications() {
    if (addedMedications.length === 0) return null;

    return addedMedications.map((medication) => (
      <MedicationTag
        key={medication}
        name={medication}
        onRemove={() => handleRemoveMedication(medication)}
      />
    ));
  }

  return (
    <section className="step-section">
      <span className="step-badge">Step 1</span>
      <h2 className="step-title">Search medication</h2>
      <div className="search-wrapper">
        <input
          onChange={handleSearchMedication}
          value={searchMedication}
          type="search"
          className="search-input"
          placeholder="Type a medication name..."
          aria-label="Search medication"
        />
        {renderSuggestions()}
      </div>

      {addedMedications.length > 0 && (
        <div className="added-medications">{renderAddedMedications()}</div>
      )}

      {addedMedications.length === 0 && (
        <div className="hint-box" role="note" aria-live="polite">
          <Info size={18} aria-hidden="true" />
          <p>Start typing in the search box to find and add medications</p>
        </div>
      )}
    </section>
  );
}
