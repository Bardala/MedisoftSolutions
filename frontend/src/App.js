import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { useLogin } from "./context/loginContext";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

const App = () => {
  const { loggedInUser } = useLogin();

  return (
    <div className="main-app">
      <BrowserRouter>
        <div className="content-wrapper">
          <div className={`content ${loggedInUser ? "with-sidebar" : ""}`}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={<HomePage loggedInUser={loggedInUser} />}
              />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
