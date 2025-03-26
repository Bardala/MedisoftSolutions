import React from "react";
import { useIntl } from "react-intl";
import "../styles/addAssistant.css";
import { useAddAssistant } from "../hooks/useAddAssistant";
import QRCodeComponent from "./QRCodeComponent";

const AddAssistant: React.FC = () => {
  const {
    handleSubmit,
    username,
    setUsername,
    fullName,
    setFullName,
    password,
    setPassword,
    phone,
    setPhone,
    error,
    success,
    qrPassword,
    qrUsername,
  } = useAddAssistant();

  const intl = useIntl();

  return (
    <div className="add-assistant-container">
      <h2 className="title">{intl.formatMessage({ id: "title" })}</h2>
      <form onSubmit={handleSubmit} className="add-assistant-form">
        <input
          type="text"
          placeholder={intl.formatMessage({ id: "usernamePlaceholder" })}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder={intl.formatMessage({ id: "fullNamePlaceholder" })}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={intl.formatMessage({ id: "passwordPlaceholder" })}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder={intl.formatMessage({ id: "phonePlaceholder" })}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit" className="submit-button">
          {intl.formatMessage({ id: "submitButton" })}
        </button>
        {error && (
          <p className="error-message">
            {intl.formatMessage({ id: "errorMessage" })}
          </p>
        )}
        {success && (
          <p className="success-message">
            {intl.formatMessage({ id: "successMessage" })}
          </p>
        )}
      </form>

      {success && (
        <div className="qr-code-container">
          <QRCodeComponent username={qrUsername} password={qrPassword} />
        </div>
      )}
    </div>
  );
};

export default AddAssistant;
