import "../styles/Header.css";
import logo from "../images/round-without-medax-background.png";
import rectangleLogo from "../images/rectangle-with-background.png";

export default function Header() {
  return (
    <header className="app-header">
      <div className="logo-section">
        <img src={logo} className="logo" alt="Medax Logo" />
      </div>
      <div className="logo-text">
        <h1>Medax</h1>
        <p>Intelligent medication interaction analysis.</p>
      </div>
      <div className="header-spacer" aria-hidden="true" />
      <img
        src={rectangleLogo}
        className="mobile-rectangle-logo"
        alt="Medax Logo"
      />
    </header>
  );
}
