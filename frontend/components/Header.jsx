import { useEffect, useState } from "react";
import "../styles/Header.css";
import pillLogo from "../images/pill-logo.png";
import { useNavigate, useLocation } from "react-router";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import { useTranslation } from "../i18n/LanguageContext.jsx";

export default function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const onStepsPage = location.pathname === "/steps";
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  function handleNavLink(anchor) {
    if (onStepsPage) {
      window.location.href = `/#${anchor}`;
    } else {
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  }

  const NAV_LINKS = [
    { labelKey: "header.about", anchor: "about-medax" },
    { labelKey: "header.howItWorks", anchor: "how-it-works" },
    { labelKey: "header.download", anchor: "download" },
    { labelKey: "header.contact", anchor: "contact" },
  ];

  return (
    <header className="app-header">
      <button
        className="header-brand"
        onClick={() =>
          onStepsPage
            ? navigate("/")
            : window.scrollTo({ top: 0, behavior: "smooth" })
        }
      >
        <img
          src={pillLogo}
          alt={t("common.medaxLogo")}
          className="header-pill-logo"
        />
        <span className="header-brand-name">{t("common.brand")}</span>
      </button>

      <nav
        className="header-nav header-nav--desktop"
        aria-label={t("header.mainNav")}
      >
        {NAV_LINKS.map(({ labelKey, anchor }) => (
          <button
            key={anchor}
            className="header-nav-link header-nav-link--btn"
            onClick={() => handleNavLink(anchor)}
          >
            {t(labelKey)}
          </button>
        ))}
      </nav>

      <button
        type="button"
        className="header-burger"
        aria-label={menuOpen ? t("header.closeMenu") : t("header.openMenu")}
        aria-expanded={menuOpen}
        aria-controls="header-mobile-menu"
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span className="header-burger-bar" />
        <span className="header-burger-bar" />
        <span className="header-burger-bar" />
      </button>

      <button className="header-cta" onClick={() => navigate("/steps")}>
        {t("header.letsCheck")}
      </button>

      {menuOpen && (
        <div
          id="header-mobile-menu"
          className="header-mobile"
          role="dialog"
          aria-modal="true"
          aria-label={t("header.navMenu")}
        >
          <div
            className="header-mobile-backdrop"
            aria-hidden="true"
            onClick={() => setMenuOpen(false)}
          />
          <div className="header-mobile-panel">
            <div className="header-mobile-head">
              <span className="header-mobile-title">{t("header.menu")}</span>
              <button
                type="button"
                className="header-mobile-close"
                aria-label={t("header.closeMenu")}
                onClick={() => setMenuOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="header-mobile-lang">
              <LanguageSwitcher />
            </div>
            <nav
              className="header-mobile-nav"
              aria-label={t("header.mobileNav")}
            >
              {NAV_LINKS.map(({ labelKey, anchor }) => (
                <button
                  key={anchor}
                  type="button"
                  className="header-mobile-link"
                  onClick={() => handleNavLink(anchor)}
                >
                  {t(labelKey)}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
