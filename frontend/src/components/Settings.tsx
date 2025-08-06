import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../context/loginContext";
import "../styles/settings.css";

import { FormattedMessage } from "react-intl";
import { LanguageContext } from "../IntlProviderWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faCog,
  faEdit,
  faLanguage,
  faSignOutAlt,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { isOwnerRole } from "../types";
import { AppRoutes } from "../constants";

const Settings = () => {
  const navigate = useNavigate();
  const { logout, loggedInUser } = useLogin();
  const { locale, switchLanguage } = useContext(LanguageContext);

  const handleLogout = () => {
    logout();
    navigate(AppRoutes.WELCOME_PAGE);
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h1 className="settings-title">
          <FontAwesomeIcon icon={faCog} />{" "}
          <FormattedMessage id="settings" defaultMessage="Settings" />
        </h1>

        <div className="settings-grid">
          {isOwnerRole(loggedInUser?.role) && (
            <>
              <button
                className="action-button"
                onClick={() => navigate("/add-assistant")}
              >
                <FontAwesomeIcon icon={faUserPlus} className="button-icon" />
                <FormattedMessage
                  id="addUser"
                  defaultMessage="Add New Assistant"
                />
              </button>

              <button
                className="action-button"
                onClick={() => navigate("/clinic-settings")}
              >
                <FontAwesomeIcon icon={faBuilding} className="button-icon" />
                <FormattedMessage
                  id="clinicSettings.title"
                  defaultMessage="Other settings"
                />
              </button>
            </>
          )}

          <button className="action-button" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="button-icon" />
            <FormattedMessage id="logout" defaultMessage="Logout" />
          </button>

          <button
            className="action-button"
            onClick={() => navigate("/update-user-info")}
          >
            <FontAwesomeIcon icon={faEdit} className="button-icon" />
            <FormattedMessage id="editProfile" defaultMessage="Edit Profile" />
          </button>

          <button
            className="action-button"
            onClick={() => switchLanguage(locale === "en" ? "ar" : "en")}
          >
            <FontAwesomeIcon icon={faLanguage} className="button-icon" />
            {locale === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
