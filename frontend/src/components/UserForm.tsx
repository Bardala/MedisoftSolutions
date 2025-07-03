// components/UserForm.tsx
import React from "react";
import { useIntl } from "react-intl";
import { UserRole } from "../types/types";

interface UserFormProps {
  onSubmit: (userData: {
    username: string;
    name: string;
    password: string;
    phone: string;
    role: UserRole;
    clinicId?: number;
  }) => Promise<boolean>;
  defaultRole?: UserRole;
  initialValues?: {
    username?: string;
    name?: string;
    phone?: string;
  };
  title?: string;
  submitText?: string;
  showRoleSelector?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  defaultRole,
  initialValues,
  title,
  submitText,
  showRoleSelector = true,
}) => {
  const { formatMessage: f } = useIntl();
  const [username, setUsername] = React.useState(initialValues?.username || "");
  const [fullName, setFullName] = React.useState(initialValues?.name || "");
  const [password, setPassword] = React.useState("");
  const [phone, setPhone] = React.useState(initialValues?.phone || "");
  const [role, setRole] = React.useState<UserRole>(
    defaultRole || UserRole.ASSISTANT,
  );
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const roleLabels = {
    [UserRole.ASSISTANT]: f({ id: "role.assistant" }),
    [UserRole.DOCTOR]: f({ id: "role.doctor" }),
    [UserRole.OWNER]: f({ id: "role.owner" }),
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const success = await onSubmit({
      username,
      name: fullName,
      password,
      phone,
      role,
    });

    if (!success) {
      setError(f({ id: "user_creation_failed" }));
    }

    setIsLoading(false);
  };

  return (
    <div className="user-form-container">
      {title && <h2 className="title">{title}</h2>}
      <form onSubmit={handleFormSubmit} className="user-form">
        <div className="form-group">
          <label>{f({ id: "username" })}</label>
          <input
            type="text"
            placeholder={f({ id: "usernamePlaceholder" })}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>{f({ id: "name" })}</label>
          <input
            type="text"
            placeholder={f({ id: "fullNamePlaceholder" })}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>{f({ id: "password" })}</label>
          <input
            type="password"
            placeholder={f({ id: "passwordPlaceholder" })}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>{f({ id: "phone" })}</label>
          <input
            type="tel"
            placeholder={f({ id: "phonePlaceholder" })}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        {showRoleSelector && (
          <div className="form-group">
            <label>{f({ id: "role" })}</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="role-select"
              disabled={!!defaultRole}
            >
              {Object.values(UserRole)
                .filter((r) => r !== UserRole.SUPER_ADMIN)
                .map((role) => (
                  <option key={role} value={role}>
                    {roleLabels[role] || role}
                  </option>
                ))}
            </select>
          </div>
        )}

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading
            ? f({ id: "creating" })
            : submitText || f({ id: "create_user" })}
        </button>

        {error && (
          <p className="error-message">
            {f({ id: "errorMessage" })}: {error}
          </p>
        )}
      </form>
    </div>
  );
};
