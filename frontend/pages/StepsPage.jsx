import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Header from "../components/Header.jsx";
import SearchInput from "../components/SearchInput.jsx";
import InteractionType from "../components/InteractionType.jsx";
import ReviewAnalysis from "../components/ReviewAnalysis.jsx";
import "../styles/App.css";

const STORAGE_KEY = "medax_added_medications";
const TOTAL_STEPS = 3;

export default function StepsPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentStep]);

  const [addedMedications, setAddedMedications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [interactionTypes, setInteractionTypes] = useState([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addedMedications));
  }, [addedMedications]);

  const canGoNext = [
    addedMedications.length > 0,
    interactionTypes.length > 0,
    true,
  ];

  function handleBack() {
    if (currentStep === 0) navigate("/");
    else setCurrentStep((s) => s - 1);
  }

  function handleNext() {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setAddedMedications([]);
      setInteractionTypes([]);
      localStorage.removeItem(STORAGE_KEY);
      setCurrentStep(0);
    }
  }

  const STEP_LABELS = [
    "Add Medications",
    "Interaction Type",
    "Review Analysis",
  ];

  return (
    <div className="app-container steps-wizard">
      <Header />

      <button className="steps-home-btn" onClick={() => navigate("/")}>
        ← Home
      </button>

      <nav className="step-nav" aria-label="Steps">
        {STEP_LABELS.map((label, i) => (
          <button
            key={i}
            className={`step-nav-item step-nav-item--reached ${i === currentStep ? "step-nav-item--active" : ""}`}
            onClick={() => setCurrentStep(i)}
          >
            <span className="step-nav-num">{i + 1}</span>
            <span className="step-nav-label">{label}</span>
            {i < STEP_LABELS.length - 1 && (
              <span className="step-nav-divider" aria-hidden="true" />
            )}
          </button>
        ))}
      </nav>

      <div className="wizard-body">
        {currentStep === 0 && (
          <SearchInput
            addedMedications={addedMedications}
            setAddedMedications={setAddedMedications}
          />
        )}
        {currentStep === 1 && (
          <InteractionType
            interactionTypes={interactionTypes}
            setInteractionTypes={setInteractionTypes}
            addedMedications={addedMedications}
          />
        )}
        {currentStep === 2 && (
          <ReviewAnalysis
            addedMedications={addedMedications}
            interactionTypes={interactionTypes}
          />
        )}
      </div>

      <div className="wizard-footer">
        <button className="wizard-nav-btn wizard-back" onClick={handleBack}>
          ‹ Back
        </button>

        <div className="wizard-dots" aria-label="Step progress">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className={`wizard-dot ${i === currentStep ? "wizard-dot--active" : ""} ${i < currentStep ? "wizard-dot--done" : ""}`}
            />
          ))}
        </div>

        <button
          className="wizard-nav-btn wizard-next"
          onClick={handleNext}
          disabled={!canGoNext[currentStep]}
        >
          {currentStep === TOTAL_STEPS - 1 ? "Finish" : "Next ›"}
        </button>
      </div>

      <button
        className={`back-to-top ${showBackToTop ? "back-to-top--visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  );
}
