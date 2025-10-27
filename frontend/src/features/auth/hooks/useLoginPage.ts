import { useLogin } from "@/app";
import { AppRoutes } from "@/app/constants";
import { UserRole, isSuperAdminRole } from "@/shared";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useLoginPage = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();
  const { login, success, error, loggedInUser } = useLogin();

  useEffect(() => {
    if (success) {
      if (isSuperAdminRole(loggedInUser?.role))
        navigate(AppRoutes.ADMIN_CLINICS, { replace: true });
      else navigate(AppRoutes.Dashboard, { replace: true });
    }
  }, [success, navigate, loggedInUser?.role]);

  const handleRoleSelection = (role: UserRole) => {
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

export default useLoginPage;
