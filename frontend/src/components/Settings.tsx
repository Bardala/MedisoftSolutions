import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../context/loginContext";
import "../styles/settings.css";

import { useMutation } from "@tanstack/react-query";
import { UpdateUserRes, User } from "../types";
import { UpdateUserApi } from "../apis/userApis";
import { ApiError } from "../fetch/ApiError";
import { FormattedMessage, useIntl } from "react-intl";
import { LanguageContext } from "../IntlProviderWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

export const useUpdateUser = () => {
  const updateUserMutation = useMutation<UpdateUserRes, ApiError, User>(
    (updatedUser) => UpdateUserApi(updatedUser),
  );

  return { updateUserMutation };
};

const Settings = ({
  setSelectedOption,
}: {
  setSelectedOption: (option: string) => void;
}) => {
  const navigate = useNavigate();
  const { logout, loggedInUser } = useLogin();
  const { updateUserMutation } = useUpdateUser();
  const { locale, switchLanguage } = useContext(LanguageContext);
  const { formatMessage: f } = useIntl(); // React-Intl instance for placeholders

  const [editing, setEditing] = useState(false);
  const [password, setPassword] = useState("");
  const [repeatedPass, setRepeatedPass] = useState("");
  const [updatedUser, setUpdatedUser] = useState<User | null>(loggedInUser);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatedUser) return;

    try {
      if (password !== repeatedPass) alert(f({ id: "password.mismatch" }));
      else {
        updatedUser.password = password;
        await updateUserMutation.mutateAsync(updatedUser);
        alert(f({ id: "user.update.success" }));
        setEditing(false);
        logout();
      }
    } catch (error) {
      console.error(error);
      alert(f({ id: "user.update.error" }));
    }
  };

  return (
    <div className="settings-container">
      <div className="card">
        <h1 className="settings-title">
          <FontAwesomeIcon icon={faCog} />{" "}
          <FormattedMessage id="settings" defaultMessage="Settings" />
        </h1>

        {loggedInUser?.role === "Doctor" && (
          <button
            className="action-button"
            onClick={() => setSelectedOption("/add-assistant")}
          >
            <FormattedMessage
              id="addAssistant"
              defaultMessage="Add New Assistant"
            />
          </button>
        )}

        <button className="action-button" onClick={handleLogout}>
          <FormattedMessage id="logout" defaultMessage="Logout" />
        </button>

        <h3>
          <FormattedMessage id="editProfile" defaultMessage="Edit Profile" />
        </h3>
        {editing ? (
          <div className="edit-form">
            <form onSubmit={handleSave}>
              <h4>
                <FormattedMessage id="username" defaultMessage="Username" />:{" "}
                {loggedInUser.username}
              </h4>
              <label>
                <FormattedMessage id="name" defaultMessage="Name" />:
                <input
                  type="text"
                  value={updatedUser?.name}
                  onChange={(e) =>
                    setUpdatedUser(
                      (prev) => prev && { ...prev, name: e.target.value },
                    )
                  }
                  required
                  placeholder={f({
                    id: "enterName",
                    defaultMessage: "Enter your name",
                  })}
                />
              </label>
              <label>
                <FormattedMessage id="phone" defaultMessage="Phone" />:
                <input
                  type="tel"
                  value={updatedUser?.phone || ""}
                  onChange={(e) =>
                    setUpdatedUser(
                      (prev) => prev && { ...prev, phone: e.target.value },
                    )
                  }
                  required
                  placeholder={f({
                    id: "enterPhone",
                    defaultMessage: "Enter your phone",
                  })}
                />
              </label>

              <label>
                <FormattedMessage
                  id="newPassword"
                  defaultMessage="New Password"
                />
                :
                <input
                  type="password"
                  placeholder={f({
                    id: "enterNewPassword",
                    defaultMessage: "Enter new password",
                  })}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <label>
                <FormattedMessage
                  id="repeatNewPassword"
                  defaultMessage="Repeat New Password"
                />
                :
                <input
                  type="password"
                  placeholder={f({
                    id: "repeatNewPassword",
                    defaultMessage: "Repeat new password",
                  })}
                  onChange={(e) => setRepeatedPass(e.target.value)}
                  required
                />
              </label>

              <button className="action-button" type="submit">
                <FormattedMessage
                  id="saveChanges"
                  defaultMessage="Save Changes and logout"
                />
              </button>
              <button
                className="action-button cancel-button"
                onClick={() => setEditing(false)}
              >
                <FormattedMessage id="cancel" defaultMessage="Cancel" />
              </button>
            </form>
          </div>
        ) : (
          <button className="action-button" onClick={() => setEditing(true)}>
            <FormattedMessage id="editProfile" defaultMessage="Edit Profile" />
          </button>
        )}

        {/* Switch Language Button */}
        <button
          className="action-button"
          onClick={() => switchLanguage(locale === "en" ? "ar" : "en")}
        >
          {locale === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
