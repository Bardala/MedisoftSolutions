import React from "react";
import "../styles/sidebar.css";

const Sidebar = ({ loggedInUser, setSelectedOption }) => {
  const menuItems =
    loggedInUser === "Doctor"
      ? [
          { label: "Patient Records", link: "/patients" },
          { label: "Daily Reports", link: "/reports" },
          { label: "Settings", link: "/settings" },
          { label: "Patient Profile", link: "/patient-profile" },
          { label: "Monthly Reports", link: "/monthly-reports" },
          { label: "Patient History", link: "/patient-history" },
        ]
      : [
          { label: "Add New Patient", link: "/add-patient" },
          { label: "View Patient List", link: "/patient-list" },
          { label: "Manage Roles", link: "/roles" },
          { label: "Record Payments", link: "/payments" },
          { label: "Daily Financial Report", link: "/reports" },
          { label: "Patient History", link: "/patient-history" },
        ];

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">{loggedInUser}'s Dashboard</h2>
      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="sidebar-item"
            onClick={() => setSelectedOption(item.link)}
          >
            <span className="sidebar-link">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
