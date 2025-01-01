import React, { createContext, useContext, useState } from "react";

// Create the context
const LoginContext = createContext();

// Create a provider component
// Create a provider component
export const LoginProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(
    localStorage.getItem("loggedInUser"),
  );

  const login = (username) => {
    setLoggedInUser(username);
    localStorage.setItem("loggedInUser", username);
  };

  const logout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("loggedInUser");
  };

  return (
    <LoginContext.Provider value={{ loggedInUser, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};

// Custom hook for easy access
export const useLogin = () => useContext(LoginContext);
