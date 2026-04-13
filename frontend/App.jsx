import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import StepsPage from "./pages/StepsPage.jsx";
import "./styles/App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/steps" element={<StepsPage />} />
      {/* REVIEW: No catch-all / 404 route—unknown paths render blank with no user feedback. */}
    </Routes>
  );
}
