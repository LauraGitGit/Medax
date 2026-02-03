import Header from "./components/Header.jsx";
import SearchInput from "./components/SearchInput.jsx";
import InteractionType from "./components/InteractionType.jsx";
import ReviewAnalysis from "./components/ReviewAnalysis.jsx";
import Footer from "./components/Footer.jsx";
import { useState } from "react";
import "./styles/App.css";

export default function App() {
  const [addedMedications, setAddedMedications] = useState([]);
  const [interactionType, setInteractionType] = useState("");

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
