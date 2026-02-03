import "../styles/Footer.css";
import { TriangleAlert } from "lucide-react";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <TriangleAlert size={18} aria-hidden="true" />
        <p>
          Drug interaction data is sourced from the U.S. Food & Drug
          Administration (OpenFDA). This is a study project — always consult
          your healthcare provider or pharmacist before making any changes to
          your medication regimen.
        </p>
      </div>
    </footer>
  );
}
