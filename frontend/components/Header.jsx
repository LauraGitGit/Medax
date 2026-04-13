import { useEffect, useState } from "react";
import "../styles/Header.css";
import pillLogo from "../images/pill-logo.png";
import { useNavigate, useLocation } from "react-router";

export default function Header() {
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
      // REVIEW: Full page reload via location.href loses SPA benefits; consider navigate("/") + hash + scroll.
      window.location.href = `/#${anchor}`;
    } else {
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  }

  const NAV_LINKS = [
    { label: "About", anchor: "about-medax" },
    { label: "How It Works", anchor: "how-it-works" },
    { label: "Download", anchor: "download" },
    { label: "Contact", anchor: "contact" },
  ];

  return (
    <header className="app-header">
      {/* REVIEW: Several header controls omit type="button"; inside a form they would default to submit—set explicitly for safety. */}
      <button
        className="header-brand"
        onClick={() =>
          onStepsPage
            ? navigate("/")
            : window.scrollTo({ top: 0, behavior: "smooth" })
        }
      >
        <img src={pillLogo} alt="Medax Logo" className="header-pill-logo" />
        <span className="header-brand-name">Medax</span>
      </button>

      <nav className="header-nav header-nav--desktop" aria-label="Main">
        {NAV_LINKS.map(({ label, anchor }) => (
          <button
            key={anchor}
            className="header-nav-link header-nav-link--btn"
            onClick={() => handleNavLink(anchor)}
          >
            {label}
          </button>
        ))}
      </nav>

      <button
        type="button"
        className="header-burger"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="header-mobile-menu"
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span className="header-burger-bar" />
        <span className="header-burger-bar" />
        <span className="header-burger-bar" />
      </button>

      <button className="header-cta" onClick={() => navigate("/steps")}>
        Let's Check
      </button>

      {menuOpen && (
        <div
          id="header-mobile-menu"
          className="header-mobile"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div
            className="header-mobile-backdrop"
            aria-hidden="true"
            onClick={() => setMenuOpen(false)}
          />
          <div className="header-mobile-panel">
            <div className="header-mobile-head">
              <span className="header-mobile-title">Menu</span>
              <button
                type="button"
                className="header-mobile-close"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                ×
              </button>
            </div>
            <nav className="header-mobile-nav" aria-label="Mobile">
              {NAV_LINKS.map(({ label, anchor }) => (
                <button
                  key={anchor}
                  type="button"
                  className="header-mobile-link"
                  onClick={() => handleNavLink(anchor)}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
