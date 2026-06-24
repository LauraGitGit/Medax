import "../styles/Footer.css";
import { useNavigate } from "react-router";
import { useTranslation } from "../i18n/LanguageContext.jsx";

export default function Footer({ minimal = false }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <footer
      id="contact"
      className={`ft-wrap ${minimal ? "ft-wrap--minimal" : ""}`}
    >
      {!minimal && (
        <div className="ft-grid">
          <div className="ft-col">
            <span className="ft-col-label">{t("footer.emailUs")}</span>
            <a href="mailto:hello@medax.app" className="ft-email">
              hello@medax.app
            </a>
            <p className="ft-copy">© 2026 Medax</p>
            <a href="#" className="ft-link">
              {t("footer.privacyPolicy")}
            </a>
          </div>

          <div className="ft-col">
            <span className="ft-col-label">{t("footer.page")}</span>
            <nav className="ft-nav">
              <a href="/" className="ft-link">
                {t("footer.home")}
              </a>
              <button
                className="ft-link ft-link--btn"
                onClick={() => navigate("/steps")}
              >
                {t("footer.checkInteractions")}
              </button>
              <a href="#how-it-works" className="ft-link">
                {t("footer.howItWorks")}
              </a>
              <a href="#download" className="ft-link">
                {t("footer.download")}
              </a>
            </nav>
          </div>

          <div className="ft-col">
            <span className="ft-col-label">{t("footer.social")}</span>
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
            <span className="ft-col-label">{t("footer.disclaimer")}</span>
            <p className="ft-disclaimer">{t("footer.disclaimerText")}</p>
          </div>
        </div>
      )}

      {!minimal && <div className="ft-divider" />}

      <div className="ft-brand" aria-hidden="true">
        {t("common.brand")}
      </div>
    </footer>
  );
}
