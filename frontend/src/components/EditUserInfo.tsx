import { useState } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { useLogin } from "../context/loginContext";
import { User } from "../types";
import { useUpdateUser } from "../hooks/useUser";
import { UpdateUserReqDTO } from "../dto";

export const EditUserInfo = () => {
  const { logout, loggedInUser } = useLogin();
  const { mutateAsync: updateUserMutation, isError, error } = useUpdateUser();
  const { formatMessage: f } = useIntl();
  const [password, setPassword] = useState("");
  const [repeatedPass, setRepeatedPass] = useState("");
  const [lastPassword, setLastPassword] = useState(""); // New state
  const [updatedUser, setUpdatedUser] = useState<User | null>(loggedInUser);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatedUser) return;

    try {
      // Only validate passwords if new password is provided
      if (password) {
        if (password !== repeatedPass) {
          alert(f({ id: "password.mismatch" }));
          return;
        }
        if (!lastPassword) {
          alert(f({ id: "lastPassword.required" }));
          return;
        }
      }

      const userUpdate: UpdateUserReqDTO = {
        username: updatedUser.username,
        name: updatedUser.name,
        phone: updatedUser.phone,
        role: updatedUser.role,
        profilePicture: updatedUser.profilePicture,
        ...(password ? { password, lastPassword } : {}), // Only include password fields if changing
      };

      await updateUserMutation({ updatedUser: userUpdate });
      alert(f({ id: "user.update.success" }));
      if (password) {
        logout(); // Only logout if password was changed
      }
    } catch (error) {
      console.error(error);
      alert(f({ id: "user.update.error" }));
    }
  };

  return (
    <>
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
            <FormattedMessage id="newPassword" defaultMessage="New Password" />:
            <input
              type="password"
              placeholder={f({
                id: "enterNewPassword",
                defaultMessage:
                  "Enter new password (leave blank to keep current)",
              })}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {password && (
            <>
              <label>
                <FormattedMessage
                  id="lastPassword"
                  defaultMessage="Current Password"
                />
                :
                <input
                  type="password"
                  placeholder={f({
                    id: "enterLastPassword",
                    defaultMessage: "Enter your current password",
                  })}
                  onChange={(e) => setLastPassword(e.target.value)}
                  required={!!password}
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
                  required={!!password}
                />
              </label>
            </>
          )}

          {isError && <div className="error-message">{error.message}</div>}

          <button className="action-button" type="submit">
            <FormattedMessage id="saveChanges" defaultMessage="Save Changes" />
          </button>
        </form>
      </div>
    </>
  );
};
