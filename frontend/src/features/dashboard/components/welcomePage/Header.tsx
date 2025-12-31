import React from "react";
import {
  faMoon,
  faSun,
  faChevronRight,
  faPlay,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "@/app/constants";
import { programLogoImage } from "@/utils";
import { useTheme } from "@/app/providers";
import { useIntl } from "react-intl";
import { LanguageContext } from "@/core/localization";
import { useContext } from "react";

interface HeaderProps {
  onDemoLogin: () => void;
  isLoggingInDemo: boolean;
}

const Header: React.FC<HeaderProps> = ({ onDemoLogin, isLoggingInDemo }) => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { formatMessage: f, locale } = useIntl();
  const { switchLanguage } = useContext(LanguageContext);

  return (
    <header className="glass-header">
      <div className="header-content">
        <div className="logo-animation">
          <div className="logo-pulse" />
          <img src={programLogoImage} alt="MediSoft" className="logo-image" />
        </div>
        <div className="logo-text">
          <h1 className="logo-glow">MediSoft</h1>
          <span className="tagline-slide">{f({ id: "tagline" })}</span>
        </div>
      </div>

      <nav className="nav-buttons">
        <button
          className="nav-btn login-btn"
          onClick={() => navigate(AppRoutes.LOGIN)}
        >
          <span className="btn-text">{f({ id: "login" })}</span>
          <FontAwesomeIcon icon={faChevronRight} className="btn-icon" />
        </button>
        <button
          className="nav-btn signup-btn pulse-animation"
          onClick={() => navigate(AppRoutes.SIGNUP)}
        >
          <span className="btn-text">{f({ id: "signup" })}</span>
          <FontAwesomeIcon icon={faStar} className="btn-icon" />
        </button>
        <button
          className="nav-btn demo-btn"
          onClick={onDemoLogin}
          disabled={isLoggingInDemo}
        >
          {isLoggingInDemo ? (
            <div className="spinner" />
          ) : (
            <>
              <span className="btn-text">{f({ id: "tryDemo" })}</span>
              <FontAwesomeIcon icon={faPlay} className="btn-icon" />
            </>
          )}
        </button>
        <button
          className="language-btn"
          onClick={() => switchLanguage(locale === "en" ? "ar" : "en")}
          title={
            locale === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"
          }
        >
          {locale === "en" ? "العربية" : "EN"}
        </button>
        <button className="theme-btn" onClick={toggleTheme}>
          <div className="theme-toggle">
            <FontAwesomeIcon
              icon={isDarkMode ? faMoon : faSun}
              className={`theme-icon ${isDarkMode ? "dark" : "light"}`}
            />
          </div>
        </button>
      </nav>
    </header>
  );
};

export default Header;
