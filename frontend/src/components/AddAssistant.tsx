import React from "react";
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

  return (
    <div className="add-assistant-container">
      <h2 className="title">Add Assistant</h2>
      <form onSubmit={handleSubmit} className="add-assistant-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit" className="submit-button">
          Create Assistant
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && (
          <p className="success-message">
            Assistant account created successfully!
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
