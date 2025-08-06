import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { useLogin } from "./context/loginContext";
import { LoginPage } from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { AppRoutes } from "./constants";
import WelcomePage from "./pages/WelcomePage";

const App = () => {
  const { loggedInUser } = useLogin();

  return (
    <div className="main-app">
      <BrowserRouter>
        {/* <div> */}
        <Routes>
          <Route path={AppRoutes.WELCOME_PAGE} element={<WelcomePage />} />
          <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
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
    </div>
  );
};

export default App;
