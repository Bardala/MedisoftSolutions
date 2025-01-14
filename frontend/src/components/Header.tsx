import "../styles/header.css";

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
import { HeaderProps } from "../types";
import { FC } from "react";

const Header: FC<HeaderProps> = ({ loggedInUser, setSelectedOption }) => {
  const dentistImage = "../images/dentist.jpg";
  const assistantImage = "../images/assistant.jpg";

  const menuItems =
    loggedInUser.role === "Doctor"
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

  return (
    <div className="header">
      <div className="header-content">
        <img
          src={loggedInUser.role === "Doctor" ? dentistImage : assistantImage}
          alt={loggedInUser.name}
          className="header-user-photo"
        />

        <span className="username">
          Welcome, {loggedInUser.role === "Doctor" ? "Dr" : "Mr"}{" "}
          {loggedInUser.name}
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
      </div>
    </div>
  );
};

export default Header;
