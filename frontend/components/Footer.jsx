import "../styles/Footer.css";
import { useNavigate } from "react-router";

export default function Footer({ minimal = false }) {
  const navigate = useNavigate();

  return (
    <footer
      id="contact"
      className={`ft-wrap ${minimal ? "ft-wrap--minimal" : ""}`}
    >
      {!minimal && (
        <div className="ft-grid">
          <div className="ft-col">
            <span className="ft-col-label">Email Us</span>
            <a href="mailto:hello@medax.app" className="ft-email">
              hello@medax.app
            </a>
            <p className="ft-copy">© 2026 Medax</p>
            {/* REVIEW: href="#" is a dead link and hurts accessibility—wire real routes or remove until content exists. */}
            <a href="#" className="ft-link">
              Privacy Policy
            </a>
          </div>

          <div className="ft-col">
            <span className="ft-col-label">Page</span>
            <nav className="ft-nav">
              {/* REVIEW: <a href="/"> forces full document reload; use react-router Link for SPA navigation. */}
              <a href="/" className="ft-link">
                Home
              </a>
              <button
                className="ft-link ft-link--btn"
                onClick={() => navigate("/steps")}
              >
                Check Interactions
              </button>
              <a href="#how-it-works" className="ft-link">
                How It Works
              </a>
              <a href="#download" className="ft-link">
                Download
              </a>
            </nav>
          </div>

          <div className="ft-col">
            <span className="ft-col-label">Social</span>
            <nav className="ft-nav">
              <a href="#" className="ft-link">
                Instagram
              </a>
              <a href="#" className="ft-link">
                LinkedIn
              </a>
              <a href="#" className="ft-link">
                Twitter
              </a>
              <a href="#" className="ft-link">
                Facebook
              </a>
            </nav>
          </div>

          <div className="ft-col">
            <span className="ft-col-label">Disclaimer</span>
            <p className="ft-disclaimer">
              Drug interaction data is sourced from the U.S. Food &amp; Drug
              Administration (OpenFDA). This is a study project — always consult
              your healthcare provider before making any changes to your
              medication regimen.
            </p>
          </div>
        </div>
      )}

      {!minimal && <div className="ft-divider" />}

      <div className="ft-brand" aria-hidden="true">
        Medax
      </div>
    </footer>
  );
}
