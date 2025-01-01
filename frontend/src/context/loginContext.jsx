import React, { createContext, useContext, useState } from "react";

// Create the context
const LoginContext = createContext();

// Create a provider component
export const LoginProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const login = (username) => {
    setLoggedInUser(username);
  };

  const logout = () => {
    setLoggedInUser(null);
  };

  return (
    <LoginContext.Provider value={{ loggedInUser, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};

// Custom hook for easy access
export const useLogin = () => useContext(LoginContext);
