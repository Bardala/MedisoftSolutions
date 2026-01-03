import { AppRoutes } from "@/app/constants";
import { isOwnerRole } from "@/shared";
import { Navigate } from "react-router-dom";

/**
 * HOC for owner-only routes
 */

export const WithOwnerProtection = ({
  user,
  children,
  redirectTo = AppRoutes.Dashboard,
}) => {
  if (!isOwnerRole(user.role)) return <Navigate to={redirectTo} replace />;

  return children;
};
