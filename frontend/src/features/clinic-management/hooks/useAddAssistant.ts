import { useLogin } from "@/app";
import { UserApi } from "@/core";
import { UserReqDTO, UserResDTO } from "@/dto";
import { UserRole, ApiError } from "@/shared";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export const useAddUser = () => {
  const { loggedInUser: currentUser } = useLogin(); // Get current user info
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState<string>("");
  const [role, setRole] = useState<UserRole>(UserRole.ASSISTANT); // Default role
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<UserReqDTO | null>(null);
  const [qrUsername, setQrUsername] = useState("");
  const [qrPassword, setQrPassword] = useState("");

  // todo: debug it
  const createUserMutation = useMutation<UserResDTO, ApiError, UserReqDTO>(
    () => UserApi.create(newUser),
    {
      onSuccess: () => {
        setSuccess(true);
        setQrPassword(password);
        setQrUsername(username);
        resetForm();
      },
      onError: (error: ApiError) => {
        setError(error.message || "Failed to create user account");
      },
    },
  );

  const resetForm = () => {
    setUsername("");
    setFullName("");
    setPassword("");
    setPhone("");
    setRole(UserRole.ASSISTANT);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate fields
    if (!username || !fullName || !password || !phone) {
      setError("All fields are required");
      return;
    }

    // Role validation
    if (role === UserRole.SUPER_ADMIN) {
      setError("Cannot create Super Admin accounts");
      return;
    }

    // Only Super Admin can create Owner accounts
    if (role === UserRole.OWNER && currentUser?.role !== UserRole.SUPER_ADMIN) {
      setError("Only Super Admin can create Owner accounts");
      return;
    }

    const userData: UserReqDTO = {
      username,
      name: fullName,
      password,
      phone,
      role,
    };

    setNewUser(userData);
    createUserMutation.mutate(userData);
  };

  const availableRoles = Object.values(UserRole).filter((userRole) => {
    if (
      currentUser.role === UserRole.ASSISTANT ||
      currentUser.role === UserRole.DOCTOR
    )
      return false;
    if (userRole === UserRole.SUPER_ADMIN) return false;

    if (userRole === UserRole.OWNER)
      return currentUser?.role === UserRole.SUPER_ADMIN;

    return true;
  });

  return {
    handleSubmit,
    error,
    success,
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
    qrPassword,
    qrUsername,
    availableRoles,
    isLoading: createUserMutation.isLoading,
  };
};
