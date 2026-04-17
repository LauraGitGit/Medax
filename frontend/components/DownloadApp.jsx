import "../styles/DownloadApp.css";
import appLogo from "../images/round-with-medax-background.png";

function AppleIcon() {
  return (
    <svg
      viewBox="0 0 814 1000"
      fill="currentColor"
      className="store-icon store-icon-apple"
    >
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.6-49.1 189.2-49.1 30.4 0 110.6 2.6 173.3 80.2zm-170.9-146.4c33.6-39.8 57.1-95.4 57.1-150.9 0-7.7-.6-15.5-2-22.5-54.4 2-117.8 36.2-156.6 80.8-31 35.5-60.3 91.2-60.3 147.5 0 8.3 1.3 16.6 1.9 19.2 3.2.6 8.4 1.3 13.6 1.3 49 0 110.8-32.8 146.3-75.4z" />
    </svg>
  );
}

function AndroidIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="store-icon">
      <path d="M17.523 15.341a.91.91 0 0 1-.91-.91V9.77a.91.91 0 1 1 1.82 0v4.66a.91.91 0 0 1-.91.91zm-11.046 0a.91.91 0 0 1-.91-.91V9.77a.91.91 0 1 1 1.82 0v4.66a.91.91 0 0 1-.91.91zM8.706 5.104l-.97-1.73a.2.2 0 0 1 .347-.195l.985 1.757A6.385 6.385 0 0 1 12 4.42c.99 0 1.927.22 2.77.617l.985-1.757a.2.2 0 0 1 .347.194l-.97 1.73A6.451 6.451 0 0 1 18.42 9.3H5.58a6.451 6.451 0 0 1 3.126-4.196zM10.13 7.26a.52.52 0 1 0 0-1.04.52.52 0 0 0 0 1.04zm3.74 0a.52.52 0 1 0 0-1.04.52.52 0 0 0 0 1.04zM5.965 9.77h12.07v6.79a1.3 1.3 0 0 1-1.3 1.3h-.91v2.73a.91.91 0 1 1-1.82 0v-2.73H9.995v2.73a.91.91 0 1 1-1.82 0v-2.73h-.91a1.3 1.3 0 0 1-1.3-1.3V9.77z" />
    </svg>
  );
}

export default function DownloadApp() {
  return (
    <section id="download" className="da-section">
      <div className="da-left">
        <div className="da-dots">
          <span />
          <span />
        </div>
        <h2 className="da-heading">What's Next</h2>
        <p className="da-subtext">
          A future mobile app of Medax could help users access medication safety
          information more quickly when practical questions come up in daily
          life.
        </p>
        <div className="da-buttons">
          <button className="da-btn">
            <AppleIcon />
          </button>
          <button className="da-btn">
            <AndroidIcon />
          </button>
        </div>
      </div>

      <div className="da-right">
        <div className="da-blob" />
        <div className="da-phone">
          <div className="da-phone-screen">
            <div className="da-phone-notch" />
            <div className="da-phone-content">
              <img src={appLogo} alt="Medax App" className="da-app-logo" />
              <p className="da-app-welcome">Welcome to Medax</p>
              <p className="da-app-sub">
                Intelligent medication interaction analysis at your fingertips.
              </p>
              <button className="da-app-btn">Get Started</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
