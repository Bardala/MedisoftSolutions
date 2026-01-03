import { AppRoutes } from "@/app/constants";
import { CLINIC_STAFF_ROLES } from "@/shared";
import { Navigate } from "react-router-dom";

export const WithClinicStaffProtection = ({
  user,
  children,
  redirectTo = AppRoutes.Dashboard,
}) => {
  if (!CLINIC_STAFF_ROLES.includes(user.role))
    return <Navigate to={redirectTo} replace />;

  return children;
};
