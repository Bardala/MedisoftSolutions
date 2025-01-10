import React from "react";
import "../styles/addAssistant.css";
import { useAddAssistant } from "../hooks/useAddAssistant";

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
          onChange={(e) => setPhone(e.target.valueAsNumber)}
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
    </div>
  );
};

export default AddAssistant;
