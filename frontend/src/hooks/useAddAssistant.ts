import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { CreateUserApi } from "../apis";
import { ApiError } from "../fetch/ApiError";
import { UserReqDTO, UserResDTO, UserRole } from "../dto";

export const useAddAssistant = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [newAssistant, setNewAssistant] = useState<UserReqDTO | null>(null);
  const [qrUsername, setQrUsername] = useState("");
  const [qrPassword, setQrPassword] = useState("");

  const createUserMutation = useMutation<UserResDTO, ApiError, UserReqDTO>(
    CreateUserApi(newAssistant),
    {
      onSuccess: () => {
        setSuccess(true);
        setQrPassword(password);
        setQrUsername(username);
        resetForm();
      },
      onError: (error: ApiError) => {
        setError(error.message || "Failed to create assistant account");
      },
    },
  );

  const resetForm = () => {
    setUsername("");
    setFullName("");
    setPassword("");
    setPhone(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!username || !fullName || !password || phone === null) {
      setError("All fields are required");
      return;
    }

    setNewAssistant({
      username,
      name: fullName,
      password,
      phone,
      role: UserRole.ASSISTANT,
    });

    createUserMutation.mutate(newAssistant);
  };

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
    qrPassword,
    qrUsername,
  };
};
