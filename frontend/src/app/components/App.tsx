import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

import { Analytics } from "@vercel/analytics/react";
import { AppRoutes } from "@/app/constants";
import { LoginPage, SignupPage, TermsPage } from "@/features/auth";
import { WelcomePage, HomePage } from "@/features/dashboard/components";
import { PrivacyPolicyPage } from "@/features/auth/components/PrivacyPolicyPage";
import { useLogin } from "../providers";

const App = () => {
  const { loggedInUser } = useLogin();

  return (
    <div className="main-app">
      <BrowserRouter>
        <Routes>
          <Route path={AppRoutes.WELCOME_PAGE} element={<WelcomePage />} />
          <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
          <Route path={AppRoutes.SIGNUP} element={<SignupPage />} />
          <Route path={AppRoutes.TERMS} element={<TermsPage />} />
          <Route
            path={AppRoutes.PRIVACY_POLICY}
            element={<PrivacyPolicyPage />}
          />

          <Route
            path="/*"
            element={
              loggedInUser ? (
                <HomePage loggedInUser={loggedInUser} />
              ) : (
                <Navigate to={AppRoutes.WELCOME_PAGE} replace={true} />
              )
            }
          />
        </Routes>
      </BrowserRouter>

      <Analytics />
    </div>
  );
};

export default App;
