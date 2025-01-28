import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../context/loginContext";
import "../styles/settings.css";

import { useMutation } from "@tanstack/react-query";
import { UpdateUserRes, User } from "../types";
import { UpdateUserApi } from "../fetch/api";
import { ApiError } from "../fetch/ApiError";

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
      if (password !== repeatedPass)
        alert("Password don't match, check it and try again");
      else {
        updatedUser.password = password;
        await updateUserMutation.mutateAsync(updatedUser);
        alert("User information updated successfully!");
        setEditing(false);
        logout();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update user information.");
    }
  };

  return (
    <div className="settings-container">
      <div className="card">
        <h2 className="settings-title">Settings</h2>

        {loggedInUser?.role === "Doctor" && (
          <button
            className="action-button"
            onClick={() => setSelectedOption("/add-assistant")}
          >
            Add New Assistant
          </button>
        )}

        <button className="action-button" onClick={handleLogout}>
          Logout
        </button>

        <h3>Edit Profile</h3>
        {editing ? (
          <div className="edit-form">
            <form onSubmit={handleSave}>
              <h4>Username: {loggedInUser.username}</h4>
              <label>
                Name:
                <input
                  type="text"
                  value={updatedUser?.name}
                  onChange={(e) =>
                    setUpdatedUser(
                      (prev) => prev && { ...prev, name: e.target.value },
                    )
                  }
                  required
                />
              </label>
              <label>
                Phone:
                <input
                  type="tel"
                  value={updatedUser?.phone || ""}
                  onChange={(e) =>
                    setUpdatedUser(
                      (prev) => prev && { ...prev, phone: e.target.value }, // Keep it as a string
                    )
                  }
                  required
                />
              </label>

              <label>
                New Password:
                <input
                  type="password"
                  placeholder="Enter new password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <label>
                Repeat New Password:
                <input
                  type="password"
                  placeholder="Enter new password"
                  onChange={(e) => setRepeatedPass(e.target.value)}
                  required
                />
              </label>

              <button className="action-button" type="submit">
                Save Changes and logout
              </button>
              <button
                className="action-button cancel-button"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        ) : (
          <button className="action-button" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Settings;
