import "../styles/header.css";
import { useTheme } from "../context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUsers,
  faClipboardList,
  faFileAlt,
  faCalendarAlt,
  faCog,
  faList,
  faSearch,
  faHome,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { HeaderProps } from "../types";
import { FC } from "react";

const Header: FC<HeaderProps> = ({ loggedInUser, setSelectedOption }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const dentistImage = "../images/dentist.jpg";
  const assistantImage = "../images/assistant.jpg";

  const menuItems =
    loggedInUser.role === "Doctor"
      ? [
          { label: "Home", link: "/", icon: faHome },
          { label: "Current Patient", link: "/patient-profile", icon: faUser },
          { label: "Patient Records", link: "/patients", icon: faUsers },
          {
            label: "Registry",
            link: "/patient-history",
            icon: faSearch,
          },
          { label: "Daily Reports", link: "/reports", icon: faFileAlt },
          {
            label: "Monthly Reports",
            link: "/monthly-reports",
            icon: faCalendarAlt,
          },
          { label: "Settings", link: "/settings", icon: faCog },
        ]
      : [
          { label: "Home", link: "/", icon: faHome },
          // {
          //   label: "Add New Patient",
          //   link: "/add-patient",
          //   icon: faPlusCircle,
          // },
          { label: "Current Patient", link: "/patient-profile", icon: faUser },
          { label: "Wait List", link: "/patients", icon: faList },
          {
            label: "Registry",
            link: "/patient-history",
            icon: faClipboardList,
          },
          // { label: "Record Payments", link: "/payments", icon: faDollarSign },
          {
            label: "Daily Financial Report",
            link: "/reports",
            icon: faFileAlt,
          },
          { label: "Settings", link: "/settings", icon: faCog },
        ];

  return (
    <div className="header">
      <div className="header-content">
        <img
          src={loggedInUser.role === "Doctor" ? dentistImage : assistantImage}
          alt={loggedInUser.name}
          className="header-user-photo"
        />

        <span className="username">{loggedInUser.name}</span>

        <div className="header-icons">
          {menuItems.map((item, index) => (
            <FontAwesomeIcon
              key={index}
              icon={item.icon}
              className="header-icon"
              onClick={() => setSelectedOption(item.link)}
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
