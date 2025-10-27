import { UserRole, QRCodeComponent } from "@/shared";
import React from "react";
import { useIntl } from "react-intl";
import { useAddUser } from "../hooks";
import "@styles/addAssistant.css";
const AddUserForm: React.FC = () => {
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
    role,
    setRole,
    availableRoles,
    error,
    success,
    qrPassword,
    qrUsername,
    isLoading,
  } = useAddUser();

  const intl = useIntl();

  const roleLabels = {
    [UserRole.ASSISTANT]: intl.formatMessage({ id: "role.assistant" }),
    [UserRole.DOCTOR]: intl.formatMessage({ id: "role.doctor" }),
    [UserRole.OWNER]: intl.formatMessage({ id: "role.owner" }),
  };

  return (
    <div className="add-user-container">
      <h2 className="title">{intl.formatMessage({ id: "addUser" })}</h2>
      <form onSubmit={handleSubmit} className="add-user-form">
        <div className="form-group">
          <label>{intl.formatMessage({ id: "username" })}</label>
          <input
            type="text"
            placeholder={intl.formatMessage({ id: "usernamePlaceholder" })}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>{intl.formatMessage({ id: "fullName" })}</label>
          <input
            type="text"
            placeholder={intl.formatMessage({ id: "fullNamePlaceholder" })}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>{intl.formatMessage({ id: "password" })}</label>
          <input
            type="password"
            placeholder={intl.formatMessage({ id: "passwordPlaceholder" })}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>{intl.formatMessage({ id: "phone" })}</label>
          <input
            type="tel"
            placeholder={intl.formatMessage({ id: "phonePlaceholder" })}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>{intl.formatMessage({ id: "role" })}</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="role-select"
          >
            {availableRoles.map((role) => (
              <option key={role} value={role}>
                {roleLabels[role] || role}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading
            ? intl.formatMessage({ id: "creating" })
            : intl.formatMessage({ id: "submitButton" })}
        </button>

        {error && (
          <p className="error-message">
            {intl.formatMessage({ id: "errorMessage" })}: {error}
          </p>
        )}

        {success && (
          <p className="success-message">
            {intl.formatMessage({ id: "userCreatedSuccessfully" })}
          </p>
        )}
      </form>

      {success && (
        <div className="qr-code-container">
          <QRCodeComponent username={qrUsername} password={qrPassword} />
          <div className="credentials">
            <p>
              <strong>{intl.formatMessage({ id: "username" })}:</strong>{" "}
              {qrUsername}
            </p>
            <p>
              <strong>{intl.formatMessage({ id: "password" })}:</strong>{" "}
              {qrPassword}
            </p>
            <p>
              <strong>{intl.formatMessage({ id: "role" })}:</strong>{" "}
              {roleLabels[role] || role}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUserForm;
