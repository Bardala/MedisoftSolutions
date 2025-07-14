import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../context/loginContext";

export const useLoginPage = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();
  const { login, success, error } = useLogin();

  useEffect(() => {
    if (success) {
      navigate("/", { replace: true });
    }
  }, [success, navigate]);

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role);
    setPassword("");
    setIdentifier("");
  };

  const handleSubmit = async () => {
    if (password) {
      try {
        await login(identifier, password);
      } catch (err) {
        console.error("Login failed", err);
      }
    }
  };

  return {
    selectedRole,
    setSelectedRole,
    identifier,
    setIdentifier,
    password,
    setPassword,
    navigate,
    login,
    success,
    error,
    handleRoleSelection,
    handleSubmit,
  };
};
