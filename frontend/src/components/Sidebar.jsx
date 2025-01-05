import React from "react";
import "../styles/sidebar.css";
import dentistImage from "../images/dentist.jpg";
import assistantImage from "../images/assistant.jpg";
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

const Sidebar = ({ loggedInUser, setSelectedOption }) => {
  const menuItems =
    loggedInUser === "Doctor"
      ? [
          { label: "Current Patient", link: "/patient-profile", icon: faUser },
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

  return (
    <div className="sidebar">
      <div className="sidebar-user-photo-container">
        {loggedInUser === "Doctor" ? (
          <img src={dentistImage} alt="Doctor" className="sidebar-user-photo" />
        ) : (
          <img
            src={assistantImage}
            alt="Assistant"
            className="sidebar-user-photo"
          />
        )}
      </div>

      <h3 className="sidebar-subtitle">
        {loggedInUser === "Doctor" ? "Welcome Dr.Mohamed" : "Welcome Mr.Ahmed"}
      </h3>

      <ul className="sidebar-menu">
        <li className="sidebar-home" onClick={() => setSelectedOption("/")}>
          <FontAwesomeIcon icon={faHome} className="sidebar-home-icon" />
          {/* <span className="sidebar-link">Home</span> */}
        </li>

        {menuItems.map((item, index) => (
          <li
            key={index}
            className="sidebar-item"
            onClick={() => setSelectedOption(item.link)}
          >
            <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
            <span className="sidebar-link">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
