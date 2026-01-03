import { AppRoutes } from "@/app/constants";
import { FC } from "react";
import { Navigate } from "react-router-dom";
import { User, UserRole } from "@/shared";

/**
 * HOC for protecting routes based on user role
 */

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  user,
  allowedRoles,
  children,
  redirectTo = AppRoutes.Dashboard,
}) => {
  if (!user) return <Navigate to={AppRoutes.WELCOME_PAGE} replace />;
  if (!allowedRoles.includes(user.role))
    return <Navigate to={redirectTo} replace />;

  return children;
};
export interface ProtectedRouteProps {
  user: User;
  allowedRoles: UserRole[];
  children: JSX.Element;
  redirectTo?: string;
}
