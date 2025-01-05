import React from "react";
import "../styles/header.css";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../context/loginContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUsers,
  faClipboardList,
  faFileAlt,
  faCalendarAlt,
  faCog,
  faPlusCircle,
  faList,
  faDollarSign,
  faUserShield,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import dentistImage from "../images/dentist.jpg";
import assistantImage from "../images/assistant.jpg";

const Header = ({ username, setSelectedOption }) => {
  const navigate = useNavigate();
  const { logout } = useLogin();

  const menuItems =
    username === "Doctor"
      ? [
          { label: "Home", link: "/", icon: faHome },
          {
            label: "Current Patient",
            link: "/patient-profile",
            icon: faUser,
          },
          { label: "Patient Records", link: "/patients", icon: faUsers },
          {
            label: "Registry",
            link: "/patient-history",
            icon: faClipboardList,
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
          {
            label: "Add New Patient",
            link: "/add-patient",
            icon: faPlusCircle,
          },
          { label: "View Patient List", link: "/patient-list", icon: faList },
          {
            label: "Registry",
            link: "/patient-history",
            icon: faClipboardList,
          },
          { label: "Record Payments", link: "/payments", icon: faDollarSign },
          {
            label: "Daily Financial Report",
            link: "/reports",
            icon: faFileAlt,
          },
          { label: "Manage Roles", link: "/roles", icon: faUserShield },
        ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="header">
      <div className="header-content">
        <img
          src={username === "Doctor" ? dentistImage : assistantImage}
          alt={username}
          className="header-user-photo"
        />

        <span className="username">
          Welcome, {username === "Doctor" ? "Dr.Mohamed" : "Mr.Ahmed"}
        </span>

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
        {/* //todo: move it into settings */}
        {/* <button className="logout-button" onClick={handleLogout}>
          Logout
        </button> */}
      </div>
    </div>
  );
};

export default Header;
