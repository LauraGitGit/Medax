import "../styles/SearchInput.css";
import { useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";
import icons8Plus from "../images/icons8-plus.svg";
import MedicationTag from "./MedicationTag";
import { fetchMedicationSuggestions } from "../openFdaApi";

export default function SearchInput({ addedMedications, setAddedMedications }) {
  const searchSectionRef = useRef(null);
  const [searchMedication, setSearchMedication] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMedications, setSelectedMedications] = useState([]);

  useEffect(() => {
    if (!searchMedication.trim()) {
      setSuggestions([]);
      return;
    }
    async function fetchMedications() {
      try {
        const results = await fetchMedicationSuggestions(searchMedication);
        const names = results
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

  // Edit list
  function handleToggleSelectionMode() {
    setIsSelectionMode((prevMode) => {
      const nextMode = !prevMode;
      if (!nextMode) {
        setSelectedMedications([]);
      }
      return nextMode;
    });
  }

  function handleSelectMedication(medication) {
    setSelectedMedications((prevSelected) =>
      prevSelected.includes(medication)
        ? prevSelected.filter((med) => med !== medication)
        : [...prevSelected, medication],
    );
  }

  function handleSelectAll() {
    const areAllSelected =
      selectedMedications.length === addedMedications.length;
    setSelectedMedications(areAllSelected ? [] : [...addedMedications]);
  }

  function handleDeleteSelected() {
    if (selectedMedications.length === 0) return;

    setAddedMedications((prevMedications) =>
      prevMedications.filter((med) => !selectedMedications.includes(med)),
    );
    setSelectedMedications([]);
    setIsSelectionMode(false);
  }

  useEffect(() => {
    setSelectedMedications((prevSelected) =>
      prevSelected.filter((med) => addedMedications.includes(med)),
    );
  }, [addedMedications]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!searchSectionRef.current?.contains(event.target)) {
        setSuggestions([]);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

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
        isSelectionMode={isSelectionMode}
        isSelected={selectedMedications.includes(medication)}
        onSelectToggle={() => handleSelectMedication(medication)}
      />
    ));
  }

  return (
    <section className="step-section" ref={searchSectionRef}>
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
        <section
          className="added-medications-panel"
          aria-label="Added medications"
        >
          <div className="added-medications-toolbar">
            <button
              type="button"
              className="selection-button"
              onClick={handleToggleSelectionMode}
            >
              {isSelectionMode ? "Back" : "Edit list"}
            </button>

            {isSelectionMode && (
              <div className="bulk-actions">
                <button
                  type="button"
                  className="selection-button"
                  onClick={handleSelectAll}
                >
                  {selectedMedications.length === addedMedications.length
                    ? "Unselect all"
                    : "Select all"}
                </button>
                <button
                  type="button"
                  className="delete-selected-button"
                  onClick={handleDeleteSelected}
                  disabled={selectedMedications.length === 0}
                >
                  Delete selected ({selectedMedications.length})
                </button>
              </div>
            )}
          </div>

          <div className="added-medications">{renderAddedMedications()}</div>
        </section>
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
