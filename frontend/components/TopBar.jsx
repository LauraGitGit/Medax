import Header from "./Header.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import "../styles/TopBar.css";

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="top-bar-inner">
        <div className="top-bar-spacer" aria-hidden="true" />
        <Header />
        <LanguageSwitcher className="lang-switcher--top" />
      </div>
    </div>
  );
}
