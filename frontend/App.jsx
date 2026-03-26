import Header from "./components/Header.jsx";
import SearchInput from "./components/SearchInput.jsx";
import InteractionType from "./components/InteractionType.jsx";
import ReviewAnalysis from "./components/ReviewAnalysis.jsx";
import Footer from "./components/Footer.jsx";
import { useEffect, useState } from "react";
import "./styles/App.css";

const STORAGE_KEY = "medax_added_medications";

export default function App() {
  const [addedMedications, setAddedMedications] = useState(() => {
    try {
      const savedMedications = localStorage.getItem(STORAGE_KEY);
      if (!savedMedications) return [];

      const parsedMedications = JSON.parse(savedMedications);
      return Array.isArray(parsedMedications) ? parsedMedications : [];
    } catch {
      return [];
    }
  });
  const [interactionType, setInteractionType] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addedMedications));
  }, [addedMedications]);

  return (
    <div className="app-container">
      <Header />
      <SearchInput
        addedMedications={addedMedications}
        setAddedMedications={setAddedMedications}
      />
      <InteractionType
        interactionType={interactionType}
        setInteractionType={setInteractionType}
        addedMedications={addedMedications}
      />
      <ReviewAnalysis
        addedMedications={addedMedications}
        interactionType={interactionType}
      />
      <Footer />
    </div>
  );
}
