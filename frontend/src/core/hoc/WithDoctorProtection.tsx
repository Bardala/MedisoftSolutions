import { AppRoutes } from "@/app/constants";
import { isDoctorRole } from "@/shared";
import { Navigate } from "react-router-dom";

/**
 * HOC for doctor-only routes
 */

export const WithDoctorProtection = ({
  user,
  children,
  redirectTo = AppRoutes.Dashboard,
}) => {
  if (isDoctorRole(user.role)) return <Navigate to={redirectTo} replace />;
  return children;
};
