import "../styles/SearchInput.css";
import { useEffect, useRef, useState } from "react";
import { Pill, Search } from "lucide-react";
import icons8Plus from "../images/icons8-plus.svg";
import MedicationTag from "./MedicationTag";
import { fetchMedicationSuggestions } from "../openFdaApi";

export default function SearchInput({ addedMedications, setAddedMedications }) {
  const searchSectionRef = useRef(null);
  const dropdownRef = useRef(null);
  const [searchMedication, setSearchMedication] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
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

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions]);

  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const item = dropdownRef.current.children[highlightedIndex];
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  function handleKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        suggestions.length === 0
          ? -1
          : Math.min(prev + 1, suggestions.length - 1),
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, -1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        handleAddMedication(suggestions[highlightedIndex]);
      } else if (searchMedication.trim()) {
        handleAddMedication(searchMedication.trim());
      }
    } else if (event.key === "Escape") {
      setSuggestions([]);
      setHighlightedIndex(-1);
    }
  }

  function handleSearchMedication(event) {
    setSearchMedication(event.target.value);
  }

  function handleAddMedication(medication) {
    if (addedMedications.includes(medication)) return;

    setAddedMedications((prevAddedMedications) => [
      ...prevAddedMedications,
      medication,
    ]);
    setSearchMedication("");
    setSuggestions([]);
  }

  function handleRemoveMedication(medication) {
    setAddedMedications((prevMed) =>
      prevMed.filter((med) => med !== medication),
    );
  }

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

  function renderSuggestions() {
    if (suggestions.length === 0) return null;

    return (
      <ul
        id="medication-listbox"
        role="listbox"
        className="dropdown-list"
        ref={dropdownRef}
      >
        {suggestions.map((medication, i) => (
          <li
            key={medication}
            id={`suggestion-${i}`}
            role="option"
            aria-selected={i === highlightedIndex}
            onClick={() => handleAddMedication(medication)}
            onMouseEnter={() => setHighlightedIndex(i)}
            className={`dropdown-item ${i === highlightedIndex ? "dropdown-item--highlighted" : ""}`}
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
      <span className="step-badge">✦ Step 1 of 3</span>

      <h1 className="step-title">
        Add your
        <br />
        <span className="step-title-highlight">medications</span>
      </h1>
      <p className="step-subtitle">
        Search and add all the medications you'd like to check for interactions.
      </p>

      <div className="search-wrapper">
        <Search className="search-icon" size={18} aria-hidden="true" />
        <input
          onChange={handleSearchMedication}
          onKeyDown={handleKeyDown}
          value={searchMedication}
          type="search"
          className="search-input"
          placeholder="Type a medication name..."
          aria-label="Search medication"
          aria-autocomplete="list"
          aria-controls="medication-listbox"
          aria-activedescendant={
            highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined
          }
          autoComplete="off"
        />
        <span className="search-enter-hint">Enter ↵</span>
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
        <div className="search-empty-state" role="note" aria-live="polite">
          <div className="search-empty-icon">
            <Pill size={28} aria-hidden="true" />
          </div>
          <p>
            Type a medication name and press <kbd>Enter</kbd> to add it
          </p>
        </div>
      )}
    </section>
  );
}
