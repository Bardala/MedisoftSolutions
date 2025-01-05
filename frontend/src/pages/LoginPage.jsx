import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/login.css";
import dentistImage from "../images/dentist.jpg";
import assistantImage from "../images/assistant.jpg";
import { useLogin } from "../context/loginContext";

const logoImage = "/dentalLogo.png";
// const logoImage = "/dentalBackground.png";

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useLogin();

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setPassword("");
  };

  const handleSubmit = () => {
    if (password) {
      login(selectedRole);
      navigate("/");
    } else {
      alert("Please enter a password!");
    }
  };

  return (
    <div className="login-page">
      <img
        src={logoImage}
        alt="Dental Management System Logo"
        className="logo"
      />

      <h1 className="title">Welcome to Dental Management System</h1>
      <div className="roles">
        <div
          className={`role-card ${selectedRole === "Doctor" ? "selected" : ""}`}
          onClick={() => handleRoleSelection("Doctor")}
        >
          <img src={dentistImage} alt="Doctor Icon" className="role-icon" />
          <h2>Doctor</h2>
        </div>

        <div
          className={`role-card ${
            selectedRole === "Assistant" ? "selected" : ""
          }`}
          onClick={() => handleRoleSelection("Assistant")}
        >
          <img
            src={assistantImage}
            alt="Assistant Icon"
            className="role-icon"
          />
          <h2>Assistant</h2>
        </div>
      </div>

      {selectedRole && (
        <div className="password-section">
          <h3>Enter {selectedRole} Password</h3>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="password-input"
          />
          <button onClick={handleSubmit} className="submit-button">
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
