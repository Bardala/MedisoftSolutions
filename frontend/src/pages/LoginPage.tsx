import React, { useEffect, useState } from "react";
import "../styles/login.css";
import { useLoginPage } from "../hooks/useLoginPage";
import {
  assistantImage,
  assistantUsername,
  doctorImage,
  doctorUsername,
  logoImage,
} from "../utils";

export const LoginPage: React.FC = () => {
  const [loginAttempts, setLoginAttempts] = useState(0);
  const maxAttempts = 3;

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("username");
    const password = params.get("password");

    if (username && password && loginAttempts < maxAttempts) {
      setIdentifier(username);
      setPassword(password);

      // Automatically trigger login
      handleSubmit();
      setLoginAttempts((prev) => prev + 1); // Increment login attempts
    } else if (loginAttempts >= maxAttempts) {
      console.error("Maximum login attempts exceeded.");
    }
  }, [setIdentifier, setPassword, handleSubmit, loginAttempts]);

  useEffect(() => {
    if (selectedRole === "Doctor") {
      setIdentifier(doctorUsername);
    } else if (selectedRole === "Assistant") {
      setIdentifier(assistantUsername);
    }
  }, [selectedRole, setIdentifier]);

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
          <img src={doctorImage} alt="Doctor Icon" className="role-icon" />
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
          {error && <p className="error-message">{error.message}</p>}
        </div>
      )}
    </div>
  );
};
