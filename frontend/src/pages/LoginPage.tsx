import React from "react";

import "../styles/login.css";
import { useLoginPage } from "../hooks/useLoginPage";

const logoImage = "/dentalLogo.png";

const LoginPage: React.FC = () => {
  const dentistImage = "dentist.jpg";
  const assistantImage = "assistant.jpg";

  const {
    selectedRole,
    identifier,
    setIdentifier,
    password,
    setPassword,
    handleRoleSelection,
    handleSubmit,
    error,
  } = useLoginPage();

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
          <h3>Enter {selectedRole} Phone Number</h3>
          <input
            type="text"
            placeholder="Username or Phone Number"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="password-input"
          />
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
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default LoginPage;
