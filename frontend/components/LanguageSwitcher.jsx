import { useTranslation } from "../i18n/LanguageContext";
import "../styles/LanguageSwitcher.css";

export default function LanguageSwitcher({ className = "" }) {
  const { locale, setLocale, t } = useTranslation();

  return (
    <div
      className={`lang-switcher ${className}`.trim()}
      role="group"
      aria-label={t("language.switchLabel")}
    >
      <button
        type="button"
        className={`lang-switcher-btn ${locale === "sv" ? "lang-switcher-btn--active" : ""}`}
        onClick={() => setLocale("sv")}
        aria-pressed={locale === "sv"}
      >
        SV
      </button>
      <button
        type="button"
        className={`lang-switcher-btn ${locale === "en" ? "lang-switcher-btn--active" : ""}`}
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  );
}
