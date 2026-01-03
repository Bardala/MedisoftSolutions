import { AppRoutes } from "@/app/constants";
import { isSuperAdminRole } from "@/shared";
import { Navigate } from "react-router-dom";

/**
 * HOC for super admin-only routes
 */

export const WithSuperAdminProtection = ({
  user,
  children,
  redirectTo = AppRoutes.Dashboard,
}) => {
  if (!isSuperAdminRole(user.role)) return <Navigate to={redirectTo} replace />;
  return children;
};
