import React from "react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext"; // Import useTheme hook
import "../styles/settings.css"; // Ensure you have your styles

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme(); // Use the theme context

  const [userDetails, setUserDetails] = useState({
    name: "Dr. Mohamed",
    email: "dr.mohamed@dental.com",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSave = () => {
    console.log("Saving account details:", userDetails);
    // Save settings logic
  };

  return (
    <div className={`settings-container ${isDarkMode ? "dark" : ""}`}>
      <div className="card">
        <h2 className="settings-title">Settings</h2>
        <button onClick={toggleTheme}>
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
        <div className="input-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={userDetails.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={userDetails.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>
        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default Settings;
