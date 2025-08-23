import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { useLogin } from "./context/loginContext";
import { LoginPage } from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { AppRoutes } from "./constants";
import WelcomePage from "./pages/WelcomePage";
import { SignupPage } from "./pages/SignupPage";
import TermsPage from "./components/TermsPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { Analytics } from "@vercel/analytics/react";

const App = () => {
  const { loggedInUser } = useLogin();

  return (
    <div className="main-app">
      <BrowserRouter>
        {/* <div> */}
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
        {/* </div> */}
      </BrowserRouter>

      <Analytics />
    </div>
  );
};

export default App;
