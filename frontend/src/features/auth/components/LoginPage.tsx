import { isDoctorRole, UserRole, isAssistantRole } from "@/shared";
import {
  programLogoImage,
  doctorImage,
  assistantImage,
  translateErrorMessage,
} from "@/utils";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useLoginPage } from "../hooks";
import "@styles/login.css";

const LoginPage: React.FC = () => {
  const [loginAttempts, setLoginAttempts] = useState(0);
  const maxAttempts = 3;
  const { formatMessage: f, locale } = useIntl();

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

  return (
    <div className="login-page">
      <img
        src={programLogoImage}
        alt="Dental Management System Logo"
        className="logo"
      />

      <h1 className="title">{f({ id: "login.welcome" })}</h1>
      <div className="roles">
        <div
          className={`role-card ${
            isDoctorRole(selectedRole) ? "selected" : ""
          }`}
          onClick={() => handleRoleSelection(UserRole.DOCTOR)}
        >
          <img src={doctorImage} alt="Doctor Icon" className="role-icon" />
          <h2>{f({ id: "login.doctor" })}</h2>
        </div>

        <div
          className={`role-card ${
            isAssistantRole(selectedRole) ? "selected" : ""
          }`}
          onClick={() => handleRoleSelection(UserRole.ASSISTANT)}
        >
          <img
            src={assistantImage}
            alt="Assistant Icon"
            className="role-icon"
          />
          <h2>{f({ id: "login.assistant" })}</h2>
        </div>
      </div>

      {selectedRole && (
        <div className="password-section">
          <h3>
            {f(
              { id: "login.login" },
              {
                role: f({
                  id: `login.${selectedRole.toLowerCase()}`,
                }),
              },
            )}
          </h3>
          <input
            type="text"
            placeholder={f({
              id: "login.usernamePlaceholder",
            })}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="password-input"
          />
          <input
            type="password"
            placeholder={f({
              id: "login.passwordPlaceholder",
            })}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="password-input"
          />
          <button onClick={handleSubmit} className="submit-button">
            {f({ id: "login.submit" })}
          </button>
          {error && (
            <p className="error">
              {f(
                { id: "errorMessage" },
                { error: translateErrorMessage(error.message, locale) },
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginPage;
