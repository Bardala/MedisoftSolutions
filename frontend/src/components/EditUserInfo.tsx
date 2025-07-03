import { useState } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { useLogin } from "../context/loginContext";
import { User } from "../types";
import { useUpdateUser } from "../hooks/useUser";
import { UserReqDTO } from "../dto";

export const EditUserInfo = () => {
  const { logout, loggedInUser } = useLogin();
  const { mutateAsync: updateUserMutation } = useUpdateUser();
  const { formatMessage: f } = useIntl();
  const [password, setPassword] = useState("");
  const [repeatedPass, setRepeatedPass] = useState("");
  const [updatedUser, setUpdatedUser] = useState<User | null>(loggedInUser);
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatedUser) return;

    try {
      if (password !== repeatedPass) alert(f({ id: "password.mismatch" }));
      else {
        updatedUser.password = password;
        await updateUserMutation(updatedUser as UserReqDTO);
        alert(f({ id: "user.update.success" }));
        logout();
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
            <FormattedMessage id="newPassword" defaultMessage="New Password" />
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
        </form>
      </div>
    </>
  );
};
