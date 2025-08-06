import "../styles/header.css";
import { useTheme } from "../context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { HeaderProps, isDoctorRole } from "../types";
import { FC } from "react";
import { useSidebar } from "../hooks/useSidebar";
import { assistantImage, doctorImage } from "../utils";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../constants";

const Header: FC<HeaderProps> = ({ loggedInUser }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { menuItems } = useSidebar(loggedInUser);
  const navigate = useNavigate();

  return (
    <div className="header">
      <div className="header-content">
        <img
          src={isDoctorRole(loggedInUser.role) ? doctorImage : assistantImage}
          alt={loggedInUser.name}
          className="header-user-photo"
        />

        <span className="username">{loggedInUser.name}</span>

        <div className="header-icons">
          <FontAwesomeIcon
            icon={faHome}
            className="header-icon"
            onClick={() => navigate(AppRoutes.Dashboard)}
          />
          {menuItems.map((item, index) => (
            <FontAwesomeIcon
              key={index}
              icon={item.icon}
              className="header-icon"
              onClick={() => navigate(item.link)}
            />
          ))}
        </div>

        {/* Theme Toggle Button */}
        <button className="theme-toggle-button" onClick={toggleTheme}>
          <FontAwesomeIcon
            icon={isDarkMode ? faMoon : faSun}
            className="theme-icon"
          />
        </button>
      </div>
    </div>
  );
};

export default Header;
