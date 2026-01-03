import { Header, Sidebar } from "@/app";
import { AppRoutes } from "@/app/constants";
import { User } from "@/shared";
import { ReactNode, FC } from "react";
import { Navigate } from "react-router-dom";

interface AuthLayoutProps {
  user: User;
  children: ReactNode;
}

export const AuthLayout: FC<AuthLayoutProps> = ({ user, children }) => {
  return user ? (
    <div className="content-wrapper">
      <div className={`content with-sidebar`}>
        <Header loggedInUser={user} />
        <Sidebar loggedInUser={user} />

        <div className="home-page-container">
          <div className="dashboard">
            <div className="home-content">{children}</div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to={AppRoutes.WELCOME_PAGE} replace={true} />
  );
};
