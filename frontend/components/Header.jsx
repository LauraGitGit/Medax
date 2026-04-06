import "../styles/Header.css";
import pillLogo from "../images/pill-logo.png";
import { useNavigate, useLocation } from "react-router";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const onStepsPage = location.pathname === "/steps";

  function handleNavLink(anchor) {
    if (onStepsPage) {
      window.location.href = `/#${anchor}`;
    } else {
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
    }
  }

  const NAV_LINKS = [
    { label: "How It Works", anchor: "how-it-works" },
    { label: "About", anchor: "about" },
    { label: "Download", anchor: "download" },
    { label: "Contact", anchor: "contact" },
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
        <img src={pillLogo} alt="Medax Logo" className="header-pill-logo" />
        <span className="header-brand-name">Medax</span>
      </button>

      <nav className="header-nav">
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

      <button className="header-cta" onClick={() => navigate("/steps")}>
        Let's Check
      </button>
    </header>
  );
}
